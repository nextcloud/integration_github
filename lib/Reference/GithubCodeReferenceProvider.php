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

use OCP\Collaboration\Reference\ADiscoverableReferenceProvider;
use OCP\Collaboration\Reference\Reference;
use OC\Collaboration\Reference\ReferenceManager;
use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCP\Collaboration\Reference\IReference;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IURLGenerator;

class GithubCodeReferenceProvider extends ADiscoverableReferenceProvider {

	private const RICH_OBJECT_TYPE = Application::APP_ID . '_code_permalink';

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
	public function getId(): string	{
		return 'github-permalink';
	}

	/**
	 * @inheritDoc
	 */
	public function getTitle(): string {
		return $this->l10n->t('GitHub code permalink');
	}

	/**
	 * @inheritDoc
	 */
	public function getOrder(): int	{
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

		// https://github.com/nextcloud/text/blob/691cbe485e1323759037b7d9256e4fc1ab2de865/src/main.js#L12
		// or https://github.com/nextcloud/text/blob/691cbe485e1323759037b7d9256e4fc1ab2de865/src/main.js#L12-L15
		if (preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/[^\/\?]+\/[^\/\?]+\/blob\/[0-9a-z]+\/.*#[^#]+$/i', $referenceText) === 1) {
			return true;
		}
		return false;
	}

	/**
	 * @inheritDoc
	 */
	public function resolveReference(string $referenceText): ?IReference {
		if ($this->matchReference($referenceText)) {
			$info = $this->getPermalinkInfo($referenceText);
			if ($info !== null) {
				$reference = new Reference($referenceText);

				$info['github_type'] = isset($info['error']) ? 'code-error' : 'code';
				$info['link'] = $referenceText;

				if (!isset($info['error'])) {
					$contentResponse = $this->githubAPIService->getFileContent($this->userId, $info['owner'], $info['repo'], $info['ref']['original_ref'], $info['filePath']);

					if (isset($contentResponse['error'])) {
						$info['error'] = $contentResponse['error'];
						$info['body'] = $contentResponse['body'] ?? null;
						$info['github_type'] = 'code-error';
					} elseif (isset($contentResponse['type']) && $contentResponse['type'] === 'file') {
						$info['html_url'] = $contentResponse['html_url'] ?? null;

						$base64Content = $contentResponse['content'];
						$rawContent = base64_decode($base64Content);
						$contentLines = explode("\n", $rawContent);

						$reference->setTitle('Code permalink ' . $referenceText);
						if (!isset($info['lineEnd'])) {
							$lineIndex = $info['lineBegin'] - 1;
							$reference->setDescription($contentLines[$lineIndex]);
							$info['lines'] = [$contentLines[$lineIndex]];
						} else {
							$firstLineIndex = $info['lineBegin'] - 1;
							$lastLineIndex = 1 + $info['lineEnd'] - $info['lineBegin'];
							$reference->setDescription(
								implode("\n", array_slice($contentLines, $firstLineIndex, $lastLineIndex))
							);
							$info['lines'] = array_slice($contentLines, $firstLineIndex, $lastLineIndex);
						}
						$info['vcs_code_permalink'] = $this->getGenericCodeInfo($info);
					}
				}

				$reference->setRichObject(
					self::RICH_OBJECT_TYPE,
					$info,
				);
				return $reference;
			}
		}

		return null;
	}

	/**
	 * @param array $permalinkInfo
	 * @return array
	 */
	private function getGenericCodeInfo(array $permalinkInfo): array {
		return [
			'line_begin' => $permalinkInfo['lineBegin'],
			'line_end' => $permalinkInfo['lineEnd'],
			'lines' => $permalinkInfo['lines'],
			'file_url' => $permalinkInfo['html_url'],
			'file_path' => $permalinkInfo['filePath'],
			'file_name' => basename($permalinkInfo['filePath']),
		];
	}

	/**
	 * @param string $url
	 * @return array|null
	 */
	private function getPermalinkInfo(string $url): ?array {
		preg_match('/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?]+)\/([^\/\?]+)\/blob\/[0-9a-z]+\/.*#([^#]+)$/i', $url, $matches);
		if (count($matches) > 3) {
			$owner = $matches[1];
			$repo = $matches[2];
			$lines = $matches[3];

			$parsedUrl = parse_url($url);
			$path = trim($parsedUrl['path'], '/');
			$refAndPath = str_replace($owner . '/' . $repo . '/blob/', '', $path);
			$ref = $this->findRefFromPath($owner, $repo, $refAndPath);
			$filePath = str_replace($ref['original_ref'] . '/', '', $refAndPath);

			$info = [
				'owner' => $owner,
				'repo' => $repo,
				'ref' => $ref,
				'lineBeginEnd' => $lines,
				'filePath' => $filePath,
			];

			if (str_contains($lines, '-')) {
				preg_match('/^L(\d+)-L(\d+)$/', $lines, $linesMatches);
				if (count($linesMatches) > 2) {
					$info['lineBegin'] = (int)$linesMatches[1];
					$info['lineEnd'] = (int)$linesMatches[2];
				} else {
					return null;
				}
			} else {
				preg_match('/^L(\d+)$/', $lines, $lineMatches);
				if (count($lineMatches) > 1) {
					$info['lineBegin'] = (int)$lineMatches[1];
				} else {
					return null;
				}
			}

			return $info;
		}
		return null;
	}

	/**
	 * @param string $owner
	 * @param string $repo
	 * @param string $refAndPath
	 * @return string[]
	 */
	private function findRefFromPath(string $owner, string $repo, string $refAndPath): array {
		$parts = explode('/', $refAndPath);

		// try with first path part (might be the most common winner)
		$refCandidates = [$parts[0]];
		// then try from bigger to smaller potential refs
		while (count($parts) > 2) {
			array_pop($parts);
			$refCandidates[] = implode('/', $parts);
		}
		// so, for "a/b/c/d/e.php", the ref candidates will be "a", "a/b/c/d", "a/b/c", "a/b"

		foreach ($refCandidates as $refCandidate) {
			$commitResponse = $this->githubAPIService->getCommitInfo($this->userId, $owner, $repo, $refCandidate);
			if (!isset($commitResponse['error'])) {
				$commitResponse['original_ref'] = $refCandidate;
				return $commitResponse;
			}
		}

		return [
			'original_ref' => '',
			'sha' => '',
		];
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
		return $referenceId;
	}

	/**
	 * @param string $userId
	 * @return void
	 */
	public function invalidateUserCache(string $userId): void {
		$this->referenceManager->invalidateCache($userId);
	}
}
