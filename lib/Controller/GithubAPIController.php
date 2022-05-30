<?php
/**
 * Nextcloud - github
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2020
 */

namespace OCA\Github\Controller;

use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\IConfig;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Github\Service\GithubAPIService;
use OCA\Github\AppInfo\Application;

class GithubAPIController extends Controller {

	/**
	 * @var GithubAPIService
	 */
	private $githubAPIService;
	/**
	 * @var string
	 */
	private $accessToken;

	public function __construct(string $appName,
								IRequest $request,
								IConfig $config,
								GithubAPIService $githubAPIService,
								?string $userId) {
		parent::__construct($appName, $request);
		$this->githubAPIService = $githubAPIService;
		$this->accessToken = $config->getUserValue($userId, Application::APP_ID, 'token');
	}

	/**
	 * @NoAdminRequired
	 *
	 * Get notification list
	 *
	 * @param ?string $since optional date to filter notifications
	 * @return DataResponse the notifications
	 */
	public function getNotifications(?string $since = null): DataResponse {
		if ($this->accessToken === '') {
			return new DataResponse(null, 400);
		}
		$result = $this->githubAPIService->getNotifications($this->accessToken, $since, false);
		if (isset($result['error'])) {
			$response = new DataResponse($result['error'], 401);
		} else {
			$response = new DataResponse($result);
		}
		return $response;
	}

	/**
	 * @NoAdminRequired
	 *
	 * Unsubscribe a notification, does the same as in Github notifications page
	 * @param int $id Notification id
	 * @return DataResponse with request result
	 */
	public function unsubscribeNotification(int $id): DataResponse {
		$result = $this->githubAPIService->unsubscribeNotification($this->accessToken, $id);
		if (!isset($result['error'])) {
			$response = new DataResponse($result);
		} else {
			$response = new DataResponse($result, 401);
		}
		return $response;
	}

	/**
	 * @NoAdminRequired
	 *
	 * Mark a notification as read
	 * @param int $id Notification id
	 * @return DataResponse with request result
	 */
	public function markNotificationAsRead(int $id): DataResponse {
		$result = $this->githubAPIService->markNotificationAsRead($this->accessToken, $id);
		if (!isset($result['error'])) {
			$response = new DataResponse($result);
		} else {
			$response = new DataResponse($result, 401);
		}
		return $response;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * Get repository avatar
	 * @param string $githubUserName
	 * @return DataDisplayResponse The avatar image content
	 */
	public function getAvatar(string $githubUserName): DataDisplayResponse {
		$avatarContent = $this->githubAPIService->getAvatar($this->accessToken, $githubUserName);
		if (is_null($avatarContent)) {
			return new DataDisplayResponse('', 400);
		} else {
			$response = new DataDisplayResponse($avatarContent);
			$response->cacheFor(60*60*24);
			return $response;
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $githubUserName
	 * @return DataResponse
	 */
	public function getUserInfo(string $githubUserName): DataResponse {
		$result = $this->githubAPIService->getUserInfo($this->accessToken, $githubUserName);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $owner
	 * @param string $repo
	 * @param int $issueNumber
	 * @return DataResponse
	 */
	public function getIssueInfo(string $owner, string $repo, int $issueNumber): DataResponse {
		$result = $this->githubAPIService->getIssueInfo($this->accessToken, $owner, $repo, $issueNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $owner
	 * @param string $repo
	 * @param int $commentId
	 * @return DataResponse
	 */
	public function getIssueCommentInfo(string $owner, string $repo, int $commentId): DataResponse {
		$result = $this->githubAPIService->getIssueCommentInfo($this->accessToken, $owner, $repo, $commentId);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $owner
	 * @param string $repo
	 * @param int $prNumber
	 * @return DataResponse
	 */
	public function getPrInfo(string $owner, string $repo, int $prNumber): DataResponse {
		$result = $this->githubAPIService->getPrInfo($this->accessToken, $owner, $repo, $prNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}
}
