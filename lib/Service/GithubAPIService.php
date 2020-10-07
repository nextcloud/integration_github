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

use OCP\IL10N;
use Psr\Log\LoggerInterface;
use OCP\Http\Client\IClientService;

class GithubAPIService {

	private $l10n;
	private $logger;

	/**
	 * Service to make requests to GitHub v3 (JSON) API
	 */
	public function __construct (
		string $appName,
		LoggerInterface $logger,
		IL10N $l10n,
		IClientService $clientService
	) {
		$this->appName = $appName;
		$this->l10n = $l10n;
		$this->logger = $logger;
		$this->clientService = $clientService;
		$this->client = $clientService->newClient();
	}

	/**
	 * Request an avatar image
	 * @param string $url The avatar URL
	 * @return string Avatar image data
	 */
	public function getAvatar(string $url): string {
		return $this->client->get($url)->getBody();
	}

	/**
	 * Actually get notifications
	 * @param string $accessToken
	 * @param ?string $since optional date to filter notifications
	 * @param ?bool $participating optional param to only show notifications the user is participating to
	 * @return array notification list or error
	 */
	public function getNotifications(string $accessToken, ?string $since = null, ?bool $participating = null): array {
		$params = [];
		if (is_null($since)) {
			$twoWeeksEarlier = new \DateTime();
			$twoWeeksEarlier->sub(new \DateInterval('P14D'));
			$params['since'] = $twoWeeksEarlier->format('Y-m-d\TH:i:s\Z');
		} else {
			$params['since'] = $since;
		}
		if (!is_null($participating)) {
			$params['participating'] = $participating ? 'true' : 'false';
		}
		$result = $this->request($accessToken, 'notifications', $params);
		return $result;
	}

	/**
	 * Unsubscribe a notification, does the same as in GitHub notifications page
	 * @param string $accessToken
	 * @param int $id Notification id
	 * @return array request result
	 */
	public function unsubscribeNotification(string $accessToken, int $id): array {
		$params = [
			'ignored' => true
		];
		$result = $this->request($accessToken, 'notifications/threads/' . $id . '/subscription', $params, 'PUT');
		return $result;
	}

	/**
	 * Mark a notification as read
	 * @param string $accessToken
	 * @param int $id Notification id
	 * @return array request result
	 */
	public function markNotificationAsRead(string $accessToken, int $id): array {
		$result = $this->request($accessToken, 'notifications/threads/' . $id, [], 'POST');
		return $result;
	}

	/**
	 * Search repositories
	 * @param string $accessToken
	 * @param string $query What to search for
	 * @param int $offset
	 * @param int $limit
	 * @return array request result
	 */
	public function searchRepositories(string $accessToken, string $query, int $offset = 0, int $length = 5): array {
		$params = [
			'q' => $query,
			'order' => 'desc'
		];
		$result = $this->request($accessToken, 'search/repositories', $params, 'GET');
		if (!isset($result['error'])) {
			$result['items'] = array_slice($result['items'], $offset, $length);
		}
		return $result;
	}

	/**
	 * Search issues and PRs
	 * @param string $accessToken
	 * @param string $query What to search for
	 * @param int $offset
	 * @param int $limit
	 * @return array request result
	 */
	public function searchIssues(string $accessToken, string $query, int $offset = 0, int $length = 5): array {
		$params = [
			'q' => $query,
			'order' => 'desc'
		];
		$result = $this->request($accessToken, 'search/issues', $params, 'GET');
		if (!isset($result['error'])) {
			$result['items'] = array_slice($result['items'], $offset, $length);
			$reposToGet = [];
			foreach ($result['items'] as $k => $entry) {
				$repoFullName = str_replace('https://api.github.com/repos/', '', $entry['repository_url']);
				$spl = explode('/', $repoFullName);
				$owner = $spl[0];
				$repo = $spl[1];
				$number = $entry['number'];
				if (isset($entry['pull_request'])) {
					$info = $this->request($accessToken, 'repos/' . $owner . '/' . $repo . '/' . 'pulls/' . $number);
					if (!isset($info['error'])) {
						$result['items'][$k]['merged'] = $info['merged'];
						if ($info['head'] && $info['head']['repo'] && $info['head']['repo']['owner'] && $info['head']['repo']['owner'] && $info['head']['repo']['owner']['avatar_url']) {
							$result['items'][$k]['project_avatar_url'] = $info['head']['repo']['owner']['avatar_url'];
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
			foreach ($reposToGet as $repo) {
				$info = $this->request($accessToken, 'repos/' . $repo['owner'] . '/' . $repo['repo']);
				if (!isset($info['error']) && $info['owner'] && $info['owner']['avatar_url']) {
					$repoAvatarUrls[$repo['key']] = $info['owner']['avatar_url'];
				}
			}
			foreach ($result['items'] as $k => $entry) {
				$repoFullName = str_replace('https://api.github.com/repos/', '', $entry['repository_url']);
				if (!isset($entry['pull_request']) && array_key_exists($repoFullName, $repoAvatarUrls)) {
					$result['items'][$k]['project_avatar_url'] = $repoAvatarUrls[$repoFullName];
				}
			}
		}
		return $result;
	}

	/**
	 * Make the HTTP request
	 * @param string $accessToken
	 * @param string $endPoint The path to reach in api.github.com
	 * @param array $params Query parameters (key/val pairs)
	 * @param string $method HTTP query method
	 * @return array decoded request result or error
	 */
	public function request(string $accessToken, string $endPoint, array $params = [], string $method = 'GET'): array {
		try {
			$url = 'https://api.github.com/' . $endPoint;
			$options = [
				'headers' => [
					'Authorization' => 'token ' . $accessToken,
					'User-Agent' => 'Nextcloud GitHub integration'
				],
			];

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
			}
			$body = $response->getBody();
			$respCode = $response->getStatusCode();

			if ($respCode >= 400) {
				return ['error' => $this->l10n->t('Bad credentials')];
			} else {
				return json_decode($body, true) ?: [];
			}
		} catch (\Exception $e) {
			$this->logger->warning('GitHub API error : '.$e->getMessage(), array('app' => $this->appName));
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
			}
			$body = $response->getBody();
			$respCode = $response->getStatusCode();

			if ($respCode >= 400) {
				return ['error' => $this->l10n->t('OAuth access token refused')];
			} else {
				parse_str($body, $resultArray);
				return $resultArray;
			}
		} catch (\Exception $e) {
			$this->logger->warning('GitHub OAuth error : '.$e->getMessage(), array('app' => $this->appName));
			return ['error' => $e->getMessage()];
		}
	}
}
