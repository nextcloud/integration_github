<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Github\Search;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCP\App\IAppManager;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\IProvider;
use OCP\Search\ISearchQuery;
use OCP\Search\SearchResult;
use OCP\Search\SearchResultEntry;

class GithubSearchIssuesProvider implements IProvider {

	public function __construct(private IAppManager $appManager,
		private IL10N $l10n,
		private IConfig $config,
		private IURLGenerator $urlGenerator,
		private GithubAPIService $service) {
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'github-search-issues';
	}

	/**
	 * @inheritDoc
	 */
	public function getName(): string {
		return $this->l10n->t('GitHub issues and pull requests');
	}

	/**
	 * @inheritDoc
	 */
	public function getOrder(string $route, array $routeParameters): int {
		if (strpos($route, Application::APP_ID . '.') === 0) {
			// Active app, prefer Github results
			return -1;
		}

		return 20;
	}

	/**
	 * @inheritDoc
	 */
	public function search(IUser $user, ISearchQuery $query): SearchResult {
		if (!$this->appManager->isEnabledForUser(Application::APP_ID, $user)) {
			return SearchResult::complete($this->getName(), []);
		}

		$limit = $query->getLimit();
		$term = $query->getTerm();
		$offset = $query->getCursor();
		$offset = $offset ? intval($offset) : 0;

		$routeFrom = $query->getRoute();
		$requestedFromSmartPicker = $routeFrom === '' || $routeFrom === 'smart-picker';

		$searchIssuesEnabled = $this->config->getUserValue($user->getUID(), Application::APP_ID, 'search_issues_enabled', '0') === '1';
		if (!$requestedFromSmartPicker && !$searchIssuesEnabled) {
			return SearchResult::paginated($this->getName(), [], 0);
		}

		$accessToken = $this->config->getUserValue($user->getUID(), Application::APP_ID, 'token');
		if ($accessToken === '') {
			return SearchResult::paginated($this->getName(), [], 0);
		}

		$searchResult = $this->service->searchIssues($user->getUID(), $term, $offset, $limit);
		if (isset($searchResult['error'])) {
			$issues = [];
		} else {
			$issues = $searchResult['items'];
		}

		$formattedResults = array_map(function (array $entry): SearchResultEntry {
			return new SearchResultEntry(
				$this->getThumbnailUrl($entry),
				$this->getMainText($entry),
				$this->getSubline($entry),
				$this->getLinkToGithub($entry),
				'',
				true
			);
		}, $issues);

		return SearchResult::paginated(
			$this->getName(),
			$formattedResults,
			$offset + $limit
		);
	}

	/**
	 * @param array $entry
	 * @return string
	 */
	protected function getMainText(array $entry): string {
		$stateChar = isset($entry['pull_request'])
			? ($entry['merged']
				? '✅'
				: ($entry['state'] === 'closed'
					? '❌'
					: ''))
			: ($entry['state'] === 'closed'
				? '❌'
				: '');
		return $stateChar . ' ' . $entry['title'];
	}

	/**
	 * @param array $entry
	 * @return string
	 */
	protected function getSubline(array $entry): string {
		$repoFullName = str_replace('https://api.github.com/repos/', '', $entry['repository_url']);
		$spl = explode('/', $repoFullName);
		//		$owner = $spl[0];
		$repo = $spl[1];
		$number = $entry['number'];
		$typeChar = isset($entry['pull_request']) ? '⑁' : '⦿';
		return $typeChar . ' ' . $repo . '#' . $number;
	}

	/**
	 * @param array $entry
	 * @return string
	 */
	protected function getLinkToGithub(array $entry): string {
		return $entry['html_url'] ?? '';
	}

	/**
	 * @param array $entry
	 * @return string
	 */
	protected function getThumbnailUrl(array $entry): string {
		$userName = $entry['project_owner_login'] ?? '';
		return $this->urlGenerator->linkToRoute('integration_github.githubAPI.getAvatar', ['githubLogin' => $userName]);
	}
}
