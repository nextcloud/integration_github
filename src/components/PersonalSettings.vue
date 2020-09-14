<template>
	<div id="github_prefs" class="section">
		<h2>
			<a class="icon icon-github-settings" />
			{{ t('integration_github', 'GitHub integration') }}
		</h2>
		<p class="settings-hint">
			{{ t('integration_github', 'When you create a personal access token yourself, give it at least "read:user", "user:email" and "notifications" permissions.') }}
		</p>
		<div id="github-content">
			<div class="github-grid-form">
				<label for="github-token">
					<a class="icon icon-category-auth" />
					{{ t('integration_github', 'GitHub access token') }}
				</label>
				<input id="github-token"
					v-model="state.token"
					type="password"
					:disabled="connected === true"
					:placeholder="t('integration_github', 'Get a token in GitHub settings')"
					@input="onInput"
					@focus="readonly = false">
				<button v-if="showOAuth" id="github-oauth" @click="onOAuthClick">
					<span class="icon icon-external" />
					{{ t('integration_github', 'Get access with OAuth') }}
				</button>
				<span v-else />
			</div>
			<div v-if="connected" class="github-grid-form">
				<label class="github-connected">
					{{ t('integration_github', 'Connected as {user}', { user: state.user_name }) }}
				</label>
				<button id="github-rm-cred" @click="onLogoutClick">
					<span class="icon icon-close" />
					{{ t('integration_github', 'Disconnect from Github') }}
				</button>
				<span />
			</div>
			<br>
			<div id="github-search-block">
				<input
					id="search-github"
					type="checkbox"
					class="checkbox"
					:checked="state.search_enabled"
					@input="onSearchChange">
				<label for="search-github">{{ t('integration_github', 'Enable searching for repositories, issues and pull requests.') }}</label>
			</div>
		</div>
	</div>
</template>

<script>
import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils'
import { showSuccess, showError } from '@nextcloud/dialogs'

export default {
	name: 'PersonalSettings',

	components: {
	},

	props: [],

	data() {
		return {
			state: loadState('integration_github', 'user-config'),
			readonly: true,
		}
	},

	computed: {
		showOAuth() {
			return this.state.client_id && this.state.client_secret && !this.connected
		},
		connected() {
			return this.state.token && this.state.token !== '' && this.state.user_name && this.state.user_name !== ''
		},
	},

	watch: {
	},

	mounted() {
		const paramString = window.location.search.substr(1)
		// eslint-disable-next-line
		const urlParams = new URLSearchParams(paramString)
		const ghToken = urlParams.get('githubToken')
		if (ghToken === 'success') {
			showSuccess(t('integration_github', 'GitHub OAuth access token successfully retrieved!'))
		} else if (ghToken === 'error') {
			showError(t('integration_github', 'GitHub OAuth error:') + ' ' + urlParams.get('message'))
		}
	},

	methods: {
		onLogoutClick() {
			this.state.token = ''
			this.saveOptions()
		},
		onSearchChange(e) {
			this.state.search_enabled = e.target.checked
			this.saveOptions()
		},
		onInput() {
			delay(() => {
				this.saveOptions()
			}, 2000)()
		},
		saveOptions() {
			const req = {
				values: {
					token: this.state.token,
					search_enabled: this.state.search_enabled ? '1' : '0',
				},
			}
			const url = generateUrl('/apps/integration_github/config')
			axios.put(url, req)
				.then((response) => {
					showSuccess(t('integration_github', 'GitHub options saved.'))
					if (response.data.user_name !== undefined) {
						this.state.user_name = response.data.user_name
						if (response.data.user_name === '') {
							showError(t('integration_github', 'Incorrect access token'))
						}
					}
				})
				.catch((error) => {
					showError(
						t('integration_github', 'Failed to save GitHub options')
						+ ': ' + error.response.request.responseText
					)
				})
				.then(() => {
				})
		},
		onOAuthClick() {
			const redirectEndpoint = generateUrl('/apps/integration_github/oauth-redirect')
			const redirectUri = window.location.protocol + '//' + window.location.host + redirectEndpoint
			const oauthState = Math.random().toString(36).substring(3)
			const requestUrl = 'https://github.com/login/oauth/authorize?client_id='
				+ encodeURIComponent(this.state.client_id)
				+ '&redirect_uri=' + encodeURIComponent(redirectUri)
				+ '&state=' + encodeURIComponent(oauthState)
				+ '&scope=' + encodeURIComponent('user repo notifications')

			const req = {
				values: {
					oauth_state: oauthState,
				},
			}
			const url = generateUrl('/apps/integration_github/config')
			axios.put(url, req)
				.then((response) => {
					window.location.replace(requestUrl)
				})
				.catch((error) => {
					showError(
						t('integration_github', 'Failed to save GitHub OAuth state')
						+ ': ' + error.response.request.responseText
					)
				})
				.then(() => {
				})
		},
	},
}
</script>

<style scoped lang="scss">
.github-grid-form label {
	line-height: 38px;
}
.github-grid-form input {
	width: 100%;
}
.github-grid-form {
	max-width: 900px;
	display: grid;
	grid-template: 1fr / 1fr 1fr 1fr;
	button .icon {
		margin-bottom: -1px;
	}
}
#github_prefs .icon {
	display: inline-block;
	width: 32px;
}
#github_prefs .grid-form .icon {
	margin-bottom: -3px;
}
.icon-github-settings {
	background-image: url('./../../img/app-dark.svg');
	background-size: 23px 23px;
	height: 23px;
	margin-bottom: -4px;
}

body.theme--dark .icon-github-settings {
	background-image: url('./../../img/app.svg');
}
#github-content {
	margin-left: 40px;
}
.github-connected {
	margin-left: 35px;
}
</style>
