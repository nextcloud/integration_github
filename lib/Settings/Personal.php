<?php
namespace OCA\Github\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IConfig;
use OCP\Settings\ISettings;
use OCA\Github\AppInfo\Application;

class Personal implements ISettings {

	/**
	 * @var IConfig
	 */
	private $config;
	/**
	 * @var IInitialState
	 */
	private $initialStateService;
	/**
	 * @var string|null
	 */
	private $userId;

	public function __construct(IConfig $config,
								IInitialState $initialStateService,
								?string $userId) {
		$this->config = $config;
		$this->initialStateService = $initialStateService;
		$this->userId = $userId;
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm(): TemplateResponse {
		$token = $this->config->getUserValue($this->userId, Application::APP_ID, 'token');
		$searchIssuesEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'search_issues_enabled', '0');
		$searchReposEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'search_repos_enabled', '0');
		$navigationEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'navigation_enabled', '0');
		$userName = $this->config->getUserValue($this->userId, Application::APP_ID, 'user_name');

		// for OAuth
		$clientID = $this->config->getAppValue(Application::APP_ID, 'client_id');
		$clientSecret = $this->config->getAppValue(Application::APP_ID, 'client_secret') !== '';

		$userConfig = [
			'token' => $token,
			'client_id' => $clientID,
			'client_secret' => $clientSecret,
			'search_issues_enabled' => ($searchIssuesEnabled === '1'),
			'search_repos_enabled' => ($searchReposEnabled === '1'),
			'navigation_enabled' => ($navigationEnabled === '1'),
			'user_name' => $userName,
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
