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
								{{ cleanTitle }}
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
					<UserPopover :user-login="richObject.user?.login"
						:shown="showObjectAuthorPopover"
						:subject-type="richObject.github_type"
						:subject-id="richObject.id">
						<a :href="'https://github.com/' + richObject.user.login"
							target="_blank"
							class="author-link"
							@mouseenter="showObjectAuthorPopover = true"
							@mouseleave="showObjectAuthorPopover = false">
							{{ t('integration_github', 'by {creator}', { creator: richObject.user.login }) }}
						</a>
					</UserPopover>
					&nbsp;
					<span v-tooltip.top="{ content: subTextTooltip }"
						class="date-with-tooltip">
						{{ dateSubText }}
					</span>
					&nbsp;
					<span v-if="isPr">
						{{ prSubText }}
					</span>
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
		<CommentReactions v-if="richObject?.reactions?.total_count > 0"
			class="issue-pr--reactions item-reactions"
			:reactions="richObject.reactions"
			:reaction-data="issueReactionData"
			@mouseenter="getIssueReactions" />
		<div v-if="richObject.github_comment" class="comment">
			<div class="comment--content">
				<UserPopover :user-login="richObject.github_comment.user?.login"
					:shown="showCommentAvatarPopover"
					:subject-type="richObject.github_type"
					:subject-id="richObject.id">
					<NcAvatar
						class="author-avatar"
						:is-no-user="true"
						:url="commentAuthorAvatarUrl"
						@mouseenter.native="showCommentAvatarPopover = true"
						@mouseleave.native="showCommentAvatarPopover = false" />
				</UserPopover>
				<span class="comment--content--bubble-tip" />
				<span class="comment--content--bubble">
					<div class="comment--content--bubble--header">
						<UserPopover :user-login="richObject.github_comment.user?.login"
							:shown="showCommentAuthorPopover"
							:subject-type="richObject.github_type"
							:subject-id="richObject.id">
							<strong @mouseenter="showCommentAuthorPopover = true"
								@mouseleave="showCommentAuthorPopover = false">
								<a :href="commentAuthorUrl" target="_blank" class="author-link comment-author-display-name">
									{{ richObject.github_comment.user.login }}
								</a>
							</strong>
						</UserPopover>
						&nbsp;
						<span v-tooltip.top="{ content: commentedAtTooltip }"
							class="date-with-tooltip">
							{{ commentedAtText }}
						</span>
						<span v-if="richObject.github_comment.created_at !== richObject.github_comment.updated_at">
							&nbsp;•&nbsp;
						</span>
						<span v-if="richObject.github_comment.created_at !== richObject.github_comment.updated_at"
							v-tooltip.top="{ content: commentUpdatedAtTooltip }"
							class="date-with-tooltip">
							{{ commentUpdatedAtText }}
						</span>
						<div class="spacer" />
						<div v-if="richObject.github_comment.user.login === richObject.user.login" class="label">
							{{ t('integration_github', 'Author') }}
						</div>
						<div v-if="richObject.github_comment.user.login === richObject.github_repo_owner" class="label">
							{{ t('integration_github', 'Owner') }}
						</div>
					</div>
					<div :class="{
						'comment--content--bubble--content': true,
						'short-comment': shortComment,
					}">
						<RichText
							v-tooltip.top="{ content: shortComment ? t('integration_github', 'Click to expand comment') : undefined }"
							:text="richObject.github_comment.body"
							:use-markdown="true"
							@click.native="shortComment = !shortComment" />
					</div>
					<CommentReactions v-if="richObject.github_comment?.reactions?.total_count > 0"
						class="comment--reactions item-reactions"
						:reactions="richObject.github_comment.reactions"
						:reaction-data="commentReactionData"
						@mouseenter="getCommentReactions" />
				</span>
			</div>
		</div>
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
import UserPopover from '../components/UserPopover.vue'

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import moment from '@nextcloud/moment'
import { hexToRgb } from '../utils.js'
import rgbToHsl from '@alchemyalcove/rgb-to-hsl'
import removeMd from 'remove-markdown'

import { RichText } from '@nextcloud/vue-richtext'
import NcAvatar from '@nextcloud/vue/dist/Components/NcAvatar.js'
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'
import Vue from 'vue'
Vue.directive('tooltip', Tooltip)

export default {
	name: 'ReferenceGithubWidget',

	components: {
		RichText,
		UserPopover,
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
			shortComment: true,
			commentReactionData: null,
			issueReactionData: null,
			showObjectAuthorPopover: false,
			showCommentAvatarPopover: false,
			showCommentAuthorPopover: false,
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
			return this.richObject.github_type === 'pull_request'
		},
		isDarkMode() {
			const style = getComputedStyle(document.body)
			const bgColor = style.getPropertyValue('--color-main-background')
			const rgb = hexToRgb(bgColor)
			const hsl = rgbToHsl([rgb.r, rgb.g, rgb.b])
			return Math.round(hsl[2]) < 30
		},
		cleanTitle() {
			return removeMd(this.richObject.title)
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
		prSubText() {
			return (this.richObject.draft ? ' • ' + t('integration_github', 'Draft') : '')
				+ (this.richObject.requested_reviewers?.length > 0 ? ' • ' + t('integration_github', 'Review requested') : '')
		},
		dateSubText() {
			if (this.richObject.state === 'open') {
				return this.createdAtSubText
			} else if (this.richObject.state === 'closed') {
				if (this.isPr && this.richObject.merged) {
					return this.mergedAtSubText
				} else {
					return this.closedAtSubText
				}
			}
			return ''
		},
		subTextTooltip() {
			if (this.richObject.state === 'open') {
				return this.createdAtFormatted
			} else if (this.richObject.state === 'closed') {
				return this.closedAtFormatted
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
			return t('integration_github', 'opened {relativeDate}', { relativeDate: moment(this.richObject.created_at).fromNow() })
		},
		closedAtSubText() {
			return t('integration_github', 'was closed {relativeDate}', { relativeDate: moment(this.richObject.closed_at).fromNow() })
		},
		mergedAtSubText() {
			return t('integration_github', 'was merged {relativeDate}', { relativeDate: moment(this.richObject.closed_at).fromNow() })
		},
		commentAuthorUrl() {
			return 'https://github.com/' + this.richObject.github_comment?.user?.login
		},
		commentAuthorAvatarUrl() {
			const login = this.richObject.github_comment.user?.login ?? ''
			return generateUrl('/apps/integration_github/avatar/{login}', { login })
		},
		commentAuthorTooltip() {
			return t('integration_github', 'Comment from {login}', { login: this.richObject.github_comment.user?.login ?? '' })
		},
		commentedAtTooltip() {
			return moment(this.richObject.github_comment.created_at).format('LLL')
		},
		commentedAtText() {
			return t('integration_github', 'commented {date}', { date: moment(this.richObject.github_comment.created_at).fromNow() })
		},
		commentUpdatedAtTooltip() {
			return moment(this.richObject.github_comment.updated_at).format('LLL')
		},
		commentUpdatedAtText() {
			return t('integration_github', 'edited {date}', { date: moment(this.richObject.github_comment.updated_at).fromNow() })
		},
	},

	methods: {
		getAssigneeAvatarUrl(assignee) {
			const login = assignee.login ?? ''
			return generateUrl('/apps/integration_github/avatar/{login}', { login })
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
			if (this.issueReactionData) {
				return
			}
			const url = generateUrl('/apps/integration_github/repos/{owner}/{repo}/issues/{issueNumber}/reactions', {
				owner: this.richObject.github_repo_owner,
				repo: this.richObject.github_repo,
				// according to https://docs.github.com/en/rest/reactions there is no reactions for pull requests
				issueNumber: this.richObject.github_issue_id,
			})
			axios.get(url).then((response) => {
				this.issueReactionData = response.data
			}).catch((error) => {
				console.error(error)
			})
		},
		getCommentReactions() {
			if (this.commentReactionData) {
				return
			}
			const url = generateUrl('/apps/integration_github/repos/{owner}/{repo}/issues/comments/{commentId}/reactions', {
				owner: this.richObject.github_repo_owner,
				repo: this.richObject.github_repo,
				commentId: this.richObject.github_comment.id,
			})
			axios.get(url).then((response) => {
				this.commentReactionData = response.data
			}).catch((error) => {
				console.error(error)
			})
		},
	},
}
</script>

<style scoped lang="scss">
@import '@nextcloud/vue-richtext/dist/style.css';

.github-reference {
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
				white-space: nowrap;
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
			align-items: start;
			width: 100%;

			.author-avatar {
				margin-top: 4px;
			}

			&--bubble {
				display: flex;
				flex-direction: column;
				width: 100%;
				padding-bottom: 4px;
				border: 1px solid var(--color-border-dark);
				border-radius: 6px;

				> * {
					padding-left: 8px;
					padding-right: 8px;
				}
				&--header {
					display: flex;
					align-items: center;
					height: 38px;
					background-color: var(--color-background-hover);
					border-bottom: 1px solid var(--color-border-dark);
					border-top-left-radius: 6px;
					border-top-right-radius: 6px;
					color: var(--color-text-maxcontrast);
					.comment-author-display-name {
						color: var(--color-main-text);
					}
				}
				&--content {
					cursor: pointer;
					margin: 6px 0;

					max-height: 250px;
					overflow: scroll;
					&.short-comment {
						max-height: 25px;
						overflow: hidden;
					}
				}
			}
			&--bubble-tip {
				margin-left: 15px;
				position: relative;
				top: 20px;
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
					border-right: 8px solid var(--color-background-hover);
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

	.milestone,
	::v-deep .author-link,
	.slug-link {
		color: inherit !important;
	}

	.date-with-tooltip,
	.milestone,
	::v-deep .author-link,
	.slug-link,
	.issue-pr-link {
		&:hover {
			color: #58a6ff !important;
		}
	}

	.issue-pr--reactions {
		margin: 4px 0 0 40px;
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
