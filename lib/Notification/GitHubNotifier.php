<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Notification;

use InvalidArgumentException;
use OCA\Github\AppInfo\Application;
use OCP\IURLGenerator;
use OCP\L10N\IFactory;
use OCP\Notification\INotification;
use OCP\Notification\INotifier;

class GitHubNotifier implements INotifier {
	public function __construct(
		private IFactory $factory,
		private IURLGenerator $urlGenerator,
	) {
	}

	public function getID(): string {
		return 'integration_github';
	}

	public function getName(): string {
		return $this->factory->get('integration_github')->t('GitHub');
	}

	public function prepare(INotification $notification, string $languageCode): INotification {
		if ($notification->getApp() !== Application::APP_ID) {
			throw new InvalidArgumentException();
		}

		$l = $this->factory->get(Application::APP_ID, $languageCode);

		switch ($notification->getSubject()) {
			case 'new-github-notification':
				$p = $notification->getSubjectParameters();
				$newNotifications = (int)($p['newNotifications'] ?? 0);
				$content = $l->n('You have %s new unread notification with recent activity on GitHub.', 'You have %s new unread notifications with recent activity on GitHub.', $newNotifications, [$newNotifications]);

				$notification->setParsedSubject($content)
					->setLink('https://github.com/notifications')
					->setIcon($this->urlGenerator->getAbsoluteURL($this->urlGenerator->imagePath(Application::APP_ID, 'app-dark.svg')));
				return $notification;

			default:
				throw new InvalidArgumentException();
		}
	}
}
