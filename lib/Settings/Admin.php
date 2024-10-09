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

class Admin implements ISettings {

	public function __construct(
		private SecretService $secretService,
		private IConfig $config,
		private IInitialState $initialStateService,
	) {
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm(): TemplateResponse {
		$clientID = $this->secretService->getEncryptedAppValue('client_id');
		$clientSecret = $this->secretService->getEncryptedAppValue('client_secret');
		$usePopup = $this->config->getAppValue(Application::APP_ID, 'use_popup', '0');
		$adminDashboardEnabled = $this->config->getAppValue(Application::APP_ID, 'dashboard_enabled', '1') === '1';
		$adminLinkPreviewEnabled = $this->config->getAppValue(Application::APP_ID, 'link_preview_enabled', '1') === '1';
		$defaultLinkToken = $this->secretService->getEncryptedAppValue('default_link_token');
		$allowDefaultTokenToAnonymous = $this->config->getAppValue(Application::APP_ID, 'allow_default_link_token_to_anonymous', '0') === '1';
		$allowDefaultTokenToGuests = $this->config->getAppValue(Application::APP_ID, 'allow_default_link_token_to_guests', '0') === '1';

		$adminConfig = [
			'client_id' => $clientID,
			'client_secret' => $clientSecret === '' ? '' : 'dummyClientSecret',
			'use_popup' => ($usePopup === '1'),
			'dashboard_enabled' => $adminDashboardEnabled,
			'link_preview_enabled' => $adminLinkPreviewEnabled,
			'default_link_token' => $defaultLinkToken === '' ? '' : 'dummyToken',
			'allow_default_link_token_to_anonymous' => $allowDefaultTokenToAnonymous,
			'allow_default_link_token_to_guests' => $allowDefaultTokenToGuests,
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
