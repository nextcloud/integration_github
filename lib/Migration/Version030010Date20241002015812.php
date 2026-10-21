<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Github\Migration;

use Closure;
use OCA\Github\AppInfo\Application;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IAppConfig;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;
use OCP\Security\ICrypto;

class Version030010Date20241002015812 extends SimpleMigrationStep {

	public function __construct(
		private IDBConnection $connection,
		private ICrypto $crypto,
		private IAppConfig $appConfig,
	) {
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
		// client_id, client_secret, default_link_token
		foreach (['client_id', 'client_secret', 'default_link_token'] as $key) {
			$value = $this->appConfig->getValueString(Application::APP_ID, $key, lazy: true);
			if ($value !== '') {
				$encryptedValue = $this->crypto->encrypt($value);
				$this->appConfig->setValueString(Application::APP_ID, $key, $encryptedValue, lazy: true);
			}
		}

		// user tokens
		$qbUpdate = $this->connection->getQueryBuilder();
		$qbUpdate->update('preferences')
			->set('configvalue', $qbUpdate->createParameter('updateValue'))
			->where(
				$qbUpdate->expr()->eq('appid', $qbUpdate->createNamedParameter(Application::APP_ID, IQueryBuilder::PARAM_STR))
			)
			->andWhere(
				$qbUpdate->expr()->eq('userid', $qbUpdate->createParameter('updateUserId'))
			)
			->andWhere(
				$qbUpdate->expr()->eq('configkey', $qbUpdate->createNamedParameter('token', IQueryBuilder::PARAM_STR))
			);

		$qbSelect = $this->connection->getQueryBuilder();
		$qbSelect->select('userid', 'configvalue')
			->from('preferences')
			->where(
				$qbSelect->expr()->eq('appid', $qbSelect->createNamedParameter(Application::APP_ID, IQueryBuilder::PARAM_STR))
			)
			->andWhere(
				$qbSelect->expr()->eq('configkey', $qbSelect->createNamedParameter('token', IQueryBuilder::PARAM_STR))
			)
			->andWhere(
				$qbSelect->expr()->nonEmptyString('configvalue')
			)
			->andWhere(
				$qbSelect->expr()->isNotNull('configvalue')
			);
		$req = $qbSelect->executeQuery();
		while ($row = $req->fetch()) {
			$userId = $row['userid'];
			$storedClearToken = $row['configvalue'];
			$encryptedToken = $this->crypto->encrypt($storedClearToken);
			$qbUpdate->setParameter('updateValue', $encryptedToken, IQueryBuilder::PARAM_STR);
			$qbUpdate->setParameter('updateUserId', $userId, IQueryBuilder::PARAM_STR);
			$qbUpdate->executeStatement();
		}
		$req->closeCursor();
	}
}
