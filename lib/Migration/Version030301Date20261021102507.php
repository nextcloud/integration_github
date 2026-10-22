<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Migration;

use Closure;
use OCA\Github\AppInfo\Application;
use OCP\DB\ISchemaWrapper;
use OCP\IAppConfig;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version030301Date20261021102507 extends SimpleMigrationStep {

	/**
	 * The app config keys that are only read by the app's own pages, settings, providers,
	 * OAuth flow and API requests. dashboard_enabled and issue_notifications_enabled are
	 * read on every request in Application::register() and stay non-lazy.
	 */
	private const LAZY_APP_CONFIG_KEYS = [
		'client_id',
		'client_secret',
		'default_link_token',
		'use_popup',
		'link_preview_enabled',
		'allow_default_link_token_to_anonymous',
		'allow_default_link_token_to_guests',
		'user_name',
		'user_displayname',
	];

	public function __construct(
		private IAppConfig $appConfig,
	) {
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 *
	 * @return null|ISchemaWrapper
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
		// mark the values stored as non-lazy by earlier versions as lazy
		foreach (self::LAZY_APP_CONFIG_KEYS as $key) {
			$this->appConfig->updateLazy(Application::APP_ID, $key, true);
		}

		return null;
	}
}
