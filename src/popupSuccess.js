import { loadState } from '@nextcloud/initial-state'

const state = loadState('integration_github', 'popup-data')
const userName = state.user_name
const userDisplayName = state.user_displayname

if (window.opener) {
	window.opener.postMessage({ userName, userDisplayName })
	window.close()
}
