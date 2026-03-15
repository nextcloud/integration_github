<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\Server;
use PHPUnit\Framework\Attributes\DependsExternal;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GitHubSearchIntegrationTest extends TestCase {
	private GithubAPIService $githubAPIService;
	private SecretService $secretService;

	protected function setUp(): void {
		parent::setUp();

		$this->githubAPIService = Server::get(GithubAPIService::class);
		$this->secretService = Server::get(SecretService::class);
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testSearchRepositoriesStructure(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test, got: ' . gettype($oauthData));
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$result = $this->githubAPIService->searchRepositories($userId, 'nextcloud', 0, 5);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error: ' . ($result['error'] ?? 'unknown'));

		$this->assertArrayHasKey('items', $result, 'Search result must have items');
		$this->assertIsArray($result['items'], 'Items should be an array');

		foreach ($result['items'] as $repo) {
			$this->assertRepositoryStructure($repo);
		}
	}

	private function assertRepositoryStructure(array $repo): void {
		$this->assertArrayHasKey('full_name', $repo, 'Repository must have full_name');
		$this->assertArrayHasKey('stargazers_count', $repo, 'Repository must have stargazers_count');
		$this->assertArrayHasKey('description', $repo, 'Repository must have description');
		$this->assertArrayHasKey('html_url', $repo, 'Repository must have html_url');

		$this->assertArrayHasKey('owner', $repo, 'Repository must have owner');
		$this->assertIsArray($repo['owner'], 'Owner should be an array');
		$this->assertArrayHasKey('login', $repo['owner'], 'Repository owner must have login');

		$this->assertMatchesRegularExpression('/^[^\/]+\/[^\/]+$/', $repo['full_name'], 'full_name should be in format owner/repo');
		$this->assertStringContainsString('github.com', $repo['html_url'], 'html_url should point to github.com');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testSearchRepositoriesPagination(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$result1 = $this->githubAPIService->searchRepositories($userId, 'nextcloud', 0, 3);
		$this->assertArrayNotHasKey('error', $result1, 'GitHub API returned error');
		$this->assertCount(3, $result1['items'], 'First page should have 3 items');

		$result2 = $this->githubAPIService->searchRepositories($userId, 'nextcloud', 3, 2);
		$this->assertArrayNotHasKey('error', $result2, 'GitHub API returned error');
		$this->assertCount(2, $result2['items'], 'Second page should have 2 items');

		$firstPageIds = array_map(fn ($r) => $r['id'], $result1['items']);
		$secondPageIds = array_map(fn ($r) => $r['id'], $result2['items']);
		foreach ($secondPageIds as $id) {
			$this->assertNotContains($id, $firstPageIds, 'Second page should not contain items from first page');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testSearchIssuesStructure(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test, got: ' . gettype($oauthData));
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$result = $this->githubAPIService->searchIssues($userId, 'nextcloud is:open', 0, 5);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error: ' . ($result['error'] ?? 'unknown'));

		$this->assertArrayHasKey('items', $result, 'Search result must have items');
		$this->assertIsArray($result['items'], 'Items should be an array');

		foreach ($result['items'] as $issue) {
			$this->assertIssueStructure($issue);
		}
	}

	private function assertIssueStructure(array $issue): void {
		$this->assertArrayHasKey('title', $issue, 'Issue must have title');
		$this->assertArrayHasKey('state', $issue, 'Issue must have state');
		$this->assertArrayHasKey('number', $issue, 'Issue must have number');
		$this->assertArrayHasKey('html_url', $issue, 'Issue must have html_url');
		$this->assertArrayHasKey('repository_url', $issue, 'Issue must have repository_url');

		$this->assertContains($issue['state'], ['open', 'closed'], 'State should be open or closed');

		$this->assertValidRepositoryUrl($issue['repository_url']);
		$this->assertStringContainsString('github.com', $issue['html_url'], 'html_url should point to github.com');

		if (isset($issue['pull_request'])) {
			$this->assertArrayHasKey('merged', $issue, 'Pull request must have merged field');
		}

		$this->assertArrayHasKey('project_owner_login', $issue, 'Issue must have project_owner_login (added by service)');
	}

	private function assertValidRepositoryUrl(string $url): void {
		$this->assertStringContainsString('api.github.com/repos/', $url, 'repository_url should be an API repos URL');

		$repoFullName = str_replace('https://api.github.com/repos/', '', $url);
		$parts = explode('/', $repoFullName);
		$this->assertCount(2, $parts, 'Repository path should have owner/repo format');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testSearchIssuesPullRequestDetection(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$result = $this->githubAPIService->searchIssues($userId, 'nextcloud is:pr is:open', 0, 10);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error');

		$pullRequests = array_filter($result['items'], fn ($item) => isset($item['pull_request']));
		$this->assertNotEmpty($pullRequests, 'Should find at least one pull request');

		foreach ($pullRequests as $pr) {
			$this->assertArrayHasKey('pull_request', $pr, 'Pull request should have pull_request field');
			$this->assertArrayHasKey('merged', $pr, 'Pull request should have merged field added by service');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testSearchIssuesIssuesOnly(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$result = $this->githubAPIService->searchIssues($userId, 'nextcloud is:issue is:open', 0, 10);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error');

		$issues = array_filter($result['items'], fn ($item) => !isset($item['pull_request']));
		$this->assertNotEmpty($issues, 'Should find at least one issue (not PR)');

		foreach ($issues as $issue) {
			$this->assertArrayNotHasKey('pull_request', $issue, 'Issue should not have pull_request field');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testSearchIssuesSublineFormat(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$result = $this->githubAPIService->searchIssues($userId, 'nextcloud is:open', 0, 5);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error');

		foreach ($result['items'] as $item) {
			$repoFullName = str_replace('https://api.github.com/repos/', '', $item['repository_url']);
			$parts = explode('/', $repoFullName);
			$repo = $parts[1] ?? '';
			$number = $item['number'];

			$this->assertNotSame('', $repo, 'Repository name should be extracted');
			$this->assertGreaterThan(0, $number, 'Issue/PR number should be positive');

			$typeChar = isset($item['pull_request']) ? '⑁' : '⦿';
			$expectedSubline = $typeChar . ' ' . $repo . '#' . $number;

			$this->assertMatchesRegularExpression('/^[⑁⦿] .+#\d+$/u', $expectedSubline, 'Subline should match expected format');
		}
	}
}
