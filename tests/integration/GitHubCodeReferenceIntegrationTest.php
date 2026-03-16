<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use OCA\Github\Reference\GithubCodeReferenceProvider;
use OCA\Github\Service\SecretService;
use OCP\Collaboration\Reference\IReference;
use OCP\Server;
use PHPUnit\Framework\Attributes\DependsExternal;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GitHubCodeReferenceIntegrationTest extends TestCase {
	private GithubCodeReferenceProvider $referenceProvider;
	private SecretService $secretService;

	protected function setUp(): void {
		parent::setUp();

		$this->referenceProvider = Server::get(GithubCodeReferenceProvider::class);
		$this->secretService = Server::get(SecretService::class);
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testResolveSingleLineCodeReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');
		$userId = $oauthData['userId'];

		$token = $this->secretService->getEncryptedUserValue($userId, 'token');
		$this->assertNotSame('', $token, 'Token should be stored after OAuth flow');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$richObject = $reference->getRichObject();
		$this->assertIsArray($richObject, 'Rich object should be an array');
		$this->assertCodeRichObjectStructure($richObject);
	}

	private function assertCodeRichObjectStructure(array $richObject): void {
		$this->assertArrayHasKey('github_type', $richObject, 'Must have github_type');
		$this->assertContains($richObject['github_type'], ['code', 'code-error'], 'github_type should be code or code-error');

		if ($richObject['github_type'] === 'code-error') {
			$this->assertArrayHasKey('error', $richObject, 'Error type should have error info');
			return;
		}

		$this->assertArrayHasKey('owner', $richObject, 'Must have owner');
		$this->assertArrayHasKey('repo', $richObject, 'Must have repo');
		$this->assertArrayHasKey('filePath', $richObject, 'Must have filePath');
		$this->assertArrayHasKey('link', $richObject, 'Must have link');
		$this->assertArrayHasKey('html_url', $richObject, 'Must have html_url');

		$this->assertArrayHasKey('ref', $richObject, 'Must have ref');
		$this->assertIsArray($richObject['ref'], 'ref should be an array');
		$this->assertArrayHasKey('original_ref', $richObject['ref'], 'ref must have original_ref');
		$this->assertArrayHasKey('sha', $richObject['ref'], 'ref must have sha');

		$this->assertArrayHasKey('lineBegin', $richObject, 'Must have lineBegin');
		$this->assertIsInt($richObject['lineBegin'], 'lineBegin should be an integer');
		$this->assertGreaterThan(0, $richObject['lineBegin'], 'lineBegin should be positive');

		$this->assertArrayHasKey('lines', $richObject, 'Must have lines array');
		$this->assertIsArray($richObject['lines'], 'lines should be an array');
		$this->assertNotEmpty($richObject['lines'], 'lines should not be empty');

		$this->assertStringContainsString('github.com', $richObject['link'], 'link should contain github.com');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testResolveMultiLineCodeReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1-L5';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve multi-line code reference');

		$richObject = $reference->getRichObject();

		if ($richObject['github_type'] === 'code-error') {
			$this->markTestSkipped('GitHub API error for multi-line reference');
		}

		$this->assertArrayHasKey('lineEnd', $richObject, 'Must have lineEnd for multi-line');
		$this->assertIsInt($richObject['lineEnd'], 'lineEnd should be an integer');
		$this->assertGreaterThan($richObject['lineBegin'], $richObject['lineEnd'], 'lineEnd should be greater than lineBegin');

		$expectedLineCount = $richObject['lineEnd'] - $richObject['lineBegin'] + 1;
		$this->assertCount($expectedLineCount, $richObject['lines'], 'lines array should have correct count');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testMatchReference(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');

		$validSingleLine = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$validMultiLine = 'https://github.com/nextcloud/server/blob/abc123/lib/base.php#L1-L10';
		$invalidNoLine = 'https://github.com/nextcloud/server/blob/master/lib/base.php';
		$invalidWrongUrl = 'https://github.com/nextcloud/server';

		$this->assertTrue($this->referenceProvider->matchReference($validSingleLine), 'Should match single line URL');
		$this->assertTrue($this->referenceProvider->matchReference($validMultiLine), 'Should match multi-line URL');
		$this->assertFalse($this->referenceProvider->matchReference($invalidNoLine), 'Should not match URL without line');
		$this->assertFalse($this->referenceProvider->matchReference($invalidWrongUrl), 'Should not match non-blob URL');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testReferenceTitle(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$title = $reference->getTitle();
		$this->assertNotEmpty($title, 'Reference should have a title');
		$this->assertStringContainsString('permalink', strtolower($title), 'Title should mention permalink');
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testReferenceDescription(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$richObject = $reference->getRichObject();

		if ($richObject['github_type'] !== 'code-error') {
			$description = $reference->getDescription();
			$this->assertNotEmpty($description, 'Reference should have a description with code content');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testShortRefFormat(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$richObject = $reference->getRichObject();

		if ($richObject['github_type'] !== 'code-error') {
			$this->assertArrayHasKey('ref', $richObject);
			$this->assertArrayHasKey('original_ref', $richObject['ref']);
			$this->assertArrayHasKey('sha', $richObject['ref']);

			if ($richObject['ref']['sha'] !== '') {
				$this->assertMatchesRegularExpression('/^[0-9a-f]{7,40}$/', $richObject['ref']['sha'], 'sha should be a valid git hash');
			}
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testVcsCodePermalinkStructure(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$richObject = $reference->getRichObject();

		if ($richObject['github_type'] !== 'code-error') {
			$this->assertArrayHasKey('vcs_code_permalink', $richObject, 'Must have vcs_code_permalink');
			$vcsCode = $richObject['vcs_code_permalink'];

			$this->assertIsArray($vcsCode, 'vcs_code_permalink should be an array');
			$this->assertArrayHasKey('line_begin', $vcsCode, 'vcs_code_permalink must have line_begin');
			$this->assertArrayHasKey('line_end', $vcsCode, 'vcs_code_permalink must have line_end');
			$this->assertArrayHasKey('lines', $vcsCode, 'vcs_code_permalink must have lines');
			$this->assertArrayHasKey('file_url', $vcsCode, 'vcs_code_permalink must have file_url');
			$this->assertArrayHasKey('file_path', $vcsCode, 'vcs_code_permalink must have file_path');
			$this->assertArrayHasKey('file_name', $vcsCode, 'vcs_code_permalink must have file_name');

			$this->assertSame($richObject['lineBegin'], $vcsCode['line_begin'], 'line_begin should match lineBegin');
			$this->assertSame($richObject['filePath'], $vcsCode['file_path'], 'file_path should match filePath');
			$this->assertSame(basename($richObject['filePath']), $vcsCode['file_name'], 'file_name should be basename of filePath');
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testCodeLinesContent(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1-L3';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$richObject = $reference->getRichObject();

		if ($richObject['github_type'] !== 'code-error') {
			$this->assertArrayHasKey('lines', $richObject);
			$this->assertCount(3, $richObject['lines'], 'Should have 3 lines');

			foreach ($richObject['lines'] as $line) {
				$this->assertIsString($line, 'Each line should be a string');
			}
		}
	}

	#[DependsExternal(GithubOauthIntegrationTest::class, 'testOAuthLogin')]
	public function testFilePathExtraction(array $oauthData): void {
		$this->assertIsArray($oauthData, 'oauthData should be an array from OAuth test');
		$this->assertArrayHasKey('userId', $oauthData, 'oauthData must contain userId');

		$referenceUrl = 'https://github.com/nextcloud/server/blob/master/lib/base.php#L1';
		$reference = $this->referenceProvider->resolveReference($referenceUrl);

		$this->assertInstanceOf(IReference::class, $reference, 'Should resolve code reference');

		$richObject = $reference->getRichObject();

		if ($richObject['github_type'] !== 'code-error') {
			$this->assertArrayHasKey('filePath', $richObject);
			$this->assertStringEndsWith('.php', $richObject['filePath'], 'filePath should end with .php');
			$this->assertStringContainsString('lib', $richObject['filePath'], 'filePath should contain lib');
		}
	}
}
