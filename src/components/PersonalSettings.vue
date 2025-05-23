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
			<NcCheckboxRadioSwitch
				:disabled="!state.admin_issue_notifications_enabled"
				:checked="state.issue_notifications_enabled"
				@update:checked="onCheckboxChanged($event, 'issue_notifications_enabled')">
				{{ t('integration_github', 'Enable notifications for new unread GitHub notifications') }}
				<span v-if="!state.admin_issue_notifications_enabled" style="font-style: italic;">
					&nbsp;({{ t('integration_github', 'Disabled by administrator') }})
				</span>
			</NcCheckboxRadioSwitch>
			<NcNoteCard v-if="showOAuth && !connected" type="info">
				{{ t('integration_github', 'You can manually provide a personal access token or connect via OAuth ') }}
			</NcNoteCard>
			<NcNoteCard v-if="!connected" type="info">
				{{ t('integration_github', 'When you create a personal access token yourself, give it at least "read:user", "user:email" and "notifications" permissions.') }}
				<a href="https://github.com/settings/tokens" target="_blank" class="external">
					<span class="icon icon-external" />
					{{ t('integration_github', 'GitHub personal access tokens') }}
				</a>
			</NcNoteCard>
			<div v-if="!connected" class="line">
				<NcTextField
					id="github-token"
					class="input"
					:value.sync="state.token"
					type="password"
					:label="t('integration_github', 'Personal access token')"
					placeholder="..."
					:show-trailing-button="!!state.token"
					@keyup.enter="connectWithToken"
					@trailing-button-click="state.token = ''">
					<KeyIcon />
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
import NcNoteCard from '@nextcloud/vue/dist/Components/NcNoteCard.js'
import NcTextField from '@nextcloud/vue/dist/Components/NcTextField.js'

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
		NcNoteCard,
		NcTextField,
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
		display: flex;
		align-items: center;
		gap: 4px;
		> label {
			width: 300px;
			display: flex;
			align-items: center;
		}
		> input, > .input {
			width: 250px;
			margin: 0;
		}
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
