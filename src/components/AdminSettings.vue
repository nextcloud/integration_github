<template>
	<div id="github_prefs" class="section">
		<h2>
			<a class="icon icon-github" />
			{{ t('integration_github', 'GitHub integration') }}
		</h2>
		<p class="settings-hint">
			{{ t('integration_github', 'If you want to allow your Nextcloud users to use OAuth to authenticate to https://github.com, create an OAuth application in your GitHub settings.') }}
			<a href="https://github.com/settings/developers" class="external">{{ t('integration_github', 'GitHub OAuth settings') }}</a>
			<br>
			{{ t('integration_github', 'Set "Application name", "Homepage URL" and "Application description" to values that will make sense to your Nextcloud users as they will see them when connecting to GitHub using your OAuth app.') }}
			<br><br>
			<span class="icon icon-details" />
			{{ t('integration_github', 'Make sure you set the "Authorization callback URL" to') }}
			<b> {{ redirect_uri }} </b>
			<br><br>
			{{ t('integration_github', 'Put the OAuth app "Client ID" and "Client secret" below.') }}
			{{ t('integration_github', 'Your Nextcloud users will then see a "Connect to GitHub" button in their personal settings.') }}
		</p>
		<div class="grid-form">
			<label for="github-client-id">
				<a class="icon icon-category-auth" />
				{{ t('integration_github', 'Client ID') }}
			</label>
			<input id="github-client-id"
				v-model="state.client_id"
				type="password"
				:readonly="readonly"
				:placeholder="t('integration_github', 'Client ID of your GitHub application')"
				@focus="readonly = false"
				@input="onInput">
			<label for="github-client-secret">
				<a class="icon icon-category-auth" />
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
	</div>
</template>

<script>
import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils'
import { showSuccess, showError } from '@nextcloud/dialogs'
import '@nextcloud/dialogs/styles/toast.scss'

export default {
	name: 'AdminSettings',

	components: {
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
		onInput() {
			delay(() => {
				this.saveOptions({ client_id: this.state.client_id, client_secret: this.state.client_secret })
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
.grid-form label {
	line-height: 38px;
}

.grid-form input {
	width: 100%;
}

.grid-form {
	max-width: 500px;
	display: grid;
	grid-template: 1fr / 1fr 1fr;
	margin-left: 30px;
}

#github_prefs .icon {
	display: inline-block;
	width: 32px;
}

#github_prefs .grid-form .icon {
	margin-bottom: -3px;
}

.icon-github {
	background-image: url(./../../img/app-dark.svg);
	background-size: 23px 23px;
	height: 23px;
	margin-bottom: -4px;
	filter: var(--background-invert-if-dark);
}

// for NC <= 24
body.theme--dark .icon-github {
	background-image: url(./../../img/app.svg);
}

</style>
