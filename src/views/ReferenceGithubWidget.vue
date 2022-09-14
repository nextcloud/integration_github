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
		<div v-if="isIssue || isPr" class="issue-pr-wrapper">
			<div class="issue-pr-info">
				<div class="line">
					<component :is="iconComponent"
						v-tooltip.top="{ content: stateTooltip }"
						:size="16"
						class="icon main-icon"
						:fill-color="iconColor" />
					<div class="title-labels">
						<a :href="richObject.html_url" class="issue-pr-link" target="_blank">
							<strong>
								{{ richObject.title }}
							</strong>
						</a>
						<div v-for="label in richObject.labels"
							:key="label.id"
							v-tooltip.top="{ content: label.description }"
							class="label"
							:style="getLabelStyle(label)">
							{{ label.name }}
						</div>
					</div>
				</div>
				<div class="sub-text">
					<span>
						<a :href="repoUrl" class="slug-link" target="_blank">
							{{ slug }}
						</a>
						#{{ githubId }}
					</span>
					&nbsp;
					<span
						v-tooltip.top="{ content: subTextTooltip }"
						v-html="subText" />
					&nbsp;
					<a v-if="richObject.milestone"
						v-tooltip.top="{ content: richObject.milestone.description }"
						:href="richObject.milestone.html_url"
						target="_blank"
						class="milestone">
						<MilestoneIcon :size="16" class="icon" />
						{{ richObject.milestone.title }}
					</a>
				</div>
			</div>
			<div class="spacer" />
			<div class="right-content">
				<NcAvatar v-for="assignee in richObject.assignees"
					:key="assignee.login"
					:tooltip-message="getAssigneeTooltip(assignee)"
					:is-no-user="true"
					:size="20"
					:url="getAssigneeAvatarUrl(assignee)" />
				<div v-if="richObject.comments > 0" class="comments-count">
					<CommentIcon :size="16" class="icon" />
					{{ richObject.comments }}
				</div>
			</div>
		</div>
		<div v-if="richObject.github_comment" class="comment">
			<div class="comment--content">
				<NcAvatar
					class="author-avatar"
					:tooltip-message="commentAuthorTooltip"
					:is-no-user="true"
					:url="commentAuthorAvatarUrl" />
				<span class="body-bubble" />
				<span class="body" :title="richObject.github_comment.body">
					{{ richObject.github_comment.body }}
				</span>
			</div>
		</div>
		<CommentReactions v-if="richObject.github_comment?.reactions"
			class="comment--reactions item-reactions"
			:reactions="richObject.github_comment.reactions"
			:reaction-data="reactionData"
			@mouseenter="getCommentReactions" />
		<CommentReactions v-else-if="richObject.reactions"
			class="issue-pr--reactions item-reactions"
			:reactions="richObject.reactions"
			:reaction-data="reactionData"
			@mouseenter="getIssueReactions" />
	</div>
</template>

<script>
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'

import GithubIcon from '../components/icons/GithubIcon.vue'
import IssueOpenIcon from '../components/icons/IssueOpenIcon.vue'
import IssueClosedIcon from '../components/icons/IssueClosedIcon.vue'
import IssueClosedNotPlannedIcon from '../components/icons/IssueClosedNotPlannedIcon.vue'
import PrOpenIcon from '../components/icons/PrOpenIcon.vue'
import PrOpenDraftIcon from '../components/icons/PrOpenDraftIcon.vue'
import PrMergedIcon from '../components/icons/PrMergedIcon.vue'
import PrClosedIcon from '../components/icons/PrClosedIcon.vue'
import CommentIcon from '../components/icons/CommentIcon.vue'
import MilestoneIcon from '../components/icons/MilestoneIcon.vue'

import CommentReactions from '../components/CommentReactions.vue'

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import moment from '@nextcloud/moment'
import escapeHtml from 'escape-html'
import { hexToRgb } from '../utils.js'
import rgbToHsl from '@alchemyalcove/rgb-to-hsl'

import NcAvatar from '@nextcloud/vue/dist/Components/NcAvatar.js'
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'
import Vue from 'vue'
Vue.directive('tooltip', Tooltip)

export default {
	name: 'ReferenceGithubWidget',

	components: {
		MilestoneIcon,
		GithubIcon,
		CommentReactions,
		NcAvatar,
		CommentIcon,
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
			reactionData: null,
		}
	},

	computed: {
		isError() {
			return ['issue-error', 'pr-error'].includes(this.richObject.github_type)
		},
		isIssue() {
			return this.richObject.github_type === 'issue'
		},
		isPr() {
			return this.richObject.github_type === 'pr'
		},
		isDarkMode() {
			const style = getComputedStyle(document.body)
			const bgColor = style.getPropertyValue('--color-main-background')
			const rgb = hexToRgb(bgColor)
			const hsl = rgbToHsl([rgb.r, rgb.g, rgb.b])
			return Math.round(hsl[2]) < 30
		},
		slug() {
			return this.richObject.github_repo_owner + '/' + this.richObject.github_repo
		},
		repoUrl() {
			return 'https://github.com/' + this.slug
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
		subTextTooltip() {
			if (this.isIssue) {
				if (this.richObject.state === 'open') {
					return this.createdAtFormatted
				} else if (this.richObject.state === 'closed') {
					return this.closedAtFormatted
				}
			} else if (this.isPr) {
				if (this.richObject.state === 'open') {
					return this.createdAtFormatted
				} else if (this.richObject.state === 'closed') {
					if (this.richObject.merged) {
						return this.closedAtFormatted
					} else {
						return this.closedAtFormatted
					}
				}
			}
			return ''
		},
		createdAtFormatted() {
			return moment(this.richObject.created_at).format('LLL')
		},
		closedAtFormatted() {
			return moment(this.richObject.closed_at).format('LLL')
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
		commentAuthorAvatarUrl() {
			const login = this.richObject.github_comment.user?.login ?? ''
			return generateUrl('/apps/integration_github/avatar?githubUserName={login}', { login })
		},
		commentAuthorTooltip() {
			return t('integration_github', 'Comment from {login}', { login: this.richObject.github_comment.user?.login ?? '' })
		},
	},

	methods: {
		getUserLink(userName) {
			if (userName) {
				const cleanName = escapeHtml(userName)
				return '<a href="https://github.com/' + cleanName + '" class="author-link" target="_blank">' + cleanName + '</a>'
			}
			return '??'
		},
		getAssigneeAvatarUrl(assignee) {
			const login = assignee.login ?? ''
			return generateUrl('/apps/integration_github/avatar?githubUserName={login}', { login })
		},
		getAssigneeTooltip(assignee) {
			return t('integration_github', 'Assigned to {login}', { login: assignee.login })
		},
		getLabelStyle(label) {
			const rgb = hexToRgb('#' + label.color)
			const hsl = rgbToHsl([rgb.r, rgb.g, rgb.b])
			return this.isDarkMode
				? {
					// like github dark mode
					background: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.18)',
					color: `hsl(${Math.round(hsl[0])}, 100%, 75%)`,
				}
				: {
					// like github light mode
					background: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
					color: Math.round(hsl[2]) > 70 ? 'black' : 'white',
				}
		},
		getIssueReactions() {
			if (this.reactionData) {
				return
			}
			const url = generateUrl('/apps/integration_github/repos/{owner}/{repo}/issues/{issueNumber}/reactions', {
				owner: this.richObject.github_repo_owner,
				repo: this.richObject.github_repo,
				// according to https://docs.github.com/en/rest/reactions there is no reactions for pull requests
				issueNumber: this.richObject.github_issue_id,
			})
			axios.get(url).then((response) => {
				this.reactionData = response.data
			}).catch((error) => {
				console.error(error)
			})
		},
		getCommentReactions() {
			if (this.reactionData) {
				return
			}
			const url = generateUrl('/apps/integration_github/repos/{owner}/{repo}/issues/comments/{commentId}/reactions', {
				owner: this.richObject.github_repo_owner,
				repo: this.richObject.github_repo,
				commentId: this.richObject.github_comment.id,
			})
			axios.get(url).then((response) => {
				this.reactionData = response.data
			}).catch((error) => {
				console.error(error)
			})
		},
	},
}
</script>

<style scoped lang="scss">
.github-reference {
	width: 100%;
	white-space: normal;
	padding: 12px;

	h3 {
		display: flex;
		align-items: center;
		font-weight: bold;
		.icon {
			margin-right: 8px;
		}
	}

	.issue-pr-wrapper {
		width: 100%;
		display: flex;
		align-items: start;

		.main-icon {
			align-self: start;
			height: 26px;
		}

		.title-labels {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			> * {
				margin-bottom: 2px;
			}
			.issue-pr-link {
				margin-right: 8px;
			}
			.label {
				display: flex;
				align-items: center;
				height: 20px;
				margin-right: 4px;
				border: 1px solid var(--color-border-dark);
				padding: 0 7px;
				border-radius: var(--border-radius-pill);
				font-size: 12px;
			}
		}

		.milestone,
		::v-deep .author-link,
		.slug-link {
			color: inherit;
		}

		.milestone,
		::v-deep .author-link,
		.slug-link,
		.issue-pr-link {
			&:hover {
				color: #58a6ff;
			}
		}

		.line {
			display: flex;
			align-items: center;

			> .icon {
				margin: 0 16px 0 8px;
			}
		}

		.sub-text {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			color: var(--color-text-maxcontrast);
			margin-left: 40px;

			.milestone {
				display: flex;
				align-items: center;
				.icon {
					margin-right: 4px;
				}
			}
		}

		.right-content {
			display: flex;
			align-items: center;

			.comments-count {
				display: flex;
				align-items: center;
				margin-left: 8px;
				color: var(--color-text-maxcontrast);
				.icon {
					margin-right: 4px;
				}
			}
		}
	}

	.comment {
		margin-top: 8px;
		display: flex;
		flex-direction: column;
		align-items: start;
		&--content {
			display: flex;
			align-items: center;
			width: 100%;

			.body {
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				padding: 4px 8px;
				border: 1px solid var(--color-border-dark);
				border-radius: var(--border-radius);
			}
			.body-bubble {
				margin-left: 15px;
				position: relative;
				&:before {
					content: '';
					width: 0px;
					height: 0px;
					position: absolute;
					border-left: 8px solid transparent;
					border-right: 8px solid var(--color-border-dark);
					border-top: 8px solid transparent;
					border-bottom: 8px solid transparent;
					left: -15px;
					top: -8px;
				}

				&:after {
					content: '';
					width: 0px;
					height: 0px;
					position: absolute;
					border-left: 8px solid transparent;
					border-right: 8px solid var(--color-main-background);
					border-top: 8px solid transparent;
					border-bottom: 8px solid transparent;
					left: -14px;
					top: -8px;
				}
				.message-body:hover &:after {
					border-right: 8px solid var(--color-background-hover);
				}
			}
		}
	}

	.item-reactions {
		margin: 8px 0 0 40px;
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
