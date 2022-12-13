<?php
namespace OCA\Github\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IConfig;
use OCP\Settings\ISettings;
use OCA\Github\AppInfo\Application;

class Admin implements ISettings {

	/**
	 * @var IConfig
	 */
	private $config;
	/**
	 * @var IInitialState
	 */
	private $initialStateService;

	public function __construct(IConfig $config,
								IInitialState $initialStateService) {
		$this->config = $config;
		$this->initialStateService = $initialStateService;
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm(): TemplateResponse {
		$clientID = $this->config->getAppValue(Application::APP_ID, 'client_id');
		$clientSecret = $this->config->getAppValue(Application::APP_ID, 'client_secret');
		$usePopup = $this->config->getAppValue(Application::APP_ID, 'use_popup', '0');
		$adminLinkPreviewEnabled = $this->config->getAppValue(Application::APP_ID, 'link_preview_enabled', '1') === '1';
		$defaultLinkToken = $this->config->getAppValue(Application::APP_ID, 'default_link_token');
		$allowDefaultTokenToAnonymous = $this->config->getAppValue(Application::APP_ID, 'allow_default_link_token_to_anonymous', '0') === '1';
		$allowDefaultTokenToGuests = $this->config->getAppValue(Application::APP_ID, 'allow_default_link_token_to_guests', '0') === '1';

		$adminConfig = [
			'client_id' => $clientID,
			'client_secret' => $clientSecret,
			'use_popup' => ($usePopup === '1'),
			'link_preview_enabled' => $adminLinkPreviewEnabled,
			'default_link_token' => $defaultLinkToken,
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
