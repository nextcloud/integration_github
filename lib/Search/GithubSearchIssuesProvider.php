<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2020, Julien Veyssier
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 *
 */
namespace OCA\Github\Search;

use OCA\Github\Service\GithubAPIService;
use OCA\Github\AppInfo\Application;
use OCP\App\IAppManager;
use OCP\IL10N;
use OCP\IConfig;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\IProvider;
use OCP\Search\ISearchQuery;
use OCP\Search\SearchResult;

class GithubSearchIssuesProvider implements IProvider {

	/** @var IAppManager */
	private $appManager;

	/** @var IL10N */
	private $l10n;

	/** @var IURLGenerator */
	private $urlGenerator;
	/**
	 * @var IConfig
	 */
	private $config;
	/**
	 * @var GithubAPIService
	 */
	private $service;

	/**
	 * CospendSearchProvider constructor.
	 *
	 * @param IAppManager $appManager
	 * @param IL10N $l10n
	 * @param IConfig $config
	 * @param IURLGenerator $urlGenerator
	 * @param GithubAPIService $service
	 */
	public function __construct(IAppManager $appManager,
								IL10N $l10n,
								IConfig $config,
								IURLGenerator $urlGenerator,
								GithubAPIService $service) {
		$this->appManager = $appManager;
		$this->l10n = $l10n;
		$this->config = $config;
		$this->urlGenerator = $urlGenerator;
		$this->service = $service;
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

//		$theme = $this->config->getUserValue($user->getUID(), 'accessibility', 'theme', '');

		$accessToken = $this->config->getUserValue($user->getUID(), Application::APP_ID, 'token');
		$searchIssuesEnabled = $this->config->getUserValue($user->getUID(), Application::APP_ID, 'search_issues_enabled', '0') === '1';
		if ($accessToken === '' || !$searchIssuesEnabled) {
			return SearchResult::paginated($this->getName(), [], 0);
		}

		$searchResult = $this->service->searchIssues($accessToken, $term, $offset, $limit);
		if (isset($searchResult['error'])) {
			$issues = [];
		} else {
			$issues = $searchResult['items'];
		}

		$formattedResults = array_map(function (array $entry): GithubSearchResultEntry {
			return new GithubSearchResultEntry(
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
					: '⋯'))
			: ($entry['state'] === 'closed'
				? '❌'
				: '⋯');
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
		$typeChar = isset($entry['pull_request']) ? '⑃' : '🛈';
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
		return $this->urlGenerator->linkToRoute('integration_github.githubAPI.getAvatar', []) . '?githubUserName=' . urlencode($userName);
	}
}
