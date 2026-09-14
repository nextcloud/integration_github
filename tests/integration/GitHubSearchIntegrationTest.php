<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

require_once __DIR__ . '/WorkflowTokenTrait.php';

use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\Server;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GitHubSearchIntegrationTest extends TestCase {
	use WorkflowTokenTrait;

	private GithubAPIService $githubAPIService;
	private SecretService $secretService;

	protected function setUp(): void {
		parent::setUp();

		$this->useWorkflowToken();
		$this->githubAPIService = Server::get(GithubAPIService::class);
		$this->secretService = Server::get(SecretService::class);
	}

	protected function tearDown(): void {
		$this->restorePreviousToken();
		parent::tearDown();
	}

	public function testSearchRepositoriesStructure(): void {
		$userId = $this->userId;

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'The workflow token should be stored for the test user');

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

	public function testSearchRepositoriesPagination(): void {
		$userId = $this->userId;

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

	public function testSearchIssuesStructure(): void {
		$userId = $this->userId;

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'The workflow token should be stored for the test user');

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

	public function testSearchIssuesPullRequestDetection(): void {
		$userId = $this->userId;

		$result = $this->githubAPIService->searchIssues($userId, 'nextcloud is:pr is:open', 0, 10);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error');

		$pullRequests = array_filter($result['items'], fn ($item) => isset($item['pull_request']));
		$this->assertNotEmpty($pullRequests, 'Should find at least one pull request');

		foreach ($pullRequests as $pr) {
			$this->assertArrayHasKey('pull_request', $pr, 'Pull request should have pull_request field');
			$this->assertArrayHasKey('merged', $pr, 'Pull request should have merged field added by service');
		}
	}

	public function testSearchIssuesIssuesOnly(): void {
		$userId = $this->userId;

		$result = $this->githubAPIService->searchIssues($userId, 'nextcloud is:issue is:open', 0, 10);
		$this->assertArrayNotHasKey('error', $result, 'GitHub API returned error');

		$issues = array_filter($result['items'], fn ($item) => !isset($item['pull_request']));
		$this->assertNotEmpty($issues, 'Should find at least one issue (not PR)');

		foreach ($issues as $issue) {
			$this->assertArrayNotHasKey('pull_request', $issue, 'Issue should not have pull_request field');
		}
	}

}
