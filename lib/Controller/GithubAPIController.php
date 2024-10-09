<?php
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Controller;

use OCA\Github\Service\GithubAPIService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\AppFramework\Http\DataResponse;

use OCP\IRequest;

class GithubAPIController extends Controller {

	public function __construct(
		string $appName,
		IRequest $request,
		private GithubAPIService $githubAPIService,
		private ?string $userId,
	) {
		parent::__construct($appName, $request);
	}

	/**
	 * Get notification list
	 *
	 * @param ?string $since optional date to filter notifications
	 * @return DataResponse the notifications
	 */
	#[NoAdminRequired]
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
	 * Unsubscribe a notification, does the same as in Github notifications page
	 *
	 * @param int $id Notification id
	 * @return DataResponse with request result
	 */
	#[NoAdminRequired]
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
	 * Mark a notification as read
	 *
	 * @param int $id Notification id
	 * @return DataResponse with request result
	 */
	#[NoAdminRequired]
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
	 * TODO remove CSRF and make this endpoint public
	 * but first: understand why it fails for images and not for data requests
	 *
	 * Get repository avatar
	 * @param string $githubLogin
	 * @return DataDisplayResponse The avatar image content
	 * @throws \Exception
	 */
	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function getAvatar(string $githubLogin): DataDisplayResponse {
		$avatar = $this->githubAPIService->getAvatar($this->userId, $githubLogin);
		if ($avatar !== null && isset($avatar['body'], $avatar['headers'])) {
			$response = new DataDisplayResponse(
				$avatar['body'],
				Http::STATUS_OK,
				['Content-Type' => $avatar['headers']['Content-Type'][0] ?? 'image/jpeg']
			);
			$response->cacheFor(60 * 60 * 24, false, true);
			return $response;
		}
		return new DataDisplayResponse('', 400);
	}

	/**
	 * @param string $githubUserLogin
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getUserInfo(string $githubUserLogin): DataResponse {
		$result = $this->githubAPIService->getUserInfo($this->userId, $githubUserLogin);
		if (!isset($result['error'])) {
			$response = new DataResponse($result);
			$response->cacheFor(60 * 60 * 24);
			return $response;
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @param string $githubUserLogin
	 * @param string $subjectType
	 * @param int $subjectId
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getContextualUserInfo(string $githubUserLogin, string $subjectType, int $subjectId): DataResponse {
		$result = $this->githubAPIService->getContextualUserInfo($this->userId, $githubUserLogin, $subjectType, $subjectId);
		if (!isset($result['error'])) {
			$response = new DataResponse($result);
			$response->cacheFor(60 * 60 * 24);
			return $response;
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param int $issueNumber
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getIssueInfo(string $owner, string $repo, int $issueNumber): DataResponse {
		$result = $this->githubAPIService->getIssueInfo($this->userId, $owner, $repo, $issueNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param int $issueNumber
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getIssueReactionsInfo(string $owner, string $repo, int $issueNumber): DataResponse {
		$result = $this->githubAPIService->getIssueReactionsInfo($this->userId, $owner, $repo, $issueNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param int $commentId
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getIssueCommentInfo(string $owner, string $repo, int $commentId): DataResponse {
		$result = $this->githubAPIService->getIssueCommentInfo($this->userId, $owner, $repo, $commentId);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param int $commentId
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getIssueCommentReactionsInfo(string $owner, string $repo, int $commentId): DataResponse {
		$result = $this->githubAPIService->getIssueCommentReactionsInfo($this->userId, $owner, $repo, $commentId);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param int $prNumber
	 * @return DataResponse
	 */
	#[NoAdminRequired]
	public function getPrInfo(string $owner, string $repo, int $prNumber): DataResponse {
		$result = $this->githubAPIService->getPrInfo($this->userId, $owner, $repo, $prNumber);
		if (!isset($result['error'])) {
			return new DataResponse($result);
		} else {
			return new DataResponse($result, 401);
		}
	}
}
