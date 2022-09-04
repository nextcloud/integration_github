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

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Github\Service\GithubAPIService;

class GithubAPIController extends Controller {

	/**
	 * @var GithubAPIService
	 */
	private $githubAPIService;
	/**
	 * @var string|null
	 */
	private $userId;

	public function __construct(string $appName,
								IRequest $request,
								GithubAPIService $githubAPIService,
								?string $userId) {
		parent::__construct($appName, $request);
		$this->githubAPIService = $githubAPIService;
		$this->userId = $userId;
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
		$result = $this->githubAPIService->getNotifications($this->userId, false, $since);
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
		$result = $this->githubAPIService->unsubscribeNotification($this->userId, $id);
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
		$result = $this->githubAPIService->markNotificationAsRead($this->userId, $id);
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
	 * TODO remove CSRF and make this endpoint public
	 * but first: understand why it fails for images and not for data requests
	 *
	 * Get repository avatar
	 * @param string $githubUserName
	 * @return DataDisplayResponse The avatar image content
	 * @throws \Exception
	 */
	public function getAvatar(string $githubUserName): DataDisplayResponse {
		$avatar = $this->githubAPIService->getAvatar($this->userId, $githubUserName);
		if ($avatar !== null && isset($avatar['body'], $avatar['headers'])) {
			$response = new DataDisplayResponse(
				$avatar['body'],
				Http::STATUS_OK,
				['Content-Type' => $avatar['headers']['Content-Type'][0] ?? 'image/jpeg']
			);
			$response->cacheFor(60 * 60 * 24);
			return $response;
		}
		return new DataDisplayResponse('', 400);
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $githubUserName
	 * @return DataResponse
	 */
	public function getUserInfo(string $githubUserName): DataResponse {
		$result = $this->githubAPIService->getUserInfo($this->userId, $githubUserName);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $owner
	 * @param string $repo
	 * @param int $issueNumber
	 * @return DataResponse
	 */
	public function getIssueInfo(string $owner, string $repo, int $issueNumber): DataResponse {
		$result = $this->githubAPIService->getIssueInfo($this->userId, $owner, $repo, $issueNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $owner
	 * @param string $repo
	 * @param int $commentId
	 * @return DataResponse
	 */
	public function getIssueCommentInfo(string $owner, string $repo, int $commentId): DataResponse {
		$result = $this->githubAPIService->getIssueCommentInfo($this->userId, $owner, $repo, $commentId);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $owner
	 * @param string $repo
	 * @param int $prNumber
	 * @return DataResponse
	 */
	public function getPrInfo(string $owner, string $repo, int $prNumber): DataResponse {
		$result = $this->githubAPIService->getPrInfo($this->userId, $owner, $repo, $prNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}
}
