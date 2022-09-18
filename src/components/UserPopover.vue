<template>
	<NcPopover :focus-trap="false"
		:shown="shown">
		<div class="content">
			<div class="header">
				<NcAvatar
					class="tooltip-avatar"
					:is-no-user="true"
					:url="avatarUrl" />
				{{ userLogin }}
			</div>
			<div v-if="data" class="info">
				{{ data.name }}
				{{ data.location }}
			</div>
			<NcLoadingIcon v-else
				:title="t('integration_github', 'Loading data')" />
		</div>
		<template #trigger>
			<slot />
		</template>
	</NcPopover>
</template>

<script>
import NcPopover from '@nextcloud/vue/dist/Components/NcPopover.js'
import NcAvatar from '@nextcloud/vue/dist/Components/NcAvatar.js'
import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon.js'

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'

export default {
	name: 'UserPopover',

	components: {
		NcPopover,
		NcAvatar,
		NcLoadingIcon,
	},

	props: {
		userLogin: {
			type: String,
			required: true,
		},
		shown: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			data: null,
			loading: false,
		}
	},

	computed: {
		avatarUrl() {
			return generateUrl('/apps/integration_github/avatar?githubUserName={login}', { login: this.userLogin })
		},
	},

	watch: {
		shown(newValue) {
			if (newValue === true && this.data === null) {
				this.loading = true
				const url = generateUrl('/apps/integration_github/users/{login}', { login: this.userLogin })
				axios.get(url).then((response) => {
					console.debug('fffffffffffff', response.data)
					this.data = response.data
				}).catch((error) => {
					console.error(error)
				}).then(() => {
					this.loading = false
				})
			}
		},
	},

	mounted() {
	},

	methods: {
	},
}
</script>

<style scoped lang="scss">
// nothing
</style>
