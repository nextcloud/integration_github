<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Unit\Migration;

use OCA\Github\AppInfo\Application;
use OCA\Github\Migration\Version030010Date20241002015812;
use OCP\DB\QueryBuilder\IExpressionBuilder;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IAppConfig;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Security\ICrypto;
use PHPUnit\Framework\TestCase;

class Version030010Date20241002015812Test extends TestCase {

	public function testEncryptsTheStoredCredentialsAsLazyValues(): void {
		$reads = [];
		$writes = [];
		// the default token was never set, so it is skipped
		$stored = ['client_id' => 'id', 'client_secret' => 'secret'];
		$appConfig = $this->createMock(IAppConfig::class);
		$appConfig->method('getValueString')
			->willReturnCallback(static function (string $app, string $key, string $default = '', bool $lazy = false) use (&$reads, $stored): string {
				$reads[$key][] = [$app, $default, $lazy];
				return $stored[$key] ?? $default;
			});
		$appConfig->method('setValueString')
			->willReturnCallback(static function (string $app, string $key, string $value, bool $lazy = false, bool $sensitive = false) use (&$writes): bool {
				$writes[] = [$app, $key, $value, $lazy, $sensitive];
				return true;
			});
		$crypto = $this->createMock(ICrypto::class);
		$crypto->method('encrypt')->willReturnCallback(static fn (string $value): string => 'encrypted:' . $value);

		// no user token to encrypt
		$queryBuilder = $this->createMock(IQueryBuilder::class);
		foreach (['update', 'set', 'where', 'andWhere', 'select', 'from'] as $method) {
			$queryBuilder->method($method)->willReturnSelf();
		}
		$queryBuilder->method('expr')->willReturn($this->createMock(IExpressionBuilder::class));
		$connection = $this->createMock(IDBConnection::class);
		$connection->method('getQueryBuilder')->willReturn($queryBuilder);

		$migration = new Version030010Date20241002015812($connection, $crypto, $appConfig);
		$migration->postSchemaChange($this->createMock(IOutput::class), static fn () => null, []);

		$this->assertSame([
			'client_id' => [[Application::APP_ID, '', true]],
			'client_secret' => [[Application::APP_ID, '', true]],
			'default_link_token' => [[Application::APP_ID, '', true]],
		], $reads);
		$this->assertSame([
			[Application::APP_ID, 'client_id', 'encrypted:id', true, false],
			[Application::APP_ID, 'client_secret', 'encrypted:secret', true, false],
		], $writes);
	}
}
