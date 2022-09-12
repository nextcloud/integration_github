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

use OC\Collaboration\Reference\Reference;
use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCP\Collaboration\Reference\IReference;
use OCP\Collaboration\Reference\IReferenceProvider;
use OCP\IConfig;

class GithubReferenceProvider implements IReferenceProvider {
	private GithubAPIService $githubAPIService;
	private ?string $userId;
	private IConfig $config;

	public function __construct(GithubAPIService $githubAPIService,
								IConfig $config,
								?string $userId) {
		$this->githubAPIService = $githubAPIService;
		$this->userId = $userId;
		$this->config = $config;
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
		if (preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/[^\/\?]+\/[^\/\?]+\/(issues|pull)\/[0-9]+/', $referenceText) === 1) {
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
					$reference->setRichObject(Application::APP_ID, array_merge([
						'github_type' => isset($prInfo['error']) ? 'pr-error' : 'pr',
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

	private function getIssuePath(string $url): ?array {
		preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?]+)\/([^\/\?]+)\/issues\/([0-9]+)(.*$)/', $url, $matches);
		return count($matches) > 3 ? [$matches[1], $matches[2], $matches[3], $matches[4]] : null;
	}

	private function getPrPath(string $url): ?array {
		preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?]+)\/([^\/\?]+)\/pull\/([0-9]+)(.*$)/', $url, $matches);
		return count($matches) > 3 ? [$matches[1], $matches[2], $matches[3], $matches[4]] : null;
	}

	private function getCommentInfo(string $owner, string $repo, string $end): ?array {
		preg_match('/^#issuecomment-([0-9]+)$/', $end, $matches);
		return $matches ? $this->githubAPIService->getIssueCommentInfo($this->userId, $owner, $repo, $matches[1]) : null;
	}

	public function getCachePrefix(string $referenceId): string {
		return $referenceId;
	}

	public function getCacheKey(string $referenceId): ?string {
		return null;
	}
}
