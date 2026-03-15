<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\Controller\ConfigController;
use OCA\Github\Service\SecretService;
use OCP\Server;
use PHPUnit\Framework\Attributes\DependsExternal;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GithubZTokenRevocationIntegrationTest extends TestCase {
	private SecretService $secretService;
	private ConfigController $configController;

	protected function setUp(): void {
		parent::setUp();

		$this->secretService = Server::get(SecretService::class);
		$this->configController = Server::get(ConfigController::class);
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testRevokeToken(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		self::loginAsUser($userId);

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should exist before revocation');

		$response = $this->configController->setConfig(['token' => '']);

		$this->assertArrayHasKey('user_name', $response->getData(), 'Response should contain user_name');
		$this->assertSame('', $response->getData()['user_name'], 'user_name should be empty after token revocation');

		$tokenAfter = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertSame('', $tokenAfter, 'Token should be empty after revocation');
	}
}
