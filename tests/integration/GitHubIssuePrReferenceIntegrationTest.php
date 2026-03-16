<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\Reference\GithubIssuePrReferenceProvider;
use OCA\Github\Service\SecretService;
use OCP\Collaboration\Reference\IReference;
use OCP\Server;
use PHPUnit\Framework\Attributes\DependsExternal;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GitHubIssuePrReferenceIntegrationTest extends TestCase {
	private GithubIssuePrReferenceProvider $referenceProvider;
	private SecretService $secretService;

	protected function setUp(): void {
		parent::setUp();

		$this->referenceProvider = Server::get(GithubIssuePrReferenceProvider::class);
		$this->secretService = Server::get(SecretService::class);
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testResolveIssueReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$referenceUrl = 'https://github.com/nextcloud/server/issues/1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve issue reference');

		$richObject = $reference->getRichObject();
		$this->assertIsArray($richObject, 'Rich object should be an array');
		$this->assertIssueRichObjectStructure($richObject);
	}

	private function assertIssueRichObjectStructure(array $richObject): void {
		$this->assertArrayHasKey('github_type', $richObject, 'Must have github_type');
		$this->assertContains($richObject['github_type'], ['issue', 'issue-error'], 'github_type should be issue or issue-error');

		if ($richObject['github_type'] === 'issue-error') {
			$this->assertArrayHasKey('error', $richObject, 'Error type should have error info');
			return;
		}

		$this->assertArrayHasKey('github_issue_id', $richObject, 'Must have github_issue_id');
		$this->assertArrayHasKey('github_repo_owner', $richObject, 'Must have github_repo_owner');
		$this->assertArrayHasKey('github_repo', $richObject, 'Must have github_repo');

		$this->assertArrayHasKey('title', $richObject, 'Must have title');
		$this->assertArrayHasKey('html_url', $richObject, 'Must have html_url');
		$this->assertArrayHasKey('state', $richObject, 'Must have state');
		$this->assertArrayHasKey('user', $richObject, 'Must have user');
		$this->assertIsArray($richObject['user'], 'user should be an array');
		$this->assertArrayHasKey('login', $richObject['user'], 'user must have login');

		$this->assertArrayHasKey('comments', $richObject, 'Must have comments count');

		$this->assertStringContainsString('github.com', $richObject['html_url'], 'html_url should point to github.com');
		$this->assertContains($richObject['state'], ['open', 'closed'], 'state should be open or closed');

		if (isset($richObject['labels'])) {
			$this->assertIsArray($richObject['labels'], 'labels should be an array');
			foreach ($richObject['labels'] as $label) {
				$this->assertArrayHasKey('name', $label, 'Label must have name');
				$this->assertArrayHasKey('color', $label, 'Label must have color');
			}
		}

		if (isset($richObject['assignees'])) {
			$this->assertIsArray($richObject['assignees'], 'assignees should be an array');
			foreach ($richObject['assignees'] as $assignee) {
				$this->assertArrayHasKey('login', $assignee, 'Assignee must have login');
			}
		}

		$this->assertArrayHasKey('created_at', $richObject, 'Must have created_at');
		$this->assertValidDateString($richObject['created_at'], 'created_at should be a valid date string');

		if ($richObject['state'] === 'closed') {
			$this->assertArrayHasKey('closed_at', $richObject, 'Closed issue must have closed_at');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testResolvePullRequestReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$referenceUrl = 'https://github.com/nextcloud/server/pull/1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve PR reference');

		$richObject = $reference->getRichObject();
		$this->assertIsArray($richObject, 'Rich object should be an array');
		$this->assertPullRequestRichObjectStructure($richObject);
	}

	private function assertPullRequestRichObjectStructure(array $richObject): void {
		$this->assertArrayHasKey('github_type', $richObject, 'Must have github_type');
		$this->assertContains($richObject['github_type'], ['pull_request', 'pr-error'], 'github_type should be pull_request or pr-error');

		if ($richObject['github_type'] === 'pr-error') {
			$this->assertArrayHasKey('error', $richObject, 'Error type should have error info');
			return;
		}

		$this->assertArrayHasKey('github_pr_id', $richObject, 'Must have github_pr_id');
		$this->assertArrayHasKey('github_repo_owner', $richObject, 'Must have github_repo_owner');
		$this->assertArrayHasKey('github_repo', $richObject, 'Must have github_repo');

		$this->assertArrayHasKey('title', $richObject, 'Must have title');
		$this->assertArrayHasKey('html_url', $richObject, 'Must have html_url');
		$this->assertArrayHasKey('state', $richObject, 'Must have state');
		$this->assertArrayHasKey('user', $richObject, 'Must have user');
		$this->assertIsArray($richObject['user'], 'user should be an array');
		$this->assertArrayHasKey('login', $richObject['user'], 'user must have login');

		$this->assertArrayHasKey('merged', $richObject, 'PR must have merged field');
		$this->assertArrayHasKey('draft', $richObject, 'PR must have draft field');
		$this->assertArrayHasKey('comments', $richObject, 'Must have comments count');

		$this->assertStringContainsString('github.com', $richObject['html_url'], 'html_url should point to github.com');
		$this->assertContains($richObject['state'], ['open', 'closed'], 'state should be open or closed');
		$this->assertIsBool($richObject['merged'], 'merged should be boolean');
		$this->assertIsBool($richObject['draft'], 'draft should be boolean');

		if ($richObject['state'] === 'closed' && $richObject['merged']) {
			$this->assertArrayHasKey('closed_at', $richObject, 'Merged PR must have closed_at');
		}

		if (isset($richObject['requested_reviewers'])) {
			$this->assertIsArray($richObject['requested_reviewers'], 'requested_reviewers should be an array');
		}

		$this->assertArrayHasKey('created_at', $richObject, 'Must have created_at');
		$this->assertValidDateString($richObject['created_at'], 'created_at should be a valid date string');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testResolveIssueWithCommentReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$referenceUrl = 'https://github.com/nextcloud/server/issues/1#issuecomment-223229268';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve issue with comment reference');

		$richObject = $reference->getRichObject();
		$this->assertIsArray($richObject, 'Rich object should be an array');

		if (isset($richObject['github_comment']) && $richObject['github_comment'] !== null) {
			$this->assertCommentStructure($richObject['github_comment']);
		}
	}

	private function assertCommentStructure(array $comment): void {
		$this->assertArrayHasKey('user', $comment, 'Comment must have user');
		$this->assertIsArray($comment['user'], 'Comment user should be an array');
		$this->assertArrayHasKey('login', $comment['user'], 'Comment user must have login');

		$this->assertArrayHasKey('body', $comment, 'Comment must have body');
		$this->assertArrayHasKey('created_at', $comment, 'Comment must have created_at');
		$this->assertArrayHasKey('updated_at', $comment, 'Comment must have updated_at');
		$this->assertArrayHasKey('html_url', $comment, 'Comment must have html_url');
		$this->assertArrayHasKey('id', $comment, 'Comment must have id');

		$this->assertValidDateString($comment['created_at'], 'Comment created_at should be a valid date string');
		$this->assertValidDateString($comment['updated_at'], 'Comment updated_at should be a valid date string');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testMatchReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');

		$validIssueUrl = 'https://github.com/nextcloud/server/issues/123';
		$validPrUrl = 'https://github.com/nextcloud/server/pull/456';
		$invalidUrl = 'https://github.com/nextcloud/server';

		$this->assertTrue($this->referenceProvider->matchReference($validIssueUrl), 'Should match issue URL');
		$this->assertTrue($this->referenceProvider->matchReference($validPrUrl), 'Should match PR URL');
		$this->assertFalse($this->referenceProvider->matchReference($invalidUrl), 'Should not match repo URL');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testReferenceTitle(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/issues/1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve issue reference');

		$title = $reference->getTitle();
		$this->assertNotEmpty($title, 'Reference should have a title');
		$this->assertStringContainsString('Issue #', $title, 'Title should contain issue identifier');
		$this->assertStringContainsString('nextcloud/server', $title, 'Title should contain repo name');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testReferenceMilestone(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/issues/1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve issue reference');

		$richObject = $reference->getRichObject();

		if (isset($richObject['milestone']) && $richObject['milestone'] !== null) {
			$this->assertArrayHasKey('title', $richObject['milestone'], 'Milestone must have title');
			$this->assertArrayHasKey('html_url', $richObject['milestone'], 'Milestone must have html_url');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testReferenceReactions(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/issues/1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve issue reference');

		$richObject = $reference->getRichObject();

		if (isset($richObject['reactions'])) {
			$this->assertIsArray($richObject['reactions'], 'reactions should be an array');
			$this->assertArrayHasKey('total_count', $richObject['reactions'], 'reactions must have total_count');
		}
	}

	private function assertValidDateString(string $dateString, string $message): void {
		$this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/', $dateString, $message);
	}
}
