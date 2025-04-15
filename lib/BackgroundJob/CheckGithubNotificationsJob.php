<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\BackgroundJob;

use OCA\Github\Service\GithubAPIService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\TimedJob;

use Psr\Log\LoggerInterface;

class CheckGithubNotificationsJob extends TimedJob {
	public function __construct(
		ITimeFactory $time,
		private GithubAPIService $githubAPIService,
		private LoggerInterface $logger
	) {
		parent::__construct($time);
		$this->setInterval(60 * 15); // Every 15 minutes
	}

	protected function run($argument): void {
		$this->githubAPIService->checkNewNotifications();
		$this->logger->info('Checked if users have new unread GitHub notification.');
	}
}
