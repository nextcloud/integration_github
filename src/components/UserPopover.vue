<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcPopover noFocusTrap
		placement="top"
		:shown="shown">
		<div class="user-popover-content">
			<div class="header">
				<NcAvatar
					class="tooltip-avatar"
					:isNoUser="true"
					:url="avatarUrl" />
				{{ userLogin }}
			</div>
			<NcLoadingIcon v-if="loading"
				:title="t('integration_github', 'Loading data')" />
			<div v-else class="info">
				<div v-if="data?.name">
					{{ data.name }}
				</div>
				<div v-if="data?.location">
					<LocationIcon :size="16" class="icon" />
					{{ data.location }}
				</div>
				<div v-for="c in contexts"
					:key="c.message">
					<component :is="octicons[c.octicon]"
						v-if="octicons[c.octicon]"
						:size="16"
						class="icon" />
					{{ c.message }}
				</div>
			</div>
		</div>
		<!-- See https://nextcloud-vue-components.netlify.app/#/Components/NcPopover -->
		<template #trigger="{ attrs }">
			<slot name="trigger" v-bind="attrs" />
		</template>
	</NcPopover>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import NcAvatar from '@nextcloud/vue/components/NcAvatar'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcPopover from '@nextcloud/vue/components/NcPopover'
import CommitIcon from './icons/CommitIcon.vue'
import IssueOpenIcon from './icons/IssueOpenIcon.vue'
import LocationIcon from './icons/LocationIcon.vue'
import PrOpenIcon from './icons/PrOpenIcon.vue'
import RepositoryIcon from './icons/RepositoryIcon.vue'
import RocketIcon from './icons/RocketIcon.vue'

const octicons = {
	rocket: RocketIcon,
	'issue-opened': IssueOpenIcon,
	'git-pull-request': PrOpenIcon,
	repo: RepositoryIcon,
	'git-commit': CommitIcon,
}

export default {
	name: 'UserPopover',

	components: {
		LocationIcon,
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

		subjectType: {
			type: String,
			required: true,
		},

		subjectId: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			data: null,
			contexts: [],
			loading: false,
			octicons,
		}
	},

	computed: {
		avatarUrl() {
			return generateUrl('/apps/integration_github/avatar/{login}', { login: this.userLogin })
		},
	},

	watch: {
		shown(newValue) {
			if (newValue === true && this.data === null) {
				this.loading = true
				Promise.all([this.getUserData(), this.getUserContextualData()])
					.catch((err) => {
						console.error(err)
					})
					.then(() => {
						this.loading = false
					})
			}
		},
	},

	mounted() {
	},

	methods: {
		async getUserData() {
			const url = generateUrl('/apps/integration_github/users/{login}', { login: this.userLogin })
			return axios.get(url).then((response) => {
				this.data = response.data
			})
		},

		async getUserContextualData() {
			const url = generateUrl('/apps/integration_github/users/{login}/hovercard/{subjectType}/{subjectId}', {
				login: this.userLogin,
				subjectType: this.subjectType,
				subjectId: this.subjectId,
			})
			return axios.get(url).then((response) => {
				this.contexts = response.data.contexts
			})
		},
	},
}
</script>

<style scoped lang="scss">
.user-popover-content {
	display: flex;
	flex-direction: column;
	align-items: start;
	padding: 8px;

	.header {
		display: flex;
		align-items: center;

		.tooltip-avatar {
			margin-right: 8px;
		}
	}

	.info {
		display: flex;
		flex-direction: column;
		align-items: start;

		.icon {
			margin-right: 4px;
		}

		> * {
			display: flex;
			align-items: center;
		}
	}
}
</style>
