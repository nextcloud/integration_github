<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Controller;

use OCA\Github\AppInfo\Application;
use OCA\Github\Reference\GithubIssuePrReferenceProvider;
use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PasswordConfirmationRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\RedirectResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IAppConfig;
use OCP\AppFramework\Services\IInitialState;
use OCP\IConfig;
use OCP\IL10N;

use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\PreConditionNotMetException;
use Psr\Log\LoggerInterface;

class ConfigController extends Controller {

	/**
	 * The switches of the admin settings, and whether each one is stored lazily.
	 * dashboard_enabled and issue_notifications_enabled are read in Application::register(),
	 * which runs on every request, so they stay non-lazy.
	 */
	private const ADMIN_SWITCHES = [
		'use_popup' => true,
		'link_preview_enabled' => true,
		'allow_default_link_token_to_anonymous' => true,
		'allow_default_link_token_to_guests' => true,
		'dashboard_enabled' => false,
		'issue_notifications_enabled' => false,
	];

	private const SECRET_KEYS = ['client_id', 'client_secret', 'default_link_token'];

	public function __construct(
		string $appName,
		IRequest $request,
		private IConfig $config,
		private IAppConfig $appConfig,
		private IURLGenerator $urlGenerator,
		private IL10N $l,
		private IInitialState $initialStateService,
		private LoggerInterface $logger,
		private GithubAPIService $githubAPIService,
		private SecretService $secretService,
		private GithubIssuePrReferenceProvider $githubIssuePrReferenceProvider,
		private ?string $userId,
	) {
		parent::__construct($appName, $request);
	}

	/**
	 * Set config values
	 *
	 * @param array $values key/value pairs to store in user preferences
	 * @return DataResponse
	 * @throws PreConditionNotMetException
	 */
	#[NoAdminRequired]
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
			if ($key === 'token') {
				$this->secretService->setEncryptedUserValue($this->userId, $key, $value);
			} else {
				$this->config->setUserValue($this->userId, Application::APP_ID, $key, $value);
			}
		}
		$result = [];

		if (isset($values['token'])) {
			if ($values['token'] && $values['token'] !== '') {
				// connect with personal token
				$userInfo = $this->storeUserInfo();
				$result['user_name'] = $userInfo['user_name'];
				$result['user_displayname'] = $userInfo['user_displayname'];
				// store token type if it's valid (so we have a user name)
				if ($result['user_name'] !== '') {
					$this->config->setUserValue($this->userId, Application::APP_ID, 'token_type', 'personal');
				}
			} else {
				// disconnect
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_id');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_name');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'user_displayname');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'token_type');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'token');
				$this->config->deleteUserValue($this->userId, Application::APP_ID, 'redirect_uri');
				$result['user_name'] = '';
			}
			// connect or disconnect: invalidate the user-related cache
			$this->githubIssuePrReferenceProvider->invalidateUserCache($this->userId);
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
		// only the switches, so that a request cannot write a key the server owns, such as "enabled"
		foreach ($values as $key => $value) {
			if (!array_key_exists($key, self::ADMIN_SWITCHES) || !is_string($value)) {
				return new DataResponse([], Http::STATUS_BAD_REQUEST);
			}
		}
		foreach ($values as $key => $value) {
			$this->appConfig->setAppValueString($key, $value, lazy: self::ADMIN_SWITCHES[$key]);
		}
		return new DataResponse([]);
	}

	/**
	 * Set admin config values
	 *
	 * @param array $values key/value pairs to store in app config
	 * @return DataResponse
	 */
	#[PasswordConfirmationRequired]
	public function setSensitiveAdminConfig(array $values): DataResponse {
		foreach ($values as $key => $value) {
			if (!in_array($key, self::SECRET_KEYS, true) || !is_string($value)) {
				return new DataResponse([], Http::STATUS_BAD_REQUEST);
			}
		}
		foreach ($values as $key => $value) {
			$this->secretService->setEncryptedAppValue($key, $value);
			if ($key === 'default_link_token') {
				$info = $this->githubAPIService->updateLinkTokenUserInfo($value);
				return new DataResponse($info);
			}
		}
		return new DataResponse([]);
	}

	/**
	 * @param string $user_name
	 * @param string $user_displayname
	 * @return TemplateResponse
	 */
	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function popupSuccessPage(string $user_name, string $user_displayname): TemplateResponse {
		$this->initialStateService->provideInitialState('popup-data', ['user_name' => $user_name, 'user_displayname' => $user_displayname]);
		return new TemplateResponse(Application::APP_ID, 'popupSuccess', [], TemplateResponse::RENDER_AS_GUEST);
	}

	/**
	 * Receive oauth code and get oauth access token
	 *
	 * @param string $code request code to use when requesting oauth token
	 * @param string $state value that was sent with original GET request. Used to check auth redirection is valid
	 * @return RedirectResponse to user settings
	 * @throws PreConditionNotMetException
	 */
	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function oauthRedirect(string $code, string $state): RedirectResponse {
		$configState = $this->config->getUserValue($this->userId, Application::APP_ID, 'oauth_state');
		$clientID = $this->secretService->getEncryptedAppValue('client_id');
		$clientSecret = $this->secretService->getEncryptedAppValue('client_secret');

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
				$this->githubIssuePrReferenceProvider->invalidateUserCache($this->userId);
				$accessToken = $result['access_token'];
				$this->secretService->setEncryptedUserValue($this->userId, 'token', $accessToken);
				$this->config->setUserValue($this->userId, Application::APP_ID, 'token_type', 'oauth');
				$userInfo = $this->storeUserInfo();

				$usePopup = $this->appConfig->getAppValueString('use_popup', '0', lazy: true) === '1';
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
							$this->urlGenerator->linkToRoute('settings.PersonalSettings.index', ['section' => 'connected-accounts'])
							. '?githubToken=success'
						);
					} elseif ($oauthOrigin === 'dashboard') {
						return new RedirectResponse(
							$this->urlGenerator->linkToRoute('dashboard.dashboard.index')
						);
					}
					return new RedirectResponse(
						$this->urlGenerator->linkToRoute('settings.PersonalSettings.index', ['section' => 'connected-accounts'])
						. '?githubToken=success'
					);
				}
			}
			$this->logger->warning('No access token in the token request response', ['response' => $result]);
			$result = $this->l->t('Error getting OAuth access token');
		} else {
			$result = $this->l->t('Error during OAuth exchanges');
		}
		return new RedirectResponse(
			$this->urlGenerator->linkToRoute('settings.PersonalSettings.index', ['section' => 'connected-accounts'])
			. '?githubToken=error&message=' . urlencode($result)
		);
	}

	/**
	 * get and store connected user info
	 *
	 * @return array
	 * @throws PreConditionNotMetException
	 */
	private function storeUserInfo(): array {
		$info = $this->githubAPIService->request($this->userId, 'user');
		if (isset($info['login'], $info['id'])) {
			$this->config->setUserValue($this->userId, Application::APP_ID, 'user_id', $info['id']);
			$this->config->setUserValue($this->userId, Application::APP_ID, 'user_name', $info['login']);
			$this->config->setUserValue($this->userId, Application::APP_ID, 'user_displayname', $info['name'] ?? '');
			return [
				'user_id' => $info['id'],
				'user_name' => $info['login'],
				'user_displayname' => $info['name'] ?? '',
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
