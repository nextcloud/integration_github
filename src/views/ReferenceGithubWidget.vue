<!--
  - @copyright Copyright (c) 2022 2022 Julien Veyssier <eneiluj@posteo.net>
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
	<div class="github-reference">
		<div v-if="isIssue || isPr" class="issue-pr-wrapper">
			<div class="main-content">
				<div class="line">
					<component :is="iconComponent"
						v-tooltip.top="{ content: stateTooltip }"
						:size="16"
						class="icon"
						:fill-color="iconColor" />
					<strong>
						{{ richObject.title }}
					</strong>
				</div>
				<div class="sub-text">
					<span>#{{ githubId }}</span>
					&nbsp;
					<span v-html="subText" />
				</div>
			</div>
			<div class="spacer" />
			<div class="right-content">
				<Avatar v-if="richObject.assignees.length > 0"
					:tooltip-message="assigneeTooltip"
					:is-no-user="true"
					:size="20"
					:url="assigneeUrl" />
			</div>
		</div>
	</div>
</template>

<script>
import IssueOpenIcon from '../components/icons/IssueOpenIcon.vue'
import IssueClosedIcon from '../components/icons/IssueClosedIcon.vue'
import IssueClosedNotPlannedIcon from '../components/icons/IssueClosedNotPlannedIcon.vue'
import PrOpenIcon from '../components/icons/PrOpenIcon.vue'
import PrOpenDraftIcon from '../components/icons/PrOpenDraftIcon.vue'
import PrMergedIcon from '../components/icons/PrMergedIcon.vue'
import PrClosedIcon from '../components/icons/PrClosedIcon.vue'

import { generateUrl } from '@nextcloud/router'
import moment from '@nextcloud/moment'
import escapeHtml from 'escape-html'

import Avatar from '@nextcloud/vue/dist/Components/Avatar.js'
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'
import Vue from 'vue'
Vue.directive('tooltip', Tooltip)

export default {
	name: 'ReferenceGithubWidget',

	components: {
		Avatar,
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

	computed: {
		isIssue() {
			return this.richObject.github_type === 'issue'
		},
		isPr() {
			return this.richObject.github_type === 'pr'
		},
		githubId() {
			if (this.isIssue) {
				return this.richObject.github_issue_id
			} else if (this.isPr) {
				return this.richObject.github_pr_id
			}
			return ''
		},
		iconComponent() {
			if (this.isIssue) {
				if (this.richObject.state === 'open') {
					return IssueOpenIcon
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.state_reason === 'not_planned') {
						return IssueClosedNotPlannedIcon
					} else {
						return IssueClosedIcon
					}
				}
				return IssueOpenIcon
			} else if (this.isPr) {
				if (this.richObject.state === 'open') {
					if (this.richObject.draft) {
						return PrOpenDraftIcon
					} else {
						return PrOpenIcon
					}
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.merged) {
						return PrMergedIcon
					} else {
						return PrClosedIcon
					}
				}
				return PrOpenIcon
			}
			return IssueOpenIcon
		},
		iconColor() {
			if (this.isIssue) {
				if (this.richObject.state === 'open') {
					return '#3fb950'
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.state_reason === 'not_planned') {
						return '#8b949e'
					} else {
						return '#a371f7'
					}
				}
			} else if (this.isPr) {
				if (this.richObject.state === 'open') {
					if (this.richObject.draft) {
						return '#8b949e'
					} else {
						return '#3fb950'
					}
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.merged) {
						return '#a371f7'
					} else {
						return '#f85149'
					}
				}
			}
			return '#8b949e'
		},
		stateTooltip() {
			if (this.isIssue) {
				if (this.richObject.state === 'open') {
					return t('integration_github', 'Open issue')
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.state_reason === 'not_planned') {
						return t('integration_github', 'Closed as not planned issue')
					} else {
						return t('integration_github', 'Closed issue')
					}
				}
			} else if (this.isPr) {
				if (this.richObject.state === 'open') {
					if (this.richObject.draft) {
						return t('integration_github', 'Open draft pull request')
					} else {
						return t('integration_github', 'Open pull request')
					}
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.merged) {
						return t('integration_github', 'Merged pull request')
					} else {
						return t('integration_github', 'Closed pull request')
					}
				}
			}
			return t('integration_github', 'Unknown state')
		},
		subText() {
			if (this.isPr) {
				return this.authorAndDateSubText
					+ (this.richObject.draft ? ' • ' + t('integration_github', 'Draft') : '')
					+ (this.richObject.requested_reviewers?.length > 0 ? ' • ' + t('integration_github', 'Review requested') : '')
			}
			return this.authorAndDateSubText
		},
		authorAndDateSubText() {
			if (this.isIssue) {
				if (this.richObject.state === 'open') {
					return this.createdAtSubText
				} else if (this.richObject.state === 'closed') {
					return this.closedAtSubText
				}
			} else if (this.isPr) {
				if (this.richObject.state === 'open') {
					return this.createdAtSubText
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.merged) {
						return t('integration_github', 'by {creator} was merged {relativeDate}', {
							relativeDate: moment(this.richObject.closed_at).fromNow(),
							creator: this.getUserLink(this.richObject.user?.login),
						}, null, { escape: false })
					} else {
						return this.closedAtSubText
					}
				}
			}
			return ''
		},
		createdAtSubText() {
			return t('integration_github', 'opened {relativeDate} by {creator}', {
				relativeDate: moment(this.richObject.created_at).fromNow(),
				creator: this.getUserLink(this.richObject.user?.login),
			}, null, { escape: false })
		},
		closedAtSubText() {
			return t('integration_github', 'by {creator} was closed {relativeDate}', {
				relativeDate: moment(this.richObject.closed_at).fromNow(),
				creator: this.getUserLink(this.richObject.user?.login),
			}, null, { escape: false })
		},
		assigneeUrl() {
			const login = this.richObject.assignees[0].login ?? ''
			return generateUrl('/apps/integration_github/avatar?githubUserName={login}', { login })
		},
		assigneeTooltip() {
			return t('integration_github', 'Assigned to {login}', { login: this.richObject.assignees[0].login })
		},
	},

	methods: {
		getUserLink(userName) {
			if (userName) {
				const cleanName = escapeHtml(userName)
				return '<a href="https://github.com/' + cleanName + '" target="_blank">' + cleanName + '</a>'
			}
			return '??'
		},
	},
}
</script>

<style scoped lang="scss">
.github-reference {
	width: 100%;
	white-space: normal;
	padding: 8px;

	.issue-pr-wrapper {
		width: 100%;
		display: flex;
		align-items: center;

		.line {
			display: flex;
			align-items: center;

			> .icon {
				margin-right: 8px;
			}
		}

		.sub-text {
			display: flex;
			align-items: center;
			color: var(--color-text-maxcontrast);
			margin-left: 24px;
		}
	}

	.spacer {
		flex-grow: 1;
	}
}
</style>
