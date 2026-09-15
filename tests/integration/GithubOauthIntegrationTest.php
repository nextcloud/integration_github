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
class GithubOauthIntegrationTest extends TestCase {
	use MockedGithubApiTrait;

	private const CLIENT_ID = 'test-client-id';
	private const CLIENT_SECRET = 'test-client-secret';
	private const ACCESS_TOKEN = 'gho_test_access_token';
	private const CODE = 'test-oauth-code';
	private const STATE = 'test-oauth-state';

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

	public function testOAuthRedirectStoresTheTokenAndUserInfo(): void {
		$this->config->setUserValue(self::TEST_USER_ID, Application::APP_ID, 'oauth_state', self::STATE);

		$this->client->expects($this->once())
			->method('post')
			->with('https://github.com/login/oauth/access_token', [
				'headers' => ['User-Agent' => self::USER_AGENT],
				'body' => [
					'client_id' => self::CLIENT_ID,
					'client_secret' => self::CLIENT_SECRET,
					'code' => self::CODE,
					'state' => self::STATE,
				],
			])
			->willReturn($this->mockResponse(200, 'access_token=' . self::ACCESS_TOKEN . '&scope=repo&token_type=bearer'));
		$this->client->expects($this->once())
			->method('get')
			->with('https://api.github.com/user', [
				'timeout' => 30,
				'headers' => [
					'User-Agent' => self::USER_AGENT,
					'Authorization' => 'token ' . self::ACCESS_TOKEN,
				],
			])
			->willReturn($this->mockResponse(200, json_encode(['login' => 'octocat', 'id' => 583231, 'name' => 'The Octocat'])));

		$response = $this->configController->oauthRedirect(self::CODE, self::STATE);

		$this->assertStringContainsString('githubToken=success', $response->getRedirectURL(), 'OAuth redirect did not return success');
		$this->assertSame(self::ACCESS_TOKEN, $this->secretService->getEncryptedUserValue(self::TEST_USER_ID, 'token'), 'Token was not stored');
		$this->assertSame('oauth', $this->userValue('token_type'), 'Token type should be oauth');
		$this->assertSame('583231', $this->userValue('user_id'), 'User id should be stored');
		$this->assertSame('octocat', $this->userValue('user_name'), 'User name should be stored');
		$this->assertSame('The Octocat', $this->userValue('user_displayname'), 'Display name should be stored');
		$this->assertSame('', $this->userValue('oauth_state'), 'The OAuth state should be consumed');
	}

	public function testOAuthRedirectRejectsAStateMismatch(): void {
		$this->config->setUserValue(self::TEST_USER_ID, Application::APP_ID, 'oauth_state', self::STATE);

		$this->client->expects($this->never())->method('post');
		$this->client->expects($this->never())->method('get');

		$response = $this->configController->oauthRedirect(self::CODE, 'another-state');

		$this->assertStringContainsString('githubToken=error', $response->getRedirectURL(), 'A state mismatch should end in an error');
		$this->assertSame('', $this->secretService->getEncryptedUserValue(self::TEST_USER_ID, 'token'), 'No token should be stored');
		$this->assertSame('', $this->userValue('oauth_state'), 'The OAuth state should be reset');
	}

	private function userValue(string $key): string {
		return $this->config->getUserValue(self::TEST_USER_ID, Application::APP_ID, $key);
	}
}
