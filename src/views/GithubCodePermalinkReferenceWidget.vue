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
			<a :href="titleLink" class="line">
				<GithubIcon :size="20" class="icon" />
				<strong>
					{{ title }}
				</strong>
			</a>
			<div class="sub-title">
				{{ subtitle }}
				(<a :href="commitLink">{{ shortCommit }}</a>)
			</div>
			<hr>
			<div
				v-tooltip.top="{ content: t('integration_github', 'Click to expand/collapse content') }"
				:class="{
					'content': true,
				}"
				@click="showShortContent = !showShortContent">
				<!--pre>{{ textContent }}</pre-->
				<pre v-highlightjs="textContent"><code :class="{
					[codeClass]: true,
					'short-content': showShortContent,
				}" /></pre>
			</div>
		</div>
	</div>
</template>

<script>
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'

import GithubIcon from '../components/icons/GithubIcon.vue'

import { generateUrl, imagePath } from '@nextcloud/router'

import { isDarkMode } from '../utils.js'
import VueHighlightJS from 'vue-highlightjs'
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'
import Vue from 'vue'
Vue.directive('tooltip', Tooltip)
Vue.use(VueHighlightJS)

const extensionToClass = {
	js: 'javascript',
	php: 'php',
}

export default {
	name: 'GithubCodePermalinkReferenceWidget',

	components: {
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
			showShortContent: true,
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
		subtitle() {
			return this.richObject.lineEnd
				? t('integration_github', 'Line {begin} to {end}', { begin: this.richObject.lineBegin, end: this.richObject.lineEnd })
				: t('integration_github', 'Line {line}', { line: this.richObject.lineBegin })
		},
		commitLink() {
			return 'https://github.com/' + this.richObject.owner + '/' + this.richObject.repo + '/commit/' + this.richObject.commit
		},
		shortCommit() {
			return this.richObject.commit.slice(0, 7)
		},
		textContent() {
			let content = ''
			for (let i = 0; i < this.richObject.lines.length; i++) {
				content += (this.richObject.lineBegin + i) + ' ' + this.richObject.lines[i] + '\n'
			}
			return content.replace(/^\s+|\s+$/g, '')
		},
		codeClass() {
			const extension = this.richObject.filePath.match(/\.([a-zA-Z0-9]+)$/)
			if (extension && extension.length > 1) {
				return extensionToClass[extension[1]] ?? ''
			}
			return ''
		},
		isDarkMode() {
			return isDarkMode()
		},
		isHighContrastMode() {
			const bodyDataTheme = document.body.getAttribute('data-themes')
			return bodyDataTheme.endsWith('highcontrast')
		},
	},

	beforeMount() {
		const cssFileName = this.isDarkMode
			? this.isHighContrastMode
				? 'github-dark.css'
				: 'github-dark-dimmed.css'
			: 'github.css'
		// load the css file by inserting a <link rel="stylesheet"> tag
		const styleCSS = document.createElement('link')
		styleCSS.rel = 'stylesheet'
		styleCSS.href = imagePath('integration_github', 'example.svg').replace(/img\/example\.svg$/, 'css/' + cssFileName)
		document.head.insertBefore(styleCSS, document.head.childNodes[document.head.childNodes.length - 1].nextSibling)
	},

	methods: {
	},
}
</script>

<style scoped lang="scss">
.github-code-permalink-reference {
	width: 100%;
	white-space: normal;
	padding: 12px;

	a {
		padding: 0 !important;
		color: var(--color-main-text) !important;
		text-decoration: unset !important;
		&:hover {
			color: #58a6ff !important;
		}
	}

	h3 {
		display: flex;
		align-items: center;
		font-weight: bold;
		.icon {
			margin-right: 8px;
		}
	}

	hr {
		width: 100%;
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
				margin: 0 8px 0 8px;
			}
		}

		.content {
			width: 100%;
			cursor: pointer;
			code {
				cursor: pointer;

				max-height: 300px;
				overflow: scroll;
				scrollbar-width: auto;
				scrollbar-color: var(--color-primary);
				&.short-content {
					max-height: 125px;
				}
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