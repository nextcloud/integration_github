<?php

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Github\Settings;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\SecretService;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IConfig;
use OCP\Settings\ISettings;

class Personal implements ISettings {

	public function __construct(
		private SecretService $secretService,
		private IConfig $config,
		private IInitialState $initialStateService,
		private ?string $userId,
	) {
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm(): TemplateResponse {
		$token = $this->secretService->getEncryptedUserValue($this->userId, 'token');
		$searchIssuesEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'search_issues_enabled', '0');
		$searchReposEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'search_repos_enabled', '0');
		$navigationEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'navigation_enabled', '0');
		$linkPreviewEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'link_preview_enabled', '1');
		$userName = $this->config->getUserValue($this->userId, Application::APP_ID, 'user_name');
		$userDisplayName = $this->config->getUserValue($this->userId, Application::APP_ID, 'user_displayname');
		$notificationsEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'issue_notifications_enabled', '0');
		$adminNotificationsEnabled = $this->config->getAppValue(Application::APP_ID, 'issue_notifications_enabled', '1');

		// for OAuth
		$clientID = $this->secretService->getEncryptedAppValue('client_id');
		$clientSecret = $this->secretService->getEncryptedAppValue('client_secret');
		$usePopup = $this->config->getAppValue(Application::APP_ID, 'use_popup', '0');

		$userConfig = [
			'token' => $token === '' ? '' : 'dummyToken',
			'client_id' => $clientID,
			'client_secret' => $clientSecret !== '',
			'use_popup' => ($usePopup === '1'),
			'search_issues_enabled' => ($searchIssuesEnabled === '1'),
			'search_repos_enabled' => ($searchReposEnabled === '1'),
			'navigation_enabled' => ($navigationEnabled === '1'),
			'link_preview_enabled' => ($linkPreviewEnabled === '1'),
			'user_name' => $userName,
			'user_displayname' => $userDisplayName,
			'issue_notifications_enabled' => ($notificationsEnabled === '1'),
			'admin_issue_notifications_enabled' => ($adminNotificationsEnabled === '1'),
		];
		$this->initialStateService->provideInitialState('user-config', $userConfig);
		return new TemplateResponse(Application::APP_ID, 'personalSettings');
	}

	public function getSection(): string {
		return 'connected-accounts';
	}

	public function getPriority(): int {
		return 10;
	}
}
