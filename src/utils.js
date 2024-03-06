import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'

let mytimer = 0
export function delay(callback, ms) {
	return function() {
		const context = this
		const args = arguments
		clearTimeout(mytimer)
		mytimer = setTimeout(function() {
			callback.apply(context, args)
		}, ms || 0)
	}
}

export function oauthConnect(clientId, oauthOrigin, usePopup = false) {
	const redirectUri = window.location.protocol + '//' + window.location.host + generateUrl('/apps/integration_github/oauth-redirect')

	const oauthState = Math.random().toString(36).substring(3)
	const requestUrl = 'https://github.com/login/oauth/authorize'
		+ '?client_id=' + encodeURIComponent(clientId)
		+ '&redirect_uri=' + encodeURIComponent(redirectUri)
		+ '&state=' + encodeURIComponent(oauthState)
		+ '&scope=' + encodeURIComponent('read:user user:email repo notifications')

	const req = {
		values: {
			oauth_state: oauthState,
			redirect_uri: redirectUri,
			oauth_origin: usePopup ? undefined : oauthOrigin,
		},
	}
	const url = generateUrl('/apps/integration_github/config')
	return new Promise((resolve, reject) => {
		axios.put(url, req).then((response) => {
			if (usePopup) {
				const ssoWindow = window.open(
					requestUrl,
					t('integration_github', 'Connect to GitHub'),
					'toolbar=no, menubar=no, width=600, height=700')
				ssoWindow.focus()
				window.addEventListener('message', (event) => {
					console.debug('Child window message received', event)
					resolve(event.data)
				})
			} else {
				window.location.replace(requestUrl)
			}
		}).catch((error) => {
			showError(
				t('integration_github', 'Failed to save GitHub OAuth state')
				+ ': ' + (error.response?.request?.responseText ?? ''),
			)
			console.error(error)
		})
	})
}

export function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		}
		: null
}

export function isDarkMode() {
	const bodyDataTheme = document.body.getAttribute('data-themes')
	return bodyDataTheme.startsWith('light')
		? false
		: bodyDataTheme.startsWith('dark')
			? true
			: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
}
