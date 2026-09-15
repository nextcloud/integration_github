<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\AppInfo\Application;
use OCA\Github\Controller\ConfigController;
use OCA\Github\Reference\GithubIssuePrReferenceProvider;
use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\AppFramework\Services\IInitialState;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUserManager;
use OCP\Notification\IManager as INotificationManager;
use OCP\Server;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;

/**
 * Runs the app's requests to GitHub against a mocked HTTP client, so the OAuth, notification
 * and token revocation flows are tested without a GitHub account.
 */
trait MockedGithubApiTrait {
	private const TEST_USER_ID = 'github_test_user';
	private const USER_AGENT = 'Nextcloud GitHub integration';
	private const USER_CONFIG_KEYS = [
		'token',
		'token_type',
		'user_id',
		'user_name',
		'user_displayname',
		'oauth_state',
		'redirect_uri',
		'oauth_origin',
	];

	private IClient&MockObject $client;
	private IL10N&MockObject $l10n;
	/** @var array<string, string> */
	private array $previousAppValues = [];

	private function useTestUser(): void {
		$userManager = Server::get(IUserManager::class);
		$user = $userManager->get(self::TEST_USER_ID)
			?? $userManager->createUser(self::TEST_USER_ID, 'test-password');
		self::loginAsUser($user->getUID());
		$this->resetTestUserConfig();
	}

	private function resetTestUserConfig(): void {
		$config = Server::get(IConfig::class);
		foreach (self::USER_CONFIG_KEYS as $key) {
			$config->deleteUserValue(self::TEST_USER_ID, Application::APP_ID, $key);
		}
	}

	private function createGithubAPIService(): GithubAPIService {
		$this->client = $this->createMock(IClient::class);
		$clientService = $this->createMock(IClientService::class);
		$clientService->method('newClient')->willReturn($this->client);

		$this->l10n = $this->createMock(IL10N::class);
		$this->l10n->method('t')->willReturnArgument(0);

		return new GithubAPIService(
			Server::get(SecretService::class),
			Server::get(LoggerInterface::class),
			$this->l10n,
			Server::get(IConfig::class),
			Server::get(IURLGenerator::class),
			Server::get(IUserManager::class),
			Server::get(INotificationManager::class),
			$clientService,
		);
	}

	private function createConfigController(): ConfigController {
		$githubAPIService = $this->createGithubAPIService();

		return new ConfigController(
			Application::APP_ID,
			$this->createMock(IRequest::class),
			Server::get(IConfig::class),
			Server::get(IURLGenerator::class),
			$this->l10n,
			$this->createMock(IInitialState::class),
			Server::get(LoggerInterface::class),
			$githubAPIService,
			Server::get(SecretService::class),
			Server::get(GithubIssuePrReferenceProvider::class),
			self::TEST_USER_ID,
		);
	}

	private function mockResponse(int $statusCode, string $body): IResponse&MockObject {
		$response = $this->createMock(IResponse::class);
		$response->method('getStatusCode')->willReturn($statusCode);
		$response->method('getBody')->willReturn($body);
		return $response;
	}

	/**
	 * Stores OAuth app credentials for the test and keeps the previous values,
	 * which restoreOAuthApp() puts back.
	 */
	private function useOAuthApp(string $clientId, string $clientSecret): void {
		$secretService = Server::get(SecretService::class);
		$config = Server::get(IConfig::class);
		$this->previousAppValues = [
			'client_id' => $secretService->getEncryptedAppValue('client_id'),
			'client_secret' => $secretService->getEncryptedAppValue('client_secret'),
			'use_popup' => $config->getAppValue(Application::APP_ID, 'use_popup'),
		];

		$secretService->setEncryptedAppValue('client_id', $clientId);
		$secretService->setEncryptedAppValue('client_secret', $clientSecret);
		$config->setAppValue(Application::APP_ID, 'use_popup', '0');
	}

	private function restoreOAuthApp(): void {
		$secretService = Server::get(SecretService::class);
		$config = Server::get(IConfig::class);
		foreach ($this->previousAppValues as $key => $value) {
			if ($value === '') {
				$config->deleteAppValue(Application::APP_ID, $key);
			} elseif ($key === 'use_popup') {
				$config->setAppValue(Application::APP_ID, $key, $value);
			} else {
				$secretService->setEncryptedAppValue($key, $value);
			}
		}
		$this->previousAppValues = [];
	}
}
