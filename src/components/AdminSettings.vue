<template>
	<div id="github_prefs" class="section">
		<h2>
			<a class="icon icon-github" />
			{{ t('integration_github', 'Github integration') }}
		</h2>
		<p class="settings-hint">
			{{ t('integration_github', 'If you want to allow your Nextcloud users to use OAuth to authenticate to https://github.com, create an OAuth application in your Github settings.') }}
			(<a href="https://github.com/settings/developers" class="mylink">{{ t('integration_github', 'direct link to Github OAuth settings') }}</a>)
			<br>
			{{ t('integration_github', 'Make sure you set the "redirect_uri" to') }}
			<br>
			<b> {{ redirect_uri }} </b>
			<br>
			{{ t('integration_github', 'Then set the ID and secret below.') }}
		</p>
		<div class="grid-form">
			<label for="github-client-id">
				<a class="icon icon-category-auth" />
				{{ t('integration_github', 'Github application client ID') }}
			</label>
			<input id="github-client-id"
				v-model="state.client_id"
				type="password"
				:readonly="readonly"
				:placeholder="t('integration_github', 'Client ID or your Github application')"
				@focus="readonly = false"
				@input="onInput">
			<label for="github-client-secret">
				<a class="icon icon-category-auth" />
				{{ t('integration_github', 'Github application client secret') }}
			</label>
			<input id="github-client-secret"
				v-model="state.client_secret"
				type="password"
				:readonly="readonly"
				:placeholder="t('integration_github', 'Client secret or your Github application')"
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
			redirect_uri: OC.getProtocol() + '://' + OC.getHostName(),
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onInput() {
			const that = this
			delay(() => {
				that.saveOptions()
			}, 2000)()
		},
		saveOptions() {
			const req = {
				values: {
					client_id: this.state.client_id,
					client_secret: this.state.client_secret,
				},
			}
			const url = generateUrl('/apps/integration_github/admin-config')
			axios.put(url, req)
				.then((response) => {
					showSuccess(t('integration_github', 'Github admin options saved.'))
				})
				.catch((error) => {
					showError(
						t('integration_github', 'Failed to save Github admin options')
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
}
body.dark .icon-github {
	background-image: url(./../../img/app.svg);
}
.mylink {
	color: var(--color-main-text);

	&:hover,
	&:focus {
		border-bottom: 2px solid var(--color-text-maxcontrast);
	}
}
</style>
