<?php
/**
 * @copyright Copyright (c) 2020 Julien Veyssier <julien-nc@posteo.net>
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
 *
 */

namespace OCA\Github\Dashboard;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCP\AppFramework\Services\IInitialState;
use OCP\Dashboard\IAPIWidget;
use OCP\Dashboard\IButtonWidget;
use OCP\Dashboard\IIconWidget;
use OCP\Dashboard\IOptionWidget;
use OCP\Dashboard\Model\WidgetButton;
use OCP\Dashboard\Model\WidgetOptions;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IURLGenerator;

use OCP\Util;

class GithubWidget implements IAPIWidget, IButtonWidget, IIconWidget, IOptionWidget {

	public function __construct(private IL10N $l10n,
		private IConfig $config,
		private IURLGenerator $urlGenerator,
		private IInitialState $initialStateService,
		private GithubAPIService $githubAPIService,
		private ?string $userId) {
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'github_notifications';
	}

	/**
	 * @inheritDoc
	 */
	public function getTitle(): string {
		return $this->l10n->t('GitHub notifications');
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
	public function getIconClass(): string {
		return 'icon-github';
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
	public function getUrl(): ?string {
		return $this->urlGenerator->linkToRouteAbsolute('settings.PersonalSettings.index', ['section' => 'connected-accounts']);
	}

	/**
	 * @inheritDoc
	 */
	public function load(): void {
		$clientID = $this->config->getAppValue(Application::APP_ID, 'client_id');
		$clientSecret = $this->config->getAppValue(Application::APP_ID, 'client_secret');
		$oauthPossible = $clientID !== '' && $clientSecret !== '';
		$usePopup = $this->config->getAppValue(Application::APP_ID, 'use_popup', '0');

		$userConfig = [
			'oauth_is_possible' => $oauthPossible,
			'client_id' => $clientID,
			'use_popup' => ($usePopup === '1'),
		];
		$this->initialStateService->provideInitialState('user-config', $userConfig);
		Util::addScript(Application::APP_ID, 'integration_github-dashboard');
		Util::addStyle(Application::APP_ID, 'dashboard');
	}

	/**
	 * @inheritDoc
	 */
	public function getItems(string $userId, ?string $since = null, int $limit = 7): array {
		$notifications = $this->githubAPIService->getNotifications($this->userId, null, $since, $limit);
		if (isset($notifications['error'])) {
			return [];
		}
		$that = $this;
		return array_map(static function (array $notification) use ($that) {
			return $that->githubAPIService->getWidgetFromNotification($notification);
		}, $notifications);
	}

	/**
	 * @inheritDoc
	 */
	public function getWidgetButtons(string $userId): array {
		return [
			new WidgetButton(
				WidgetButton::TYPE_MORE,
				'https://github.com/notifications',
				$this->l10n->t('More notifications')
			),
		];
	}

	/**
	 * @inheritDoc
	 */
	public function getWidgetOptions(): WidgetOptions {
		return new WidgetOptions(true);
	}
}
