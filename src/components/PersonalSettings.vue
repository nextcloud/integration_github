<template>
	<div id="github_prefs" class="section">
		<h2>
			<a class="icon icon-github-settings" />
			{{ t('integration_github', 'GitHub integration') }}
		</h2>
		<p v-if="!showOAuth && !connected" class="settings-hint">
			{{ t('integration_github', 'When you create a personal access token yourself, give it at least "read:user", "user:email" and "notifications" permissions.') }}
		</p>
		<div id="github-content">
			<div class="github-grid-form">
				<label v-show="!showOAuth"
					for="github-token">
					<a class="icon icon-category-auth" />
					{{ t('integration_github', 'Personal access token') }}
				</label>
				<input v-show="!showOAuth"
					id="github-token"
					v-model="state.token"
					type="password"
					:disabled="connected === true"
					:placeholder="t('integration_github', 'GitHub personal access token')"
					@input="onInput"
					@focus="readonly = false">
			</div>
			<button v-if="showOAuth && !connected" id="github-oauth" @click="onOAuthClick">
				<span class="icon icon-external" />
				{{ t('integration_github', 'Connect to GitHub') }}
			</button>
			<div v-if="connected" class="github-grid-form">
				<label class="github-connected">
					<a class="icon icon-checkmark-color" />
					{{ t('integration_github', 'Connected as {user}', { user: state.user_name }) }}
				</label>
				<button id="github-rm-cred" @click="onLogoutClick">
					<span class="icon icon-close" />
					{{ t('integration_github', 'Disconnect from GitHub') }}
				</button>
				<span />
			</div>
			<br>
			<div v-if="connected" id="github-search-block">
				<input
					id="search-github-repos"
					type="checkbox"
					class="checkbox"
					:checked="state.search_repos_enabled"
					@input="onSearchReposChange">
				<label for="search-github-repos">{{ t('integration_github', 'Enable searching for repositories') }}</label>
				<br><br>
				<input
					id="search-github-issues"
					type="checkbox"
					class="checkbox"
					:checked="state.search_issues_enabled"
					@input="onSearchIssuesChange">
				<label for="search-github-issues">{{ t('integration_github', 'Enable searching for issues and pull requests') }}</label>
				<br><br>
				<p v-if="state.search_repos_enabled || state.search_issues_enabled" class="settings-hint">
					<span class="icon icon-details" />
					{{ t('integration_github', 'Warning, everything you type in the search bar will be sent to GitHub.') }}
				</p>
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
			redirect_uri: window.location.protocol + '//' + window.location.host + generateUrl('/apps/integration_github/oauth-redirect'),
		}
	},

	computed: {
		showOAuth() {
			return this.state.client_id && this.state.client_secret
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
			showSuccess(t('integration_github', 'Connected to GitHub!'))
		} else if (ghToken === 'error') {
			showError(t('integration_github', 'GitHub OAuth error:') + ' ' + urlParams.get('message'))
		}
	},

	methods: {
		onLogoutClick() {
			this.state.token = ''
			this.saveOptions({ token: this.state.token })
		},
		onSearchIssuesChange(e) {
			this.state.search_issues_enabled = e.target.checked
			this.saveOptions({ search_issues_enabled: this.state.search_issues_enabled ? '1' : '0' })
		},
		onSearchReposChange(e) {
			this.state.search_repos_enabled = e.target.checked
			this.saveOptions({ search_repos_enabled: this.state.search_repos_enabled ? '1' : '0' })
		},
		onInput() {
			delay(() => {
				this.saveOptions({ token: this.state.token })
			}, 2000)()
		},
		saveOptions(values) {
			const req = {
				values,
			}
			const url = generateUrl('/apps/integration_github/config')
			axios.put(url, req)
				.then((response) => {
					showSuccess(t('integration_github', 'GitHub options saved'))
					if (response.data.user_name !== undefined) {
						this.state.user_name = response.data.user_name
						if (this.state.token && response.data.user_name === '') {
							showError(t('integration_github', 'Incorrect access token'))
						}
					}
				})
				.catch((error) => {
					showError(
						t('integration_github', 'Failed to save GitHub options')
						+ ': ' + error.response?.request?.responseText
					)
				})
				.then(() => {
				})
		},
		onOAuthClick() {
			const oauthState = Math.random().toString(36).substring(3)
			const requestUrl = 'https://github.com/login/oauth/authorize'
				+ '?client_id=' + encodeURIComponent(this.state.client_id)
				+ '&redirect_uri=' + encodeURIComponent(this.redirect_uri)
				+ '&state=' + encodeURIComponent(oauthState)
				+ '&scope=' + encodeURIComponent('user repo notifications')

			const req = {
				values: {
					oauth_state: oauthState,
					redirect_uri: this.redirect_uri,
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
						+ ': ' + error.response?.request?.responseText
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
	max-width: 600px;
	display: grid;
	grid-template: 1fr / 1fr 1fr;
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

#github-search-block .icon {
	width: 22px;
}

</style>
