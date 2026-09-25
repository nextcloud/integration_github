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
			<NcNoteCard type="info">
				{{ t('integration_github', 'If you want to allow your Nextcloud users to use OAuth to authenticate to {githubUrl}, create an OAuth application in your GitHub settings.', { githubUrl: 'https://github.com' }) }}
				<br>
				<a href="https://github.com/settings/developers" class="external" target="_blank">
					{{ t('integration_github', 'GitHub OAuth settings') }}
				</a>
				<br>
				{{ t('integration_github', 'Set "Application name", "Homepage URL" and "Application description" to values that will make sense to your Nextcloud users as they will see them when connecting to GitHub using your OAuth app.') }}
				<br>
				{{ t('integration_github', 'Make sure you set the "Authorization callback URL" to') }}
				<br>
				<strong>{{ redirect_uri }}</strong>
				<br>
				{{ t('integration_github', 'Put the OAuth app "Client ID" and "Client secret" below.') }}
				{{ t('integration_github', 'Your Nextcloud users will then see a "Connect to GitHub" button in their personal settings.') }}
			</NcNoteCard>
			<NcTextField
				v-model="state.client_id"
				class="input"
				type="password"
				:label="t('integration_github', 'Client ID')"
				:placeholder="t('integration_github', 'Client ID of your GitHub application')"
				:readonly="readonly"
				:showTrailingButton="!!state.client_id"
				@trailingButtonClick="state.client_id = ''"
				@focus="readonly = false"
				@update:modelValue="onInput">
				<template #icon>
					<KeyOutlineIcon :size="20" />
				</template>
			</NcTextField>
			<NcTextField
				v-model="state.client_secret"
				class="input"
				type="password"
				:label="t('integration_github', 'Client secret')"
				:placeholder="t('integration_github', 'Client secret of your GitHub application')"
				:readonly="readonly"
				:showTrailingButton="!!state.client_secret"
				@trailingButtonClick="state.client_secret = ''"
				@focus="readonly = false"
				@update:modelValue="onInput">
				<template #icon>
					<KeyOutlineIcon :size="20" />
				</template>
			</NcTextField>
			<br>
			<NcNoteCard type="warning">
				{{ t('integration_github', 'The default access token will be used for link previews and unified search by users who didn\'t connect to GitHub.') }}
			</NcNoteCard>
			<NcTextField
				v-model="state.default_link_token"
				class="input"
				type="password"
				:label="t('integration_github', 'Default access token')"
				:placeholder="t('integration_github', 'personal access token')"
				:readonly="readonly"
				:showTrailingButton="!!state.default_link_token"
				@trailingButtonClick="state.default_link_token = ''"
				@focus="readonly = false"
				@update:modelValue="onInput">
				<template #icon>
					<KeyOutlineIcon :size="20" />
				</template>
			</NcTextField>
			<div v-if="defaultTokenConnected" class="line">
				<label style="width: 100%; margin-top: 0.5em;">
					<CheckIcon :size="20" class="icon" />
					{{ t('integration_github', 'Connected with the default access token as {user}', { user: connectedAs }) }}
				</label>
			</div>
			<br>
			<NcFormBox>
				<NcFormBoxSwitch :modelValue="state.allow_default_link_token_to_anonymous"
					:disabled="!state.default_link_token"
					@update:modelValue="onCheckboxChanged($event, 'allow_default_link_token_to_anonymous')">
					{{ t('integration_github', 'Use default access token for anonymous users') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:modelValue="state.allow_default_link_token_to_guests"
					:disabled="!state.default_link_token"
					@update:modelValue="onCheckboxChanged($event, 'allow_default_link_token_to_guests')">
					{{ t('integration_github', 'Use default access token for guest users') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:modelValue="state.use_popup"
					@update:modelValue="onCheckboxChanged($event, 'use_popup')">
					{{ t('integration_github', 'Use a pop-up for OAuth authentication') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:modelValue="state.link_preview_enabled"
					@update:modelValue="onCheckboxChanged($event, 'link_preview_enabled')">
					{{ t('integration_github', 'Enable GitHub link previews') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:modelValue="state.dashboard_enabled"
					@update:modelValue="onCheckboxChanged($event, 'dashboard_enabled')">
					{{ t('integration_github', 'Enable GitHub dashboard widget') }}
				</NcFormBoxSwitch>
				<NcFormBoxSwitch
					:modelValue="state.issue_notifications_enabled"
					@update:modelValue="onCheckboxChanged($event, 'issue_notifications_enabled')">
					{{ t('integration_github', 'Enable notifications for new unread GitHub notifications') }}
				</NcFormBoxSwitch>
			</NcFormBox>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { confirmPassword } from '@nextcloud/password-confirmation'
import { generateUrl } from '@nextcloud/router'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxSwitch from '@nextcloud/vue/components/NcFormBoxSwitch'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import KeyOutlineIcon from 'vue-material-design-icons/KeyOutline.vue'
import GithubIcon from './icons/GithubIcon.vue'
import { delay } from '../utils.js'

export default {
	name: 'AdminSettings',

	components: {
		GithubIcon,
		NcTextField,
		NcNoteCard,
		NcFormBox,
		NcFormBoxSwitch,
		KeyOutlineIcon,
		CheckIcon,
	},

	props: [],

	data() {
		return {
			state: loadState('integration_github', 'admin-config'),
			// to prevent some browsers to fill fields with remembered passwords
			readonly: true,
			redirect_uri: window.location.protocol + '//' + window.location.host,
		}
	},

	computed: {
		defaultTokenConnected() {
			return this.state.default_link_token && this.state.default_link_token !== '' && this.state.user_name && this.state.user_name !== ''
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
	},

	methods: {
		onCheckboxChanged(newValue, key) {
			this.state[key] = newValue
			this.saveOptions({ [key]: this.state[key] ? '1' : '0' }, false)
		},

		onInput() {
			delay(() => {
				const values = {
					client_id: this.state.client_id,
				}
				if (this.state.client_secret !== 'dummyClientSecret') {
					values.client_secret = this.state.client_secret
				}
				if (this.state.default_link_token !== 'dummyToken') {
					values.default_link_token = this.state.default_link_token
				}
				this.saveOptions(values, true)
			}, 2000)()
		},

		async saveOptions(values, sensitive = false) {
			if (sensitive) {
				await confirmPassword()
			}
			const req = {
				values,
			}
			const url = sensitive
				? generateUrl('/apps/integration_github/sensitive-admin-config')
				: generateUrl('/apps/integration_github/admin-config')
			axios.put(url, req)
				.then((response) => {
					showSuccess(t('integration_github', 'GitHub admin options saved'))
					if (response.data.user_name !== undefined) {
						this.state.user_name = response.data.user_name
						this.state.user_displayname = response.data.user_displayname
					}
				})
				.catch((error) => {
					showError(t('integration_github', 'Failed to save GitHub admin options')
						+ ': ' + error.response?.request?.responseText)
				})
				.then(() => {
				})
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
		justify-content: start;
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

	.input {
		width: 100%;
	}

	.line {
		> label {
			width: 300px;
			display: flex;
			align-items: center;
		}
		> input {
			width: 300px;
		}
	}
}
</style>
