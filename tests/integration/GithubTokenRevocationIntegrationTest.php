<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

require_once __DIR__ . '/MockedGithubApiTrait.php';

use OCA\Github\AppInfo\Application;
use OCA\Github\Controller\ConfigController;
use OCA\Github\Service\SecretService;
use OCP\IConfig;
use OCP\Server;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GithubTokenRevocationIntegrationTest extends TestCase {
	use MockedGithubApiTrait;

	private const CLIENT_ID = 'test-client-id';
	private const CLIENT_SECRET = 'test-client-secret';
	private const ACCESS_TOKEN = 'gho_test_access_token';

	private IConfig $config;
	private SecretService $secretService;
	private ConfigController $configController;

	protected function setUp(): void {
		parent::setUp();

		$this->useTestUser();
		$this->useOAuthApp(self::CLIENT_ID, self::CLIENT_SECRET);

		$this->config = Server::get(IConfig::class);
		$this->secretService = Server::get(SecretService::class);
		$this->configController = $this->createConfigController();
	}

	protected function tearDown(): void {
		$this->resetTestUserConfig();
		$this->restoreOAuthApp();
		parent::tearDown();
	}

	public function testDisconnectRevokesTheOAuthToken(): void {
		$this->connect('oauth');

		$this->client->expects($this->once())
			->method('delete')
			->with('https://api.github.com/applications/' . self::CLIENT_ID . '/token', [
				'headers' => [
					'User-Agent' => self::USER_AGENT,
					'Authorization' => 'Basic ' . base64_encode(self::CLIENT_ID . ':' . self::CLIENT_SECRET),
				],
				'body' => json_encode(['access_token' => self::ACCESS_TOKEN]),
			])
			->willReturn($this->mockResponse(204, ''));

		$response = $this->configController->setConfig(['token' => '']);

		$this->assertSame('', $response->getData()['user_name'], 'user_name should be empty after token revocation');
		$this->assertDisconnected();
	}

	public function testDisconnectingAPersonalTokenDoesNotCallGitHub(): void {
		$this->connect('personal');

		$this->client->expects($this->never())->method('delete');

		$response = $this->configController->setConfig(['token' => '']);

		$this->assertSame('', $response->getData()['user_name'], 'user_name should be empty after disconnecting');
		$this->assertDisconnected();
	}

	private function connect(string $tokenType): void {
		$this->secretService->setEncryptedUserValue(self::TEST_USER_ID, 'token', self::ACCESS_TOKEN);
		$this->config->setUserValue(self::TEST_USER_ID, Application::APP_ID, 'token_type', $tokenType);
		$this->config->setUserValue(self::TEST_USER_ID, Application::APP_ID, 'user_name', 'octocat');
	}

	private function assertDisconnected(): void {
		$this->assertSame('', $this->secretService->getEncryptedUserValue(self::TEST_USER_ID, 'token'), 'Token should be removed');
		foreach (['token_type', 'user_name'] as $key) {
			$this->assertSame('', $this->config->getUserValue(self::TEST_USER_ID, Application::APP_ID, $key), $key . ' should be removed');
		}
	}
}
