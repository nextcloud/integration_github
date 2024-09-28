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

class GithubSearchReposProvider implements IProvider {

	public function __construct(
		private IAppManager $appManager,
		private IL10N $l10n,
		private IConfig $config,
		private IURLGenerator $urlGenerator,
		private GithubAPIService $service,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'github-search-repos';
	}

	/**
	 * @inheritDoc
	 */
	public function getName(): string {
		return $this->l10n->t('GitHub repositories');
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

		$searchReposEnabled = $this->config->getUserValue($user->getUID(), Application::APP_ID, 'search_repos_enabled', '0') === '1';
		if (!$requestedFromSmartPicker && !$searchReposEnabled) {
			return SearchResult::paginated($this->getName(), [], 0);
		}

		$accessToken = $this->config->getUserValue($user->getUID(), Application::APP_ID, 'token');
		if ($accessToken === '') {
			return SearchResult::paginated($this->getName(), [], 0);
		}

		$searchResult = $this->service->searchRepositories($user->getUID(), $term, $offset, $limit);
		if (isset($searchResult['error'])) {
			$repos = [];
		} else {
			$repos = $searchResult['items'];
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
		}, $repos);

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
		return $entry['full_name'] . ' [' . ($entry['stargazers_count'] ?? 0) . '⭐]';
	}

	/**
	 * @param array $entry
	 * @return string
	 */
	protected function getSubline(array $entry): string {
		return $entry['description'] ?? '';
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
		$userName = $entry['owner']['login'] ?? '';
		return $this->urlGenerator->linkToRoute('integration_github.githubAPI.getAvatar', ['githubLogin' => $userName]);
	}
}
