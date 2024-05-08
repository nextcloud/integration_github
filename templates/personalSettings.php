<?php
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
$appId = OCA\Github\AppInfo\Application::APP_ID;
\OCP\Util::addScript($appId, $appId . '-personalSettings');
?>

<div id="github_prefs"></div>
