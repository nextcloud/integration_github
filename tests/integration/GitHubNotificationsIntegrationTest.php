<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

require_once __DIR__ . '/MockedGithubApiTrait.php';

use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\Server;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GitHubNotificationsIntegrationTest extends TestCase {
	use MockedGithubApiTrait;

	private const ACCESS_TOKEN = 'gho_test_access_token';

	private GithubAPIService $githubAPIService;

	protected function setUp(): void {
		parent::setUp();

		$this->useTestUser();
		Server::get(SecretService::class)->setEncryptedUserValue(self::TEST_USER_ID, 'token', self::ACCESS_TOKEN);
		$this->githubAPIService = $this->createGithubAPIService();
	}

	protected function tearDown(): void {
		$this->resetTestUserConfig();
		parent::tearDown();
	}

	public function testGetNotificationsStructure(): void {
		$this->client->expects($this->once())
			->method('get')
			->with(
				$this->callback(function (string $url): bool {
					$this->assertStringStartsWith('https://api.github.com/notifications?', $url);
					parse_str((string)parse_url($url, PHP_URL_QUERY), $query);
					$this->assertArrayHasKey('since', $query, 'The request should be limited to recent notifications');
					$this->assertEqualsWithDelta(time() - 14 * 24 * 3600, strtotime((string)$query['since']), 300, 'since should default to two weeks ago');
					return true;
				}),
				[
					'timeout' => 30,
					'headers' => [
						'User-Agent' => self::USER_AGENT,
						'Authorization' => 'token ' . self::ACCESS_TOKEN,
					],
				],
			)
			->willReturn($this->mockResponse(200, json_encode(self::notifications())));

		$notifications = $this->githubAPIService->getNotifications(self::TEST_USER_ID);
		$this->assertArrayNotHasKey('error', $notifications, 'GitHub API returned error: ' . ($notifications['error'] ?? 'unknown'));

		$this->assertNotEmpty($notifications, 'The interesting notifications should be returned');
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

	public function testNotificationFilteringLogic(): void {
		$this->client->method('get')
			->willReturn($this->mockResponse(200, json_encode(self::notifications())));

		$notifications = $this->githubAPIService->getNotifications(self::TEST_USER_ID);
		$this->assertSame(['1', '3', '5'], array_column($notifications, 'id'),
			'Only unread notifications with an interesting reason, or subscribed releases, should be kept');

		$limited = $this->githubAPIService->getNotifications(self::TEST_USER_ID, null, null, 2);
		$this->assertSame(['1', '3'], array_column($limited, 'id'), 'The result should be limited');
	}

	/**
	 * A kept and a dropped case for each branch of the filter in GithubAPIService::getNotifications().
	 */
	private static function notifications(): array {
		return [
			self::notification('1', 'mention', true, 'Issue', 'https://api.github.com/repos/nextcloud/server/issues/1'),
			self::notification('2', 'assign', false, 'Issue', 'https://api.github.com/repos/nextcloud/server/issues/2'),
			self::notification('3', 'subscribed', true, 'Release', 'https://api.github.com/repos/nextcloud/server/releases/3'),
			self::notification('4', 'subscribed', true, 'Issue', 'https://api.github.com/repos/nextcloud/server/issues/4'),
			self::notification('5', 'review_requested', true, 'PullRequest', 'https://api.github.com/repos/nextcloud/server/pulls/5'),
			self::notification('6', 'ci_activity', true, 'CheckSuite', ''),
		];
	}

	private static function notification(string $id, string $reason, bool $unread, string $type, string $subjectUrl): array {
		return [
			'id' => $id,
			'unread' => $unread,
			'reason' => $reason,
			'updated_at' => '2026-09-01T12:00:00Z',
			'subject' => [
				'title' => 'Notification ' . $id,
				'type' => $type,
				'url' => $subjectUrl,
			],
			'repository' => [
				'name' => 'server',
				'full_name' => 'nextcloud/server',
				'html_url' => 'https://github.com/nextcloud/server',
				'owner' => ['login' => 'nextcloud'],
			],
		];
	}
}
