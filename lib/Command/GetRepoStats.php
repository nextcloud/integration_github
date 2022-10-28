<?php

/**
 * Nextcloud - Github
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2022
 */

namespace OCA\Github\Command;

use DateTime;
use OCA\Github\Service\GithubAPIService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GetRepoStats extends Command {

	private GithubAPIService $githubAPIService;

	public function __construct(GithubAPIService $githubAPIService) {
		parent::__construct();
		$this->githubAPIService = $githubAPIService;
	}

	protected function configure() {
		$this->setName('github:project-stats')
			->setDescription('Get daily stats for a project')
			->addArgument(
				'repoPath',
				InputArgument::REQUIRED,
				'The path of the project ("nextcloud/text" for example)'
			)
			->addOption(
				'userid',
				'u',
				InputArgument::OPTIONAL,
				'The user who should make the request',
				null
			);
	}

	protected function execute(InputInterface $input, OutputInterface $output) {
		$repoPath = $input->getArgument('repo');
		$userId = $input->getOption('userid');

		$result = [];

		// project info
		$endpoint = 'repos/' . $repoPath;
		$projectInfo = $this->githubAPIService->request($userId, $endpoint, [], 'GET', true);
		if (isset($projectInfo['error'])) {
			$output->writeln('Error: ' . $projectInfo['error']);
			return 1;
		}
		$result['open_issues_count'] = $projectInfo['open_issues_count'];

		// number of issues with bug label
		$endpoint = 'repos/' . $repoPath . '/issues';
		$params = [
			'labels' => 'bug',
			'state' => 'open',
		];
		$bugIssues = $this->githubAPIService->request($userId, $endpoint, $params, 'GET', true);
		if (isset($bugIssues['error'])) {
			$output->writeln('Error: ' . $bugIssues['error']);
			return 1;
		}
		$result['open_bug_issues_count'] = count($bugIssues);

		$now = (new Datetime())->format('Y-m-d');
		$result['date'] = $now;

		$output->writeln(implode(',', array_keys($result)));
		$output->writeln(implode(',', array_values($result)));
		return 0;
	}
}
