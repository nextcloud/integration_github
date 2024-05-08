/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { loadState } from '@nextcloud/initial-state'

const state = loadState('integration_github', 'popup-data')
const userName = state.user_name
const userDisplayName = state.user_displayname

if (window.opener) {
	window.opener.postMessage({ userName, userDisplayName })
	window.close()
}
