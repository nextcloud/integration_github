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

use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IURLGenerator;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;
use OCP\AppFramework\Http\RedirectResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Github\Service\GithubAPIService;
use OCA\Github\AppInfo\Application;
use OCP\PreConditionNotMetException;

class ConfigController extends Controller {

	/**
	 * @var IConfig
	 */
	private $config;
	/**
	 * @var IURLGenerator
	 */
	private $urlGenerator;
	/**
	 * @var IL10N
	 */
	private $l;
	/**
	 * @var GithubAPIService
	 */
	private $githubAPIService;
	/**
	 * @var string|null
	 */
	private $userId;
	/**
	 * @var IInitialState
	 */
	private $initialStateService;

	public function __construct(string $appName,
								IRequest $request,
								IConfig $config,
								IURLGenerator $urlGenerator,
								IL10N $l,
								IInitialState $initialStateService,
								GithubAPIService $githubAPIService,
								?string $userId) {
		parent::__construct($appName, $request);
		$this->config = $config;
		$this->urlGenerator = $urlGenerator;
		$this->l = $l;
		$this->githubAPIService = $githubAPIService;
		$this->userId = $userId;
		$this->initialStateService = $initialStateService;
	}

	/**
	 * @NoAdminRequired
	 * Set config values
	 *
	 * @param array $values key/value pairs to store in user preferences
	 * @return DataResponse
	 */
	public function setConfig(array $values): DataResponse {
		// revoke the oauth token if needed
		if (isset($values['token']) && $values['token'] === '') {
			$tokenType = $this->config->getUserValue($this->userId, Application::APP_ID, 'token_type');
			if ($tokenType === 'oauth') {
				$this->githubAPIService->revokeOauthToken($this->userId);
			}
		}

		// save values
		foreach ($values as $key => $value) {
			$this->config->setUserValue($this->userId, Application::APP_ID, $key, $value);
		}
		$result = [];

		if (isset($values['token'])) {
			if ($values['token'] && $values['token'] !== '') {
				$userInfo = $this->storeUserInfo($values['token']);
				$result['user_name'] = $userInfo['user_name'];
				$result['user_displayname'] = $userInfo['user_displayname'];
				// store token type if it's valid (so we have a user name)
				if ($result['user_name'] !== '') {
					$this->config->setUserValue($this->userId, Application::APP_ID, 'token_type', 'personal');
				}
			} else {
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_id');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_name');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_displayname');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'token_type');
				$result['user_name'] = '';
			}
		}
		return new DataResponse($result);
	}

	/**
	 * Set admin config values
	 *
	 * @param array $values key/value pairs to store in app config
	 * @return DataResponse
	 */
	public function setAdminConfig(array $values): DataResponse {
		foreach ($values as $key => $value) {
			$this->config->setAppValue(Application::APP_ID, $key, $value);
		}
		return new DataResponse(1);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $user_name
	 * @param string $user_displayname
	 * @return TemplateResponse
	 */
	public function popupSuccessPage(string $user_name, string $user_displayname): TemplateResponse {
		$this->initialStateService->provideInitialState('popup-data', ['user_name' => $user_name, 'user_displayname' => $user_displayname]);
		return new TemplateResponse(Application::APP_ID, 'popupSuccess', [], TemplateResponse::RENDER_AS_GUEST);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * Receive oauth code and get oauth access token
	 *
	 * @param string $code request code to use when requesting oauth token
	 * @param string $state value that was sent with original GET request. Used to check auth redirection is valid
	 * @return RedirectResponse to user settings
	 * @throws PreConditionNotMetException
	 */
	public function oauthRedirect(string $code, string $state): RedirectResponse {
		$configState = $this->config->getUserValue($this->userId, Application::APP_ID, 'oauth_state');
		$clientID = $this->config->getAppValue(Application::APP_ID, 'client_id');
		$clientSecret = $this->config->getAppValue(Application::APP_ID, 'client_secret');

		// anyway, reset state
		$this->config->deleteUserValue($this->userId, Application::APP_ID, 'oauth_state');

		if ($clientID && $clientSecret && $configState !== '' && $configState === $state) {
			$result = $this->githubAPIService->requestOAuthAccessToken([
				'client_id' => $clientID,
				'client_secret' => $clientSecret,
				'code' => $code,
				'state' => $state
			], 'POST');
			if (isset($result['access_token'])) {
				$accessToken = $result['access_token'];
				$this->config->setUserValue($this->userId, Application::APP_ID, 'token', $accessToken);
				$this->config->setUserValue($this->userId, Application::APP_ID, 'token_type', 'oauth');
				$userInfo = $this->storeUserInfo($accessToken);

				$usePopup = $this->config->getAppValue(Application::APP_ID, 'use_popup', '0') === '1';
				if ($usePopup) {
					return new RedirectResponse(
						$this->urlGenerator->linkToRoute('integration_github.config.popupSuccessPage', [
							'user_name' => $userInfo['user_name'],
							'user_displayname' => $userInfo['user_displayname'],
						])
					);
				} else {
					$oauthOrigin = $this->config->getUserValue($this->userId, Application::APP_ID, 'oauth_origin');
					$this->config->deleteUserValue($this->userId, Application::APP_ID, 'oauth_origin');
					if ($oauthOrigin === 'settings') {
						return new RedirectResponse(
							$this->urlGenerator->linkToRoute('settings.PersonalSettings.index', ['section' => 'connected-accounts']) .
							'?githubToken=success'
						);
					} elseif ($oauthOrigin === 'dashboard') {
						return new RedirectResponse(
							$this->urlGenerator->linkToRoute('dashboard.dashboard.index')
						);
					}
					return new RedirectResponse(
						$this->urlGenerator->linkToRoute('settings.PersonalSettings.index', ['section' => 'connected-accounts']) .
						'?githubToken=success'
					);
				}
			}
			$result = $this->l->t('Error getting OAuth access token');
		} else {
			$result = $this->l->t('Error during OAuth exchanges');
		}
		return new RedirectResponse(
			$this->urlGenerator->linkToRoute('settings.PersonalSettings.index', ['section' => 'connected-accounts']) .
			'?githubToken=error&message=' . urlencode($result)
		);
	}

	/**
	 * get and store connected user info
	 *
	 * @param string $accessToken
	 * @return array
	 * @throws PreConditionNotMetException
	 */
	private function storeUserInfo(string $accessToken): array {
		$info = $this->githubAPIService->request($accessToken, 'user');
		if (isset($info['login'], $info['id'])) {
			$this->config->setUserValue($this->userId, Application::APP_ID, 'user_id', $info['id']);
			$this->config->setUserValue($this->userId, Application::APP_ID, 'user_name', $info['login']);
			$this->config->setUserValue($this->userId, Application::APP_ID, 'user_displayname', $info['name']);
			return [
				'user_id' => $info['id'],
				'user_name' => $info['login'],
				'user_displayname' => $info['name'],
			];
		} else {
			$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_id');
			$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_name');
			$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_displayname');
			return [
				'user_id' => '',
				'user_name' => '',
				'user_displayname' => '',
			];
		}
	}
}
