<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div id="github_prefs" class="section">
		<h2>
			<GithubIcon class="icon" />
			{{ t('integration_github', 'GitHub integration') }}
		</h2>
		<div id="github-content">
			<NcFormBox>
				<NcFormBoxSwitch
					:model-value="state.navigation_enabled"
					@update:model-value="onCheckboxChanged($event, 'navigation_enabled')">
					{{ t('integration_github', 'Enable navigation link') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:model-value="state.link_preview_enabled"
					@update:model-value="onCheckboxChanged($event, 'link_preview_enabled')">
					{{ t('integration_github', 'Enable GitHub link previews') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:disabled="!state.admin_issue_notifications_enabled"
					:model-value="state.issue_notifications_enabled"
					@update:model-value="onCheckboxChanged($event, 'issue_notifications_enabled')">
					{{ t('integration_github', 'Enable notifications for new unread GitHub notifications') }}
					<span v-if="!state.admin_issue_notifications_enabled" style="font-style: italic;">
						&nbsp;({{ t('integration_github', 'Disabled by administrator') }})
					</span>
				</NcFormBoxSwitch>
			</NcFormBox>
			<NcNoteCard v-if="showOAuth && !connected" type="info">
				{{ t('integration_github', 'You can manually provide a personal access token or connect via OAuth ') }}
			</NcNoteCard>
			<NcNoteCard v-if="!connected" type="info">
				{{ t('integration_github', 'When you create a personal access token yourself, give it at least "read:user", "user:email" and "notifications" permissions.') }}
				<a href="https://github.com/settings/tokens" target="_blank" class="external">
					{{ t('integration_github', 'GitHub personal access tokens') }}
					<OpenInNewIcon :size="20" />
				</a>
			</NcNoteCard>
			<div v-if="!connected" class="column">
				<NcTextField
					id="github-token"
					v-model="state.token"
					class="input"
					type="password"
					:label="t('integration_github', 'Personal access token')"
					placeholder="..."
					:show-trailing-button="!!state.token"
					@keyup.enter="connectWithToken"
					@trailing-button-click="state.token = ''">
					<template #icon>
						<KeyIcon :size="20" />
					</template>
				</NcTextField>
				<NcButton v-if="!connected"
					:disabled="loading || state.token === ''"
					:class="{ loading }"
					@click="connectWithToken">
					<template #icon>
						<OpenInNewIcon :size="20" />
					</template>
					{{ t('integration_github', 'Connect to GitHub with a personal token') }}
				</NcButton>
			</div>
			<NcButton v-if="showOAuth && !connected"
				:disabled="loading || state.token !== ''"
				:class="{ loading, connectButton: true }"
				@click="connectWithOauth">
				<template #icon>
					<OpenInNewIcon :size="20" />
				</template>
				{{ t('integration_github', 'Connect to GitHub with OAuth') }}
			</NcButton>
			<br>
			<div v-if="connected" class="column">
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
			</div>
			<br>
			<div v-if="connected" id="github-search-block">
				<NcFormBox>
					<NcFormBoxSwitch
						:model-value="state.search_repos_enabled"
						@update:model-value="onCheckboxChanged($event, 'search_repos_enabled')">
						{{ t('integration_github', 'Enable searching for repositories') }}
					</NcFormBoxSwitch>
					<NcFormBoxSwitch
						:model-value="state.search_issues_enabled"
						@update:model-value="onCheckboxChanged($event, 'search_issues_enabled')">
						{{ t('integration_github', 'Enable searching for issues and pull requests') }}
					</NcFormBoxSwitch>
				</NcFormBox>
				<NcNoteCard v-if="state.search_repos_enabled || state.search_issues_enabled"
					type="warning">
					{{ t('integration_github', 'Warning, everything you type in the search bar will be sent to GitHub.') }}
				</NcNoteCard>
			</div>
		</div>
	</div>
</template>

<script>
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

import GithubIcon from './icons/GithubIcon.vue'

import NcButton from '@nextcloud/vue/components/NcButton'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxSwitch from '@nextcloud/vue/components/NcFormBoxSwitch'

import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { showSuccess, showError } from '@nextcloud/dialogs'
import { oauthConnect } from '../utils.js'

export default {
	name: 'PersonalSettings',

	components: {
		GithubIcon,
		NcButton,
		NcNoteCard,
		NcTextField,
		NcFormBox,
		NcFormBoxSwitch,
		KeyIcon,
		CheckIcon,
		CloseIcon,
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
					+ ': ' + error.response?.request?.responseText,
				)
			}).then(() => {
				this.loading = false
			})
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
		max-width: 800px;
	}
	h2 {
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 4px;
	}

	h2 .icon {
		margin-right: 8px;
	}

	a.external {
		display: flex;
		gap: 4px;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 8px;
		label {
			display: flex;
			align-items: center;
		}
	}

	.connectButton {
		margin-top: 12px;
	}
}
</style>
