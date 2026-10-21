<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Unit\Migration;

use OCA\Github\AppInfo\Application;
use OCA\Github\Migration\Version030301Date20261021102507;
use OCP\IAppConfig;
use OCP\Migration\IOutput;
use PHPUnit\Framework\TestCase;

class Version030301Date20261021102507Test extends TestCase {

	public function testMarksExactlyTheLazyKeysLazy(): void {
		$marked = [];
		$appConfig = $this->createMock(IAppConfig::class);
		$appConfig->method('updateLazy')
			->willReturnCallback(static function (string $app, string $key, bool $lazy) use (&$marked): bool {
				$marked[] = [$app, $key, $lazy];
				return true;
			});

		$migration = new Version030301Date20261021102507($appConfig);
		$migration->postSchemaChange($this->createMock(IOutput::class), static fn () => null, []);

		// dashboard_enabled and issue_notifications_enabled are read on every request and stay non-lazy
		$this->assertEqualsCanonicalizing([
			[Application::APP_ID, 'client_id', true],
			[Application::APP_ID, 'client_secret', true],
			[Application::APP_ID, 'default_link_token', true],
			[Application::APP_ID, 'use_popup', true],
			[Application::APP_ID, 'link_preview_enabled', true],
			[Application::APP_ID, 'allow_default_link_token_to_anonymous', true],
			[Application::APP_ID, 'allow_default_link_token_to_guests', true],
			[Application::APP_ID, 'user_name', true],
			[Application::APP_ID, 'user_displayname', true],
		], $marked);
	}
}
