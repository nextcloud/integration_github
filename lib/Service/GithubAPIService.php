<?php
/**
 * Nextcloud - github
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier
 * @copyright Julien Veyssier 2020
 */

namespace OCA\Github\Service;

use DateInterval;
use DateTime;
use Exception;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use OCA\Github\AppInfo\Application;
use OCP\Dashboard\Model\WidgetItem;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IURLGenerator;
use Psr\Log\LoggerInterface;
use OCP\Http\Client\IClientService;
use Throwable;

class GithubAPIService {
	/**
	 * @var LoggerInterface
	 */
	private $logger;
	/**
	 * @var IL10N
	 */
	private $l10n;
	/**
	 * @var \OCP\Http\Client\IClient
	 */
	private $client;
	/**
	 * @var IConfig
	 */
	private $config;
	/**
	 * @var IURLGenerator
	 */
	private $urlGenerator;

	/**
	 * Service to make requests to GitHub v3 (JSON) API
	 */
	public function __construct (string $appName,
								LoggerInterface $logger,
								IL10N $l10n,
								IConfig $config,
								IURLGenerator $urlGenerator,
								IClientService $clientService) {
		$this->logger = $logger;
		$this->l10n = $l10n;
		$this->client = $clientService->newClient();
		$this->config = $config;
		$this->urlGenerator = $urlGenerator;
	}

	/**
	 * Request an avatar image
	 * @param string $userId
	 * @param string $githubUserName
	 * @return array|null Avatar image data
	 * @throws Exception
	 */
	public function getAvatar(string $userId, string $githubUserName): ?array {
		$userInfo = $this->request($userId, 'users/' . $githubUserName);
		if (!isset($userInfo['error']) && isset($userInfo['avatar_url'])) {
			$avatarResponse = $this->client->get($userInfo['avatar_url']);
			return [
				'body' => $avatarResponse->getBody(),
				'headers' => $avatarResponse->getHeaders(),
			];
		}
		return null;
	}

	/**
	 * Actually get notifications
	 * @param string $userId
	 * @param ?bool $participating optional param to only show notifications the user is participating to
	 * @param ?string $since optional date to filter notifications
	 * @param int $limit
	 * @return array notification list or error
	 */
	public function getNotifications(string $userId, ?bool $participating = null, ?string $since = null, int $limit = 7): array {
		$params = [];
		if (is_null($since)) {
			$twoWeeksEarlier = new DateTime();
			$twoWeeksEarlier->sub(new DateInterval('P14D'));
			$params['since'] = $twoWeeksEarlier->format('Y-m-d\TH:i:s\Z');
		} else {
			$params['since'] = $since;
		}
		if (!is_null($participating)) {
			$params['participating'] = $participating ? 'true' : 'false';
		}
		$notifications = $this->request($userId, 'notifications', $params);
		if (isset($notifications['error'])) {
			return $notifications;
		}
		$interestingNotifications = array_filter($notifications, static function(array $notification) {
			return $notification['unread']
				&& (
					in_array($notification['reason'], ['assign', 'mention', 'review_requested'])
					|| (
						$notification['reason'] === 'subscribed' && ($notification['subject']['type'] ?? '') === 'Release'
					)
				);
		});
		return array_slice($interestingNotifications, 0, $limit);
	}

	public function getWidgetFromNotification(array $notification): WidgetItem {
		return new WidgetItem(
			$notification['subject']['title'] ?? '',
			($notification['repository']['name'] ?? '') . $this->getTargetIdentifier($notification),
			$this->getItemLink($notification),
			$this->getItemIconUrl($notification),
			$notification['updated_at'] ?? ''
		);
	}

	private function getItemIconUrl(array $notification): string {
		$repoOwnerLogin = $notification['repository']['owner']['login'] ?? '';
		return $repoOwnerLogin === ''
			? ''
			: $this->urlGenerator->getAbsoluteURL(
				$this->urlGenerator->linkToRoute(Application::APP_ID . '.githubAPI.getAvatar', [
					'githubLogin' => $repoOwnerLogin,
				])
			);
	}

	private function getTargetIdentifier(array $notification): string {
		if (in_array($notification['subject']['type'] ?? '', ['PullRequest', 'Issue'])
			&& isset($notification['subject']['url'])
			&& $notification['subject']['url']
		) {
			$parts = explode('/', $notification['subject']['url']);
			if (count($parts) > 0) {
				return '#' . end($parts);
			}
		}
		return '';
	}

	private function getItemLink(array $notification): string {
		$subjectType = $notification['subject']['type'] ?? '';
		if ($subjectType === 'Release') {
			$url = $notification['subject']['url'] ?? '';
			$url = str_replace('api.github.com', 'github.com', $url);
			$url = str_replace('/repos/', '/', $url);
			return preg_replace('/\/[0-9]+/', '', $url);
		} elseif ($subjectType !== 'Discussion') {
			$url = $notification['subject']['url'] ?? '';
			$url = str_replace('api.github.com', 'github.com', $url);
			$url = str_replace('/repos/', '/', $url);
			return str_replace('/pulls/', '/pull/', $url);
		}
		// this is a discussion
		$repoFullName = $notification['repository']['full_name'] ?? '';
		return 'https://github.com/' . $repoFullName . '/discussions';
	}

	/**
	 * Unsubscribe a notification, does the same as in GitHub notifications page
	 * @param string $userId
	 * @param int $id Notification id
	 * @return array request result
	 */
	public function unsubscribeNotification(string $userId, int $id): array {
		$params = [
			'ignored' => true
		];
		return $this->request($userId, 'notifications/threads/' . $id . '/subscription', $params, 'PUT');
	}

	/**
	 * Mark a notification as read
	 * @param string $userId
	 * @param int $id Notification id
	 * @return array request result
	 */
	public function markNotificationAsRead(string $userId, int $id): array {
		return $this->request($userId, 'notifications/threads/' . $id, [], 'POST');
	}

	/**
	 * Search repositories
	 * @param string $userId
	 * @param string $query What to search for
	 * @param int $offset
	 * @param int $limit
	 * @return array request result
	 */
	public function searchRepositories(string $userId, string $query, int $offset = 0, int $limit = 5): array {
		$params = [
			'q' => $query,
			'order' => 'desc'
		];
		$result = $this->request($userId, 'search/repositories', $params, 'GET', true);
		if (!isset($result['error'])) {
			$result['items'] = array_slice($result['items'], $offset, $limit);
		}
		return $result;
	}

	/**
	 * Search issues and PRs
	 * @param string $userId
	 * @param string $query What to search for
	 * @param int $offset
	 * @param int $limit
	 * @return array request result
	 */
	public function searchIssues(string $userId, string $query, int $offset = 0, int $limit = 5): array {
		$params = [
			'q' => $query,
			'order' => 'desc'
		];
		$result = $this->request($userId, 'search/issues', $params, 'GET', true);
		if (!isset($result['error'])) {
			$result['items'] = array_slice($result['items'], $offset, $limit);
			$reposToGet = [];
			foreach ($result['items'] as $k => $entry) {
				$repoFullName = str_replace('https://api.github.com/repos/', '', $entry['repository_url']);
				$spl = explode('/', $repoFullName);
				$owner = $spl[0];
				$repo = $spl[1];
				$number = $entry['number'];
				if (isset($entry['pull_request'])) {
					$info = $this->request($userId, 'repos/' . $owner . '/' . $repo . '/' . 'pulls/' . $number);
					if (!isset($info['error'])) {
						$result['items'][$k]['merged'] = $info['merged'];
						if (isset($info['head'], $info['head']['repo'], $info['head']['repo']['owner'], $info['head']['repo']['owner']['login'], $info['head']['repo']['owner']['avatar_url'])) {
							$result['items'][$k]['project_avatar_url'] = $info['head']['repo']['owner']['avatar_url'];
							$result['items'][$k]['project_owner_login'] = $info['head']['repo']['owner']['login'];
						}
					}
				} else {
					$reposToGet[] = [
						'key' => $repoFullName,
						'owner' => $owner,
						'repo' => $repo,
					];
				}
			}
			// get repos info (for issues only)
			$repoAvatarUrls = [];
			$repoOwnerLogins = [];
			foreach ($reposToGet as $repo) {
				$info = $this->request($userId, 'repos/' . $repo['owner'] . '/' . $repo['repo'], [], 'GET', true);
				if (!isset($info['error']) && isset($info['owner'], $info['owner']['avatar_url'], $info['owner']['login'])) {
					$repoAvatarUrls[$repo['key']] = $info['owner']['avatar_url'];
					$repoOwnerLogins[$repo['key']] = $info['owner']['login'];
				}
			}
			foreach ($result['items'] as $k => $entry) {
				$repoFullName = str_replace('https://api.github.com/repos/', '', $entry['repository_url']);
				if (!isset($entry['pull_request'])
					&& array_key_exists($repoFullName, $repoAvatarUrls)
					&& array_key_exists($repoFullName, $repoOwnerLogins)
				) {
					$result['items'][$k]['project_avatar_url'] = $repoAvatarUrls[$repoFullName];
					$result['items'][$k]['project_owner_login'] = $repoOwnerLogins[$repoFullName];
				}
			}
		}
		return $result;
	}

	/**
	 * @param string|null $userId
	 * @param string $githubUserName
	 * @return array
	 */
	public function getUserInfo(?string $userId, string $githubUserName): array {
		return $this->request($userId, 'users/' . $githubUserName, [], 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $githubUserName
	 * @param string $subjectType
	 * @param int $subjectId
	 * @return array
	 */
	public function getContextualUserInfo(?string $userId, string $githubUserName, string $subjectType, int $subjectId): array {
		$params = [
			'subject_type' => $subjectType,
			'subject_id' => $subjectId,
		];
		return $this->request($userId, 'users/' . $githubUserName . '/hovercard', $params, 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $owner
	 * @param string $repo
	 * @param int $issueNumber
	 * @return array
	 */
	public function getIssueInfo(?string $userId, string $owner, string $repo, int $issueNumber): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/issues/' . $issueNumber;
		return $this->request($userId, $endpoint, [], 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $owner
	 * @param string $repo
	 * @param int $issueNumber
	 * @return array
	 */
	public function getIssueReactionsInfo(?string $userId, string $owner, string $repo, int $issueNumber): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/issues/' . $issueNumber . '/reactions';
		return $this->request($userId, $endpoint, [], 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $owner
	 * @param string $repo
	 * @param int $commentId
	 * @return array
	 */
	public function getIssueCommentInfo(?string $userId, string $owner, string $repo, int $commentId): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/issues/comments/' . $commentId;
		return $this->request($userId, $endpoint, [], 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $owner
	 * @param string $repo
	 * @param int $commentId
	 * @return array
	 */
	public function getIssueCommentReactionsInfo(?string $userId, string $owner, string $repo, int $commentId): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/issues/comments/' . $commentId . '/reactions';
		return $this->request($userId, $endpoint, [], 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $owner
	 * @param string $repo
	 * @param int $prNumber
	 * @return array
	 */
	public function getPrInfo(?string $userId, string $owner, string $repo, int $prNumber): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/pulls/' . $prNumber;
		return $this->request($userId, $endpoint, [], 'GET', true);
	}

	/**
	 * @param string|null $userId
	 * @param string $owner
	 * @param string $repo
	 * @param string $ref
	 * @param string $filePath
	 * @return array
	 */
	public function getFileContent(?string $userId, string $owner, string $repo, string $ref, string $filePath): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/contents/' . $filePath;
		$params = [
			'ref' => $ref,
		];
		return $this->request($userId, $endpoint, $params, 'GET', true);
	}

	public function getCommitInfo(?string $userId, string $owner, string $repo, string $ref): array {
		$endpoint = 'repos/' . $owner . '/' . $repo . '/commits/' . $ref;
		return $this->request($userId, $endpoint, [], 'GET', true);
	}

	/**
	 * Make an authenticated HTTP request to GitHub API
	 * @param string|null $userId
	 * @param string $endPoint The path to reach in api.github.com
	 * @param array $params Query parameters (key/val pairs)
	 * @param string $method HTTP query method
	 * @param bool $useDefaultToken
	 * @return array decoded request result or error
	 */
	public function request(?string $userId, string $endPoint, array $params = [], string $method = 'GET', bool $useDefaultToken = false): array {
		try {
			$url = 'https://api.github.com/' . $endPoint;
			$options = [
				'headers' => [
					'User-Agent' => 'Nextcloud GitHub integration',
				],
			];
			// use user access token in priority
			// fallback to admin default token if $useDefaultToken
			$accessToken = '';
			if ($userId !== null) {
				$accessToken = $this->config->getUserValue($userId, Application::APP_ID, 'token');
			}
			if ($accessToken === '' && $useDefaultToken) {
				$accessToken = $this->config->getAppValue(Application::APP_ID, 'default_link_token');
			}
			if ($accessToken !== '') {
				$options['headers']['Authorization'] = 'token ' . $accessToken;
			}

			if (count($params) > 0) {
				if ($method === 'GET') {
					$paramsContent = http_build_query($params);
					$url .= '?' . $paramsContent;
				} else {
					$options['body'] = json_encode($params);
				}
			}

			if ($method === 'GET') {
				$response = $this->client->get($url, $options);
			} else if ($method === 'POST') {
				$response = $this->client->post($url, $options);
			} else if ($method === 'PUT') {
				$response = $this->client->put($url, $options);
			} else if ($method === 'DELETE') {
				$response = $this->client->delete($url, $options);
			} else {
				return ['error' => $this->l10n->t('Bad HTTP method')];
			}
			$body = $response->getBody();
			$respCode = $response->getStatusCode();

			if ($respCode >= 400) {
				return ['error' => $this->l10n->t('Bad credentials')];
			} else {
				return json_decode($body, true) ?: [];
			}
		} catch (ClientException | ServerException $e) {
			$responseBody = $e->getResponse()->getBody();
			$parsedResponseBody = json_decode($responseBody, true);
			if ($e->getResponse()->getStatusCode() === 404) {
				// Only log inaccessible github links as debug
				$this->logger->debug('GitHub API error : ' . $e->getMessage(), ['response_body' => $responseBody, 'app' => Application::APP_ID]);
			} else {
				$this->logger->warning('GitHub API error : ' . $e->getMessage(), ['response_body' => $responseBody, 'app' => Application::APP_ID]);
			}
			return [
				'error' => $e->getMessage(),
				'body' => $parsedResponseBody,
			];
		} catch (Exception | Throwable $e) {
			$this->logger->warning('GitHub API error : ' . $e->getMessage(), ['app' => Application::APP_ID]);
			return ['error' => $e->getMessage()];
		}
	}

	public function revokeOauthToken(string $userId): array {
		$accessToken = $this->config->getUserValue($userId, Application::APP_ID, 'token');
		$clientId = $this->config->getAppValue(Application::APP_ID, 'client_id');
		$clientSecret = $this->config->getAppValue(Application::APP_ID, 'client_secret');
		$endPoint = 'applications/' . $clientId . '/token';
		try {
			$url = 'https://api.github.com/' . $endPoint;
			$options = [
				'headers' => [
					'User-Agent' => 'Nextcloud GitHub integration',
					'Authorization' => 'Basic ' . base64_encode($clientId . ':' . $clientSecret),
				],
				'body' => json_encode([
					'access_token' => $accessToken,
				]),
			];

			$response = $this->client->delete($url, $options);
			$respCode = $response->getStatusCode();

			if ($respCode >= 400) {
				return ['error' => $this->l10n->t('Bad credentials')];
			} else {
				return [];
			}
		} catch (Exception $e) {
			$this->logger->warning('GitHub API error : '.$e->getMessage(), ['app' => Application::APP_ID]);
			return ['error' => $e->getMessage()];
		}
	}

	/**
	 * Make the request to get an OAuth token
	 * @param array $params Query parameters (key/val pairs)
	 * @param string $method HTTP query method
	 * @return array parsed result or error
	 */
	public function requestOAuthAccessToken(array $params = [], string $method = 'GET'): array {
		try {
			$url = 'https://github.com/login/oauth/access_token';
			$options = [
				'headers' => [
					'User-Agent' => 'Nextcloud GitHub integration'
				],
			];

			if (count($params) > 0) {
				if ($method === 'GET') {
					$paramsContent = http_build_query($params);
					$url .= '?' . $paramsContent;
				} else {
					$options['body'] = $params;
				}
			}

			if ($method === 'GET') {
				$response = $this->client->get($url, $options);
			} else if ($method === 'POST') {
				$response = $this->client->post($url, $options);
			} else if ($method === 'PUT') {
				$response = $this->client->put($url, $options);
			} else if ($method === 'DELETE') {
				$response = $this->client->delete($url, $options);
			} else {
				return ['error' => $this->l10n->t('Bad HTTP method')];
			}
			$body = $response->getBody();
			$respCode = $response->getStatusCode();

			if ($respCode >= 400) {
				return ['error' => $this->l10n->t('OAuth access token refused')];
			} else {
				parse_str($body, $resultArray);
				return $resultArray;
			}
		} catch (Exception $e) {
			$this->logger->warning('GitHub OAuth error : '.$e->getMessage(), ['app' => Application::APP_ID]);
			return ['error' => $e->getMessage()];
		}
	}
}
