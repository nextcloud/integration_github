<?php
/**
 * @copyright Copyright (c) 2022 Julien Veyssier <eneiluj@posteo.net>
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

namespace OCA\Github\Reference;

use League\CommonMark\GithubFlavoredMarkdownConverter;
use OCP\Collaboration\Reference\Reference;
use OC\Collaboration\Reference\ReferenceManager;
use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCP\Collaboration\Reference\IReference;
use OCP\Collaboration\Reference\IReferenceProvider;
use OCP\IConfig;
use OCP\IL10N;

require_once __DIR__ . '/../../vendor/autoload.php';

class GithubReferenceProvider implements IReferenceProvider {
	private GithubAPIService $githubAPIService;
	private ?string $userId;
	private IConfig $config;
	private ReferenceManager $referenceManager;
	private IL10N $l10n;

	public function __construct(GithubAPIService $githubAPIService,
								IConfig $config,
								IL10N $l10n,
								ReferenceManager $referenceManager,
								?string $userId) {
		$this->githubAPIService = $githubAPIService;
		$this->userId = $userId;
		$this->config = $config;
		$this->referenceManager = $referenceManager;
		$this->l10n = $l10n;
	}

	/**
	 * @inheritDoc
	 */
	public function matchReference(string $referenceText): bool {
		if ($this->userId !== null) {
			$linkPreviewEnabled = $this->config->getUserValue($this->userId, Application::APP_ID, 'link_preview_enabled', '1') === '1';
			if (!$linkPreviewEnabled) {
				return false;
			}
		}
		$adminLinkPreviewEnabled = $this->config->getAppValue(Application::APP_ID, 'link_preview_enabled', '1') === '1';
		if (!$adminLinkPreviewEnabled) {
			return false;
		}
		if (preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/[^\/\?]+\/[^\/\?]+\/(issues|pull)\/[0-9]+/i', $referenceText) === 1) {
			return true;
		}
		return false;
	}

	/**
	 * @inheritDoc
	 */
	public function resolveReference(string $referenceText): ?IReference {
		if ($this->matchReference($referenceText)) {
			$issuePath = $this->getIssuePath($referenceText);
			if ($issuePath !== null) {
				[$owner, $repo, $id, $end] = $issuePath;
				$commentInfo = $this->getCommentInfo($owner, $repo, $end);
				$issueInfo = $this->githubAPIService->getIssueInfo($this->userId, $owner, $repo, $id);
				$reference = new Reference($referenceText);
				if ($issueInfo['title']) {
					$issueInfo['title'] = $this->stripMarkdown($issueInfo['title']);
				}
				$issueTitle = $issueInfo['title'] ?? '';
				$issueNumber = $issueInfo['number'] ?? '';
				$titlePrefix = $commentInfo ? '[' . $this->l10n->t('Comment') .'] ' : '';
				$reference->setTitle($titlePrefix . $issueTitle . ' · Issue #' . $issueNumber . ' · ' . $owner . '/' . $repo);
				$reference->setRichObject(Application::APP_ID, array_merge([
					'github_type' => isset($issueInfo['error']) ? 'issue-error' : 'issue',
					'github_issue_id' => $id,
					'github_repo_owner' => $owner,
					'github_repo' => $repo,
					'github_comment' => $commentInfo,
					], $issueInfo),
				);
				return $reference;
			} else {
				$prPath = $this->getPrPath($referenceText);
				if ($prPath !== null) {
					[$owner, $repo, $id, $end] = $prPath;
					$commentInfo = $this->getCommentInfo($owner, $repo, $end);
					$prInfo = $this->githubAPIService->getPrInfo($this->userId, $owner, $repo, $id);
					$reference = new Reference($referenceText);
					$prTitle = $prInfo['title'] ?? '';
					if ($prInfo['title']) {
						$prInfo['title'] = $this->stripMarkdown($prInfo['title']);
					}
					$prNumber = $prInfo['number'] ?? '';
					$titlePrefix = $commentInfo ? '[' . $this->l10n->t('Comment') .'] ' : '';
					$reference->setTitle($titlePrefix . $prTitle . ' · Pull Request #' . $prNumber . ' · ' . $owner . '/' . $repo);
					$reference->setRichObject(Application::APP_ID, array_merge([
						'github_type' => isset($prInfo['error']) ? 'pr-error' : 'pull_request',
						'github_pr_id' => $id,
						'github_repo_owner' => $owner,
						'github_repo' => $repo,
						'github_comment' => $commentInfo,
						], $prInfo),
					);
					return $reference;
				}
			}
		}

		return null;
	}

	/**
	 * @param string $url
	 * @return array|null
	 */
	private function getIssuePath(string $url): ?array {
		preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?]+)\/([^\/\?]+)\/issues\/([0-9]+)(.*$)/i', $url, $matches);
		return count($matches) > 3 ? [$matches[1], $matches[2], $matches[3], $matches[4]] : null;
	}

	/**
	 * @param string $url
	 * @return array|null
	 */
	private function getPrPath(string $url): ?array {
		preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?]+)\/([^\/\?]+)\/pull\/([0-9]+)(.*$)/i', $url, $matches);
		return count($matches) > 3 ? [$matches[1], $matches[2], $matches[3], $matches[4]] : null;
	}

	/**
	 * @param string $urlEnd
	 * @return int|null
	 */
	private function getCommentId(string $urlEnd): ?int {
		preg_match('/^#issuecomment-([0-9]+)$/', $urlEnd, $matches);
		return (is_array($matches) && count($matches) > 1) ? ((int) $matches[1]) : null;
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param string $end
	 * @return array|null
	 */
	private function getCommentInfo(string $owner, string $repo, string $end): ?array {
		$commentId = $this->getCommentId($end);
		return $commentId !== null ? $this->githubAPIService->getIssueCommentInfo($this->userId, $owner, $repo, $commentId) : null;
	}

	/**
	 * We use the userId here because when connecting/disconnecting from the GitHub account,
	 * we want to invalidate all the user cache and this is only possible with the cache prefix
	 * @inheritDoc
	 */
	public function getCachePrefix(string $referenceId): string {
		return $this->userId ?? '';
	}

	/**
	 * We don't use the userId here but rather a reference unique id
	 * @inheritDoc
	 */
	public function getCacheKey(string $referenceId): ?string {
		$issuePath = $this->getIssuePath($referenceId);
		if ($issuePath !== null) {
			[$owner, $repo, $id, $end] = $issuePath;
			$commentId = $this->getCommentId($end);
			return $owner . '/' . $repo . '/' . $id . '/' . $commentId;
		} else {
			$prPath = $this->getPrPath($referenceId);
			if ($prPath !== null) {
				[$owner, $repo, $id, $end] = $prPath;
				$commentId = $this->getCommentId($end);
				return $owner . '/' . $repo . '/' . $id . '/' . $commentId;
			}
		}

		return $referenceId;
	}

	/**
	 * @param string $userId
	 * @return void
	 */
	public function invalidateUserCache(string $userId): void {
		$this->referenceManager->invalidateCache($userId);
	}

	private function stripMarkdown(string $content): string {
		$converter = new GithubFlavoredMarkdownConverter();
		return strip_tags($converter->convert($content)->getContent());
	}
}
