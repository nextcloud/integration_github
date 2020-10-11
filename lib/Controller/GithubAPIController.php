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

use OCP\App\IAppManager;
use OCP\Files\IAppData;
use OCP\AppFramework\Http\DataDisplayResponse;

use OCP\IURLGenerator;
use OCP\IConfig;
use OCP\IServerContainer;
use OCP\IL10N;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\RedirectResponse;

use OCP\AppFramework\Http\ContentSecurityPolicy;

use Psr\Log\LoggerInterface;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Github\Service\GithubAPIService;
use OCA\Github\AppInfo\Application;

class GithubAPIController extends Controller {


	private $userId;
	private $config;
	private $dbconnection;
	private $dbtype;

	public function __construct($AppName,
								IRequest $request,
								IServerContainer $serverContainer,
								IConfig $config,
								IL10N $l10n,
								IAppManager $appManager,
								IAppData $appData,
								LoggerInterface $logger,
								GithubAPIService $githubAPIService,
								$userId) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->AppName = $AppName;
		$this->l10n = $l10n;
		$this->appData = $appData;
		$this->serverContainer = $serverContainer;
		$this->config = $config;
		$this->logger = $logger;
		$this->githubAPIService = $githubAPIService;
		$this->accessToken = $this->config->getUserValue($this->userId, Application::APP_ID, 'token', '');
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

}
