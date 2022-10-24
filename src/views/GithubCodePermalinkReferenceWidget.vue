<!--
  - @copyright Copyright (c) 2022 Julien Veyssier <eneiluj@posteo.net>
  -
  - @author 2022 Julien Veyssier <eneiluj@posteo.net>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
	<div class="github-code-permalink-reference">
		<div v-if="isError">
			<h3>
				<GithubIcon :size="20" class="icon" />
				<span>{{ t('integration_github', 'GitHub API error') }}</span>
			</h3>
			<p v-if="richObject.body?.message"
				class="widget-error">
				{{ richObject.body?.message }}
			</p>
			<p v-else
				class="widget-error">
				{{ t('integration_github', 'Unknown error') }}
			</p>
			<a :href="settingsUrl" class="settings-link external" target="_blank">
				<OpenInNewIcon :size="20" class="icon" />
				{{ t('integration_github', 'GitHub connected accounts settings') }}
			</a>
		</div>
		<div v-else class="code-wrapper">
			<a :href="titleLink">
				{{ title }}
			</a>
			<div v-html="subTitle" class="sub-title">
			</div>
		</div>
	</div>
</template>

<script>
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'

import GithubIcon from '../components/icons/GithubIcon.vue'

import { generateUrl } from '@nextcloud/router'

import { RichText } from '@nextcloud/vue-richtext'

export default {
	name: 'GithubCodePermalinkReferenceWidget',

	components: {
		RichText,
		GithubIcon,
		OpenInNewIcon,
	},

	props: {
		richObjectType: {
			type: String,
			default: '',
		},
		richObject: {
			type: Object,
			default: null,
		},
		accessible: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			settingsUrl: generateUrl('/settings/user/connected-accounts#github_prefs'),
		}
	},

	computed: {
		isError() {
			return this.richObject.github_type === 'code-error'
		},
		isCode() {
			return this.richObject.github_type === 'code'
		},
		title() {
			return this.richObject.owner + '/' + this.richObject.repo + '/' + this.richObject.filePath
		},
		titleLink() {
			return this.richObject.link
		},
		subTitle() {
			return 'NYI'
		},
	},

	methods: {
	},
}
</script>

<style scoped lang="scss">
@import '@nextcloud/vue-richtext/dist/style.css';

.github-code-permalink-reference {
	width: 100%;
	white-space: normal;
	padding: 12px;

	a {
		padding: 0 !important;
		color: var(--color-main-text) !important;
		text-decoration: unset !important;
	}

	h3 {
		display: flex;
		align-items: center;
		font-weight: bold;
		.icon {
			margin-right: 8px;
		}
	}

	.code-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;

		.line {
			display: flex;
			align-items: center;

			> .icon {
				margin: 0 16px 0 8px;
			}
		}
	}

	.settings-link {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 4px;
		}
	}

	.widget-error {
		margin-bottom: 8px;
	}

	.spacer {
		flex-grow: 1;
	}
}
</style>
