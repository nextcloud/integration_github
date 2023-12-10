<template>
	<div id="github_prefs" class="section">
		<NcButton @click="onTitleClick">
			<template #icon>
				<CreationIcon />
			</template>
			Populate field 1 or 2
		</NcButton>
		<div class="line">
			<label for="github-field1">
				{{ t('integration_github', 'Field 1') }}
			</label>
			<input id="github-field1"
				v-model="field1"
				type="text">
		</div>
		<div class="line">
			<label for="github-field2">
				{{ t('integration_github', 'Field 2') }}
			</label>
			<input id="github-field2"
				v-model="field2"
				type="text">
		</div>
		<br>
		<br>
		<p class="settings-hint">
			{{ t('integration_github', 'If you want to allow your Nextcloud users to use OAuth to authenticate to https://github.com, create an OAuth application in your GitHub settings.') }}
			<a href="https://github.com/settings/developers" class="external">{{ t('integration_github', 'GitHub OAuth settings') }}</a>
		</p>
		<p class="settings-hint">
			{{ t('integration_github', 'Set "Application name", "Homepage URL" and "Application description" to values that will make sense to your Nextcloud users as they will see them when connecting to GitHub using your OAuth app.') }}
		</p>
		<br>
		<p class="settings-hint">
			<InformationOutlineIcon :size="20" class="icon" />
			{{ t('integration_github', 'Make sure you set the "Authorization callback URL" to') }}
		</p>
		<strong>{{ redirect_uri }}</strong>
		<br><br>
		<p class="settings-hint">
			{{ t('integration_github', 'Put the OAuth app "Client ID" and "Client secret" below.') }}
		</p>
		<p class="settings-hint">
			{{ t('integration_github', 'Your Nextcloud users will then see a "Connect to GitHub" button in their personal settings.') }}
		</p>
		<div id="github-content">
			<div class="line">
				<label for="github-client-id">
					<KeyIcon :size="20" class="icon" />
					{{ t('integration_github', 'Client ID') }}
				</label>
				<input id="github-client-id"
					v-model="state.client_id"
					type="password"
					:readonly="readonly"
					:placeholder="t('integration_github', 'Client ID of your GitHub application')"
					@focus="readonly = false"
					@input="onInput">
			</div>
			<div class="line">
				<label for="github-client-secret">
					<KeyIcon :size="20" class="icon" />
					{{ t('integration_github', 'Client secret') }}
				</label>
				<input id="github-client-secret"
					v-model="state.client_secret"
					type="password"
					:readonly="readonly"
					:placeholder="t('integration_github', 'Client secret of your GitHub application')"
					@input="onInput"
					@focus="readonly = false">
			</div>
			<br>
			<p class="settings-hint">
				<AlertIcon :size="20" class="icon" />
				{{ t('integration_github', 'The default access token will be used for link previews and unified search by users who didn\'t connect to GitHub.') }}
			</p>
			<div class="line">
				<label for="github-link-token">
					<KeyIcon :size="20" class="icon" />
					{{ t('integration_github', 'Default access token') }}
				</label>
				<input id="github-link-token"
					v-model="state.default_link_token"
					type="password"
					:readonly="readonly"
					:placeholder="t('integration_github', 'personal access token')"
					@input="onInput"
					@focus="readonly = false">
			</div>
			<NcCheckboxRadioSwitch
				:checked="state.allow_default_link_token_to_anonymous"
				:disabled="!state.default_link_token"
				@update:checked="onCheckboxChanged($event, 'allow_default_link_token_to_anonymous')">
				{{ t('integration_github', 'Use default access token for anonymous users') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:checked="state.allow_default_link_token_to_guests"
				:disabled="!state.default_link_token"
				@update:checked="onCheckboxChanged($event, 'allow_default_link_token_to_guests')">
				{{ t('integration_github', 'Use default access token for guest users') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:checked="state.use_popup"
				@update:checked="onCheckboxChanged($event, 'use_popup')">
				{{ t('integration_github', 'Use a pop-up for OAuth authentication') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:checked="state.link_preview_enabled"
				@update:checked="onCheckboxChanged($event, 'link_preview_enabled')">
				{{ t('integration_github', 'Enable GitHub link previews') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:checked="state.dashboard_enabled"
				@update:checked="onCheckboxChanged($event, 'dashboard_enabled')">
				{{ t('integration_github', 'Enable GitHub dashboard widget') }}
			</NcCheckboxRadioSwitch>
		</div>
	</div>
</template>

<script>
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'
import AlertIcon from 'vue-material-design-icons/Alert.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'
import CreationIcon from 'vue-material-design-icons/Creation.vue'
import cogSvg from '@mdi/svg/svg/cog.svg'
import plusSvg from '@mdi/svg/svg/plus.svg'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'

import GithubIcon from './icons/GithubIcon.vue'

import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils.js'
import { showSuccess, showError } from '@nextcloud/dialogs'

import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

export default {
	name: 'AdminSettings',

	components: {
		GithubIcon,
		NcCheckboxRadioSwitch,
		KeyIcon,
		AlertIcon,
		InformationOutlineIcon,
		NcButton,
		CreationIcon,
	},

	props: [],

	data() {
		return {
			state: loadState('integration_github', 'admin-config'),
			// to prevent some browsers to fill fields with remembered passwords
			readonly: true,
			redirect_uri: window.location.protocol + '//' + window.location.host,
			field1: '',
			field2: '',
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onTitleClick() {
			const params = {
				appId: 'plopApp',
				identifier: 'idid',
				input: 'give me a short summary of a simple settings section about GitHub',
				actionButtons: [
					{
						label: 'Put in field 1',
						title: 'Title 1',
						type: 'warning',
						iconSvg: cogSvg,
						onClick: (task) => { this.field1 = task.output; console.debug('first button', task) },
					},
					{
						label: 'Put in field 2',
						title: 'Title 2',
						onClick: (task) => { this.field2 = task.output },
					},
				],
			}
			OCA.TPAssistant.openAssistantForm(params)
		},
		onCheckboxChanged(newValue, key) {
			this.state[key] = newValue
			this.saveOptions({ [key]: this.state[key] ? '1' : '0' })
		},
		onInput() {
			delay(() => {
				this.saveOptions({
					client_id: this.state.client_id,
					client_secret: this.state.client_secret,
					default_link_token: this.state.default_link_token,
				})
			}, 2000)()
		},
		saveOptions(values) {
			const req = {
				values,
			}
			const url = generateUrl('/apps/integration_github/admin-config')
			axios.put(url, req)
				.then((response) => {
					showSuccess(t('integration_github', 'GitHub admin options saved'))
				})
				.catch((error) => {
					showError(
						t('integration_github', 'Failed to save GitHub admin options')
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

	.settings-hint {
		margin-top: 2000px;
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
			width: 300px;
		}
	}
}
</style>
