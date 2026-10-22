<?php

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Github\Settings;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IAppConfig;
use OCP\AppFramework\Services\IInitialState;
use OCP\Settings\ISettings;

class Admin implements ISettings {

	public function __construct(
		private SecretService $secretService,
		private IAppConfig $appConfig,
		private IInitialState $initialStateService,
		private GitHubAPIService $githubAPIService,
	) {
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm(): TemplateResponse {
		$clientID = $this->secretService->getEncryptedAppValue('client_id');
		$clientSecret = $this->secretService->getEncryptedAppValue('client_secret');
		$usePopup = $this->appConfig->getAppValueString('use_popup', '0', lazy: true);
		$adminDashboardEnabled = $this->appConfig->getAppValueString('dashboard_enabled', '1') === '1';
		$adminLinkPreviewEnabled = $this->appConfig->getAppValueString('link_preview_enabled', '1', lazy: true) === '1';
		$defaultLinkToken = $this->secretService->getEncryptedAppValue('default_link_token');
		$userName = $this->appConfig->getAppValueString('user_name', lazy: true);
		$userDisplayName = $this->appConfig->getAppValueString('user_displayname', lazy: true);
		$allowDefaultTokenToAnonymous = $this->appConfig->getAppValueString('allow_default_link_token_to_anonymous', '0', lazy: true) === '1';
		$allowDefaultTokenToGuests = $this->appConfig->getAppValueString('allow_default_link_token_to_guests', '0', lazy: true) === '1';
		$issueNotificationsEnabled = $this->appConfig->getAppValueString('issue_notifications_enabled', '1') === '1';

		if ($defaultLinkToken !== '' && ($userName === '' || $userDisplayName === '')) {
			$userInfo = $this->githubAPIService->updateLinkTokenUserInfo($defaultLinkToken);
			if (isset($userInfo['user_name'], $userInfo['user_displayname'])) {
				$userName = $userInfo['user_name'];
				$userDisplayName = $userInfo['user_displayname'];
			}
		}

		$adminConfig = [
			'client_id' => $clientID,
			'client_secret' => $clientSecret === '' ? '' : 'dummyClientSecret',
			'use_popup' => ($usePopup === '1'),
			'dashboard_enabled' => $adminDashboardEnabled,
			'link_preview_enabled' => $adminLinkPreviewEnabled,
			'default_link_token' => $defaultLinkToken === '' ? '' : 'dummyToken',
			'allow_default_link_token_to_anonymous' => $allowDefaultTokenToAnonymous,
			'allow_default_link_token_to_guests' => $allowDefaultTokenToGuests,
			'user_name' => $userName,
			'user_displayname' => $userDisplayName,
			'issue_notifications_enabled' => $issueNotificationsEnabled,
		];
		$this->initialStateService->provideInitialState('admin-config', $adminConfig);
		return new TemplateResponse(Application::APP_ID, 'adminSettings');
	}

	public function getSection(): string {
		return 'connected-accounts';
	}

	public function getPriority(): int {
		return 10;
	}
}
