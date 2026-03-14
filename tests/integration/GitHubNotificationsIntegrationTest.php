<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\IConfig;
use OCP\Server;
use PHPUnit\Framework\Attributes\DependsExternal;
use Test\TestCase;

/**
 * @group DB
 */
class GitHubNotificationsIntegrationTest extends TestCase {
	private GithubAPIService $githubAPIService;
	private SecretService $secretService;
	private IConfig $config;

	protected function setUp(): void {
		parent::setUp();

		$this->githubAPIService = Server::get(GithubAPIService::class);
		$this->secretService = Server::get(SecretService::class);
		$this->config = Server::get(IConfig::class);
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testGetNotificationsStructure(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test, got: ' . gettype($oauthData));
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$notifications = $this->githubAPIService->getNotifications($userId);
		$this->assertArrayNotHasKey('error', $notifications, 'GitHub API returned error: ' . ($notifications['error'] ?? 'unknown'));

		$this->assertIsArray($notifications, 'Notifications should be an array');

		foreach ($notifications as $notification) {
			$this->assertNotificationStructure($notification);
		}
	}

	private function assertNotificationStructure(array $notification): void {
		$this->assertArrayHasKey('id', $notification, 'Notification must have id');
		$this->assertArrayHasKey('subject', $notification, 'Notification must have subject');
		$this->assertArrayHasKey('repository', $notification, 'Notification must have repository');
		$this->assertArrayHasKey('reason', $notification, 'Notification must have reason');
		$this->assertArrayHasKey('unread', $notification, 'Notification must have unread flag');
		$this->assertArrayHasKey('updated_at', $notification, 'Notification must have updated_at');

		$subject = $notification['subject'];
		$this->assertArrayHasKey('title', $subject, 'Subject must have title');
		$this->assertArrayHasKey('type', $subject, 'Subject must have type');
		$this->assertArrayHasKey('url', $subject, 'Subject must have url');

		$repository = $notification['repository'];
		$this->assertArrayHasKey('name', $repository, 'Repository must have name');
		$this->assertArrayHasKey('full_name', $repository, 'Repository must have full_name');

		$this->assertArrayHasKey('owner', $repository, 'Repository must have owner');
		$this->assertArrayHasKey('login', $repository['owner'], 'Repository owner must have login');

		$this->assertValidNotificationTarget($notification);
		$this->assertValidTargetIdentifier($notification);
	}

	private function assertValidNotificationTarget(array $notification): void {
		$subjectType = $notification['subject']['type'] ?? '';
		$subjectUrl = $notification['subject']['url'] ?? '';
		$repoFullName = $notification['repository']['full_name'] ?? '';
		$repoHtmlUrl = $notification['repository']['html_url'] ?? '';

		$targetUrl = $this->computeExpectedTargetUrl($subjectType, $subjectUrl, $repoFullName, $repoHtmlUrl);

		$this->assertNotSame('', $targetUrl, 'Target URL should not be empty for notification');
		$this->assertStringContainsString('github.com', $targetUrl, 'Target URL should point to github.com');
	}

	private function assertValidTargetIdentifier(array $notification): void {
		$subjectType = $notification['subject']['type'] ?? '';
		$subjectUrl = $notification['subject']['url'] ?? '';

		if (!in_array($subjectType, ['PullRequest', 'Issue'], true)) {
			return;
		}

		if ($subjectUrl === '') {
			return;
		}

		$parts = explode('/', $subjectUrl);
		$identifier = '#' . end($parts);

		$this->assertMatchesRegularExpression('/^#\d+$/', $identifier, 'Target identifier should be #number for PullRequest/Issue');
	}

	private function computeExpectedTargetUrl(string $subjectType, string $subjectUrl, string $repoFullName, string $repoHtmlUrl): string {
		if ($subjectType === 'Release') {
			$url = str_replace('api.github.com', 'github.com', $subjectUrl);
			$url = str_replace('/repos/', '/', $url);
			return preg_replace('/\/[0-9]+/', '', $url) ?? '';
		}
		if ($subjectType === 'RepositoryAdvisory') {
			return $repoHtmlUrl;
		}
		if ($subjectType !== 'Discussion') {
			$url = str_replace('api.github.com', 'github.com', $subjectUrl);
			$url = str_replace('/repos/', '/', $url);
			return str_replace('/pulls/', '/pull/', $url);
		}
		return 'https://github.com/' . $repoFullName . '/discussions';
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testNotificationFilteringLogic(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test, got: ' . gettype($oauthData));
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$notifications = $this->githubAPIService->getNotifications($userId);
		$this->assertArrayNotHasKey('error', $notifications, 'GitHub API returned error: ' . ($notifications['error'] ?? 'unknown'));

		$validReasons = ['assign', 'mention', 'team_mention', 'review_requested', 'author', 'manual'];

		foreach ($notifications as $notification) {
			$reason = $notification['reason'] ?? '';
			$subjectType = $notification['subject']['type'] ?? '';
			$unread = $notification['unread'] ?? false;

			$isValidReason = in_array($reason, $validReasons, true)
				|| ($reason === 'subscribed' && $subjectType === 'Release');

			$this->assertTrue($isValidReason, "Notification has unexpected reason: $reason");
			$this->assertTrue($unread, 'Notification should be unread');
		}
	}
}
