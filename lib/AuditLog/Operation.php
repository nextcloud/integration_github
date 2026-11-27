<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\AuditLog;

/**
 * Operations Forms writes to the admin audit log, in the form `app.entity.action`
 *
 * The values are matched by log consumers (filters, alert rules, SIEM imports),
 * so changing one is a breaking change for them. Case names may be renamed.
 */
enum Operation: string {
	case AccountConnected = 'integration_github.account.connected';
	case AccountDisconnected = 'integration_github.account.disconnected';
	case AdminConfigUpdated = 'integration_github.admin_config.updated';

}
