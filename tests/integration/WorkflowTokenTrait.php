<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\SecretService;
use OCP\IConfig;
use OCP\IUserManager;
use OCP\Server;

/**
 * Runs a test against the public GitHub API with the token GitHub Actions issues to
 * every workflow run, stored as the test user's personal token, instead of a token
 * obtained by logging in to a GitHub account.
 *
 * It is the same Nextcloud user as in GithubOauthIntegrationTest, because the reference
 * providers get their user injected when they are constructed. The user's previous token
 * is restored afterwards, so the tests that depend on the OAuth flow keep the token that
 * flow stored, whatever order the tests run in.
 */
trait WorkflowTokenTrait {
	private const WORKFLOW_TOKEN_USER_ID = 'github_test_user';

	private string $userId;
	private string $previousToken = '';
	private string $previousTokenType = '';

	private function useWorkflowToken(): void {
		$token = getenv('GITHUB_TOKEN') ?: '';
		if ($token === '') {
			$this->markTestSkipped('GITHUB_TOKEN not set');
		}

		$userManager = Server::get(IUserManager::class);
		$user = $userManager->get(self::WORKFLOW_TOKEN_USER_ID)
			?? $userManager->createUser(self::WORKFLOW_TOKEN_USER_ID, 'test-password');
		self::loginAsUser($user->getUID());
		$this->userId = $user->getUID();

		$config = Server::get(IConfig::class);
		$secretService = Server::get(SecretService::class);
		$this->previousToken = $secretService->getEncryptedUserValue($this->userId, 'token');
		$this->previousTokenType = $config->getUserValue($this->userId, Application::APP_ID, 'token_type');

		$secretService->setEncryptedUserValue($this->userId, 'token', $token);
		$config->setUserValue($this->userId, Application::APP_ID, 'token_type', 'personal');
	}

	private function restorePreviousToken(): void {
		if (!isset($this->userId)) {
			return;
		}

		$config = Server::get(IConfig::class);
		if ($this->previousToken === '') {
			$config->deleteUserValue($this->userId, Application::APP_ID, 'token');
		} else {
			Server::get(SecretService::class)->setEncryptedUserValue($this->userId, 'token', $this->previousToken);
		}
		if ($this->previousTokenType === '') {
			$config->deleteUserValue($this->userId, Application::APP_ID, 'token_type');
		} else {
			$config->setUserValue($this->userId, Application::APP_ID, 'token_type', $this->previousTokenType);
		}
	}
}
