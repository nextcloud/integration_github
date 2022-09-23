<template>
	<div id="github_prefs" class="section">
		<h2>
			<GithubIcon class="icon" />
			{{ t('integration_github', 'GitHub integration') }}
		</h2>
		<p v-if="!showOAuth && !connected" class="settings-hint">
			{{ t('integration_github', 'When you create a personal access token yourself, give it at least "read:user", "user:email" and "notifications" permissions.') }}
			<a href="https://github.com/settings/tokens" target="_blank" class="external">
				<span class="icon icon-external" />
				{{ t('integration_github', 'GitHub personal access tokens') }}
			</a>
		</p>
		<div id="github-content">
			<NcCheckboxRadioSwitch
				:checked="state.navigation_enabled"
				@update:checked="onCheckboxChanged($event, 'navigation_enabled')">
				{{ t('integration_github', 'Enable navigation link') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:checked="state.link_preview_enabled"
				@update:checked="onCheckboxChanged($event, 'link_preview_enabled')">
				{{ t('integration_github', 'Enable GitHub link previews') }}
			</NcCheckboxRadioSwitch>
			<div v-show="!showOAuth"
				class="line">
				<label for="github-token">
					<KeyIcon :size="20" class="icon" />
					{{ t('integration_github', 'Personal access token') }}
				</label>
				<input id="github-token"
					v-model="state.token"
					type="password"
					:disabled="connected === true"
					:placeholder="t('integration_github', 'GitHub personal access token')"
					@keyup.enter="onConnectClick"
					@focus="readonly = false">
			</div>
			<NcButton v-if="!connected"
				:disabled="loading === true || (!showOAuth && !state.token)"
				:class="{ loading }"
				@click="onConnectClick">
				<template #icon>
					<OpenInNewIcon :size="20" />
				</template>
				{{ t('integration_github', 'Connect to GitHub') }}
			</NcButton>
			<div v-if="connected" class="line">
				<label>
					<CheckIcon :size="20" class="icon" />
					{{ t('integration_github', 'Connected as {user}', { user: connectedAs }) }}
				</label>
				<NcButton @click="onLogoutClick">
					<template #icon>
						<CloseIcon :size="20" />
					</template>
					{{ t('integration_github', 'Disconnect from GitHub') }}
				</NcButton>
				<span />
			</div>
			<br>
			<div v-if="connected" id="github-search-block">
				<NcCheckboxRadioSwitch
					:checked="state.search_repos_enabled"
					@update:checked="onCheckboxChanged($event, 'search_repos_enabled')">
					{{ t('integration_github', 'Enable searching for repositories') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch
					:checked="state.search_issues_enabled"
					@update:checked="onCheckboxChanged($event, 'search_issues_enabled')">
					{{ t('integration_github', 'Enable searching for issues and pull requests') }}
				</NcCheckboxRadioSwitch>
				<br>
				<p v-if="state.search_repos_enabled || state.search_issues_enabled" class="settings-hint">
					<InformationOutlineIcon :size="20" class="icon" />
					{{ t('integration_github', 'Warning, everything you type in the search bar will be sent to GitHub.') }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

import GithubIcon from './icons/GithubIcon.vue'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { showSuccess, showError } from '@nextcloud/dialogs'
import { oauthConnect } from '../utils.js'

export default {
	name: 'PersonalSettings',

	components: {
		GithubIcon,
		NcCheckboxRadioSwitch,
		NcButton,
		KeyIcon,
		CheckIcon,
		CloseIcon,
		InformationOutlineIcon,
		OpenInNewIcon,
	},

	props: [],

	data() {
		return {
			state: loadState('integration_github', 'user-config'),
			readonly: true,
			loading: false,
		}
	},

	computed: {
		showOAuth() {
			return this.state.client_id && this.state.client_secret
		},
		connected() {
			return this.state.token && this.state.token !== '' && this.state.user_name && this.state.user_name !== ''
		},
		connectedAs() {
			return this.state.user_displayname
				? this.state.user_displayname + ' (@' + this.state.user_name + ')'
				: '@' + this.state.user_name
		},
	},

	watch: {
	},

	mounted() {
		const paramString = window.location.search.slice(1)
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
		onCheckboxChanged(newValue, key) {
			this.state[key] = newValue
			this.saveOptions({ [key]: this.state[key] ? '1' : '0' })
		},
		saveOptions(values) {
			const req = {
				values,
			}
			const url = generateUrl('/apps/integration_github/config')
			axios.put(url, req).then((response) => {
				showSuccess(t('integration_github', 'GitHub options saved'))
				if (response.data.user_name !== undefined) {
					this.state.user_name = response.data.user_name
					this.state.user_displayname = response.data.user_displayname
					if (this.state.token && response.data.user_name === '') {
						showError(t('integration_github', 'Invalid access token'))
					}
				}
			}).catch((error) => {
				showError(
					t('integration_github', 'Failed to save GitHub options')
					+ ': ' + error.response?.request?.responseText
				)
			}).then(() => {
				this.loading = false
			})
		},
		onConnectClick() {
			if (this.showOAuth) {
				this.connectWithOauth()
			} else {
				this.connectWithToken()
			}
		},
		connectWithToken() {
			this.loading = true
			this.saveOptions({
				token: this.state.token,
			})
		},
		connectWithOauth() {
			if (this.state.use_popup) {
				oauthConnect(this.state.client_id, null, true)
					.then((data) => {
						this.state.token = 'dummyToken'
						this.state.user_name = data.userName
						this.state.user_displayname = data.userDisplayName
					})
			} else {
				oauthConnect(this.state.client_id, 'settings')
			}
		},
	},
}
</script>

<style scoped lang="scss">
#github_prefs {
	#github-content {
		margin-left: 40px;
	}
	h2,
	.line,
	.settings-hint {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 4px;
		}
	}

	h2 .icon {
		margin-right: 8px;
	}

	.line {
		> label {
			width: 300px;
			display: flex;
			align-items: center;
		}
		> input {
			width: 250px;
		}
	}
}
</style>
