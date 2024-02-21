<?php
/**
 * @copyright Copyright (c) 2022 Julien Veyssier <julien-nc@posteo.net>
 *
 * @author Julien Veyssier <julien-nc@posteo.net>
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

use DateTime;
use Exception;
use OC\Collaboration\Reference\ReferenceManager;
use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCP\Collaboration\Reference\ADiscoverableReferenceProvider;
use OCP\Collaboration\Reference\IReference;
use OCP\Collaboration\Reference\ISearchableReferenceProvider;
use OCP\Collaboration\Reference\Reference;
use OCP\IConfig;
use OCP\IL10N;

require_once __DIR__ . '/../../vendor/autoload.php';
use League\CommonMark\GithubFlavoredMarkdownConverter;
use OCP\IURLGenerator;
use Throwable;

class GithubIssuePrReferenceProvider extends ADiscoverableReferenceProvider implements ISearchableReferenceProvider {

	private const RICH_OBJECT_TYPE = Application::APP_ID . '_issue_pr';

	public function __construct(private GithubAPIService $githubAPIService,
		private IConfig $config,
		private IL10N $l10n,
		private IURLGenerator $urlGenerator,
		private ReferenceManager $referenceManager,
		private ?string $userId) {
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'github-issue-pr';
	}

	/**
	 * @inheritDoc
	 */
	public function getTitle(): string {
		return $this->l10n->t('GitHub issues, pull requests and comments');
	}

	/**
	 * @inheritDoc
	 */
	public function getOrder(): int {
		return 10;
	}

	/**
	 * @inheritDoc
	 */
	public function getIconUrl(): string {
		return $this->urlGenerator->getAbsoluteURL(
			$this->urlGenerator->imagePath(Application::APP_ID, 'app-dark.svg')
		);
	}

	/**
	 * @inheritDoc
	 */
	public function getSupportedSearchProviderIds(): array {
		return ['github-search-issues', 'github-search-repos'];
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
		return preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/[^\/\?]+\/[^\/\?]+\/(issues|pull)\/[0-9]+/i', $referenceText) === 1;
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
				if (isset($issueInfo['title'])) {
					$issueInfo['title'] = $this->stripMarkdown($issueInfo['title']);
				}
				$issueTitle = $issueInfo['title'] ?? '';
				$issueNumber = $issueInfo['number'] ?? '';
				$titlePrefix = $commentInfo ? '[' . $this->l10n->t('Comment') .'] ' : '';
				$reference->setTitle($titlePrefix . $issueTitle . ' · Issue #' . $issueNumber . ' · ' . $owner . '/' . $repo);
				$reference->setRichObject(
					self::RICH_OBJECT_TYPE,
					array_merge([
						'github_type' => isset($issueInfo['error']) ? 'issue-error' : 'issue',
						'github_issue_id' => $id,
						'github_repo_owner' => $owner,
						'github_repo' => $repo,
						'github_comment' => $commentInfo,
						'vcs_comment' => $commentInfo ? $this->getGenericCommentInfo($commentInfo) : null,
						'vcs_issue' => $this->getGenericIssueInfo($issueInfo),
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
					if (isset($prInfo['title'])) {
						$prInfo['title'] = $this->stripMarkdown($prInfo['title']);
					}
					$prNumber = $prInfo['number'] ?? '';
					$titlePrefix = $commentInfo ? '[' . $this->l10n->t('Comment') .'] ' : '';
					$reference->setTitle($titlePrefix . $prTitle . ' · Pull Request #' . $prNumber . ' · ' . $owner . '/' . $repo);
					$reference->setRichObject(
						self::RICH_OBJECT_TYPE,
						array_merge([
							'github_type' => isset($prInfo['error']) ? 'pr-error' : 'pull_request',
							'github_pr_id' => $id,
							'github_repo_owner' => $owner,
							'github_repo' => $repo,
							'github_comment' => $commentInfo,
							'vcs_comment' => $commentInfo ? $this->getGenericCommentInfo($commentInfo) : null,
							'vcs_pull_request' => $this->getGenericPrInfo($prInfo),
						], $prInfo),
					);
					return $reference;
				}
			}
		}

		return null;
	}

	/**
	 * @param array $commentInfo
	 * @return array
	 */
	private function getGenericCommentInfo(array $commentInfo): array {
		$info = [
			'url' => $commentInfo['html_url'] ?? null,
			'body' => $commentInfo['body'] ?? '',
		];
		if (isset($commentInfo['created_at'])) {
			try {
				$ts = (new DateTime($commentInfo['created_at']))->getTimestamp();
				$info['created_at'] = $ts;
			} catch (Exception | Throwable $e) {
			}
		}
		if (isset($commentInfo['updated_at'])) {
			try {
				$ts = (new DateTime($commentInfo['updated_at']))->getTimestamp();
				$info['updated_at'] = $ts;
			} catch (Exception | Throwable $e) {
			}
		}
		if (isset($commentInfo['user'], $commentInfo['user']['login'])) {
			$info['author'] = $commentInfo['user']['login'];
		}

		return $info;
	}

	/**
	 * @param array $issueInfo
	 * @return array
	 */
	private function getGenericIssueInfo(array $issueInfo): array {
		$info = [
			'id' => $issueInfo['number'] ?? null,
			'url' => $issueInfo['html_url'] ?? null,
			'title' => $issueInfo['title'] ?? '',
			'comment_count' => $issueInfo['comments'] ?? 0,
			'state' => $issueInfo['state'] ?? null,
		];

		if (isset($issueInfo['labels']) && is_array($issueInfo['labels'])) {
			$info['labels'] = array_map(static function (array $label) {
				return [
					'name' => $label['name'],
					'color' => $label['color'],
				];
			}, $issueInfo['labels']);
		}
		if (isset($issueInfo['created_at'])) {
			try {
				$ts = (new DateTime($issueInfo['created_at']))->getTimestamp();
				$info['created_at'] = $ts;
			} catch (Exception | Throwable $e) {
			}
		}
		if (isset($issueInfo['user'], $issueInfo['user']['login'])) {
			$info['author'] = $issueInfo['user']['login'];
		}

		return $info;
	}

	/**
	 * @param array $prInfo
	 * @return array
	 */
	private function getGenericPrInfo(array $prInfo): array {
		$info = [
			'id' => $prInfo['number'] ?? null,
			'url' => $prInfo['html_url'] ?? null,
			'title' => $prInfo['title'] ?? '',
			'comment_count' => $prInfo['comments'] ?? 0,
			'state' => $prInfo['state'] ?? null,
			'merged' => $prInfo['merged'] ?? false,
			'draft' => $prInfo['draft'] ?? false,
		];

		if (isset($prInfo['labels']) && is_array($prInfo['labels'])) {
			$info['labels'] = array_map(static function (array $label) {
				return [
					'name' => $label['name'],
					'color' => $label['color'],
				];
			}, $prInfo['labels']);
		}
		if (isset($prInfo['created_at'])) {
			try {
				$ts = (new DateTime($prInfo['created_at']))->getTimestamp();
				$info['created_at'] = $ts;
			} catch (Exception | Throwable $e) {
			}
		}
		if (isset($prInfo['user'], $prInfo['user']['login'])) {
			$info['author'] = $prInfo['user']['login'];
		}

		return $info;
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
		return count($matches) > 1 ? ((int) $matches[1]) : null;
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

	/**
	 * @param string $content
	 * @return string
	 */
	private function stripMarkdown(string $content): string {
		$converter = new GithubFlavoredMarkdownConverter();
		// remove html chars like &quot; &nbsp; etc...
		return html_entity_decode(
			// remove xml tags
			strip_tags(
				$converter->convert($content)->getContent()
			)
		);
	}
}
