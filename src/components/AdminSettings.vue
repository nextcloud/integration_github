<template>
	<div id="github_prefs" class="section">
		<h2>
			<GithubIcon class="icon" />
			{{ t('integration_github', 'GitHub integration') }}
		</h2>
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
			<NcCheckboxRadioSwitch
				:checked="state.use_popup"
				@update:checked="onCheckboxChanged($event, 'use_popup')">
				{{ t('integration_github', 'Use a popup to authenticate') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:checked="state.link_preview_enabled"
				@update:checked="onCheckboxChanged($event, 'link_preview_enabled')">
				{{ t('integration_github', 'Enable GitHub link previews in Talk') }}
			</NcCheckboxRadioSwitch>
		</div>
	</div>
</template>

<script>
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'

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
		InformationOutlineIcon,
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

	watch: {
	},

	mounted() {
	},

	methods: {
		onCheckboxChanged(newValue, key) {
			this.state[key] = newValue
			this.saveOptions({ [key]: this.state[key] ? '1' : '0' })
		},
		onInput() {
			delay(() => {
				this.saveOptions({
					client_id: this.state.client_id,
					client_secret: this.state.client_secret,
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
