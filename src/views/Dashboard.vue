<template>
	<DashboardWidget :items="items"
		:show-more-url="showMoreUrl"
		:show-more-text="title"
		:loading="state === 'loading'"
		:item-menu="itemMenu"
		@unsubscribe="onUnsubscribe"
		@markRead="onMarkRead">
		<template #empty-content>
			<EmptyContent v-if="emptyContentMessage">
				<template #icon>
					<component :is="emptyContentIcon" />
				</template>
				<template #desc>
					{{ emptyContentMessage }}
					<div v-if="state === 'no-token' || state === 'error'" class="connect-button">
						<a v-if="!initialState.oauth_is_possible"
							:href="settingsUrl">
							<NcButton>
								<template #icon>
									<LoginVariantIcon />
								</template>
								{{ t('integration_github', 'Connect to GitHub') }}
							</NcButton>
						</a>
						<NcButton v-else
							@click="onOAuthClick">
							<template #icon>
								<LoginVariantIcon />
							</template>
							{{ t('integration_github', 'Connect to GitHub') }}
						</NcButton>
					</div>
				</template>
			</EmptyContent>
		</template>
	</DashboardWidget>
</template>

<script>
import LoginVariantIcon from 'vue-material-design-icons/LoginVariant.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

import GithubIcon from '../components/icons/GithubIcon.vue'

import axios from '@nextcloud/axios'
import { generateUrl, imagePath } from '@nextcloud/router'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import moment from '@nextcloud/moment'
import { DashboardWidget } from '@nextcloud/vue-dashboard'
import EmptyContent from '@nextcloud/vue/dist/Components/EmptyContent.js'
import NcButton from '@nextcloud/vue/dist/Components/Button.js'

export default {
	name: 'Dashboard',

	components: {
		DashboardWidget,
		EmptyContent,
		NcButton,
		LoginVariantIcon,
	},

	props: {
		title: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			notifications: [],
			showMoreUrl: 'https://github.com/notifications',
			showMoreText: t('integration_github', 'GitHub notifications'),
			// lastDate could be computed but we want to keep the value when first notification is removed
			// to avoid getting it again on next request
			lastDate: null,
			loop: null,
			state: 'loading',
			settingsUrl: generateUrl('/settings/user/connected-accounts'),
			darkThemeColor: OCA.Accessibility?.theme === 'dark' ? '181818' : 'ffffff',
			itemMenu: {
				markRead: {
					text: t('integration_github', 'Mark as read'),
					icon: 'icon-checkmark',
				},
				unsubscribe: {
					text: t('integration_github', 'Unsubscribe'),
					icon: 'icon-github-unsubscribe',
				},
			},
			initialState: loadState('integration_github', 'user-config'),
			windowVisibility: true,
		}
	},

	computed: {
		items() {
			return this.notifications.map((n) => {
				return {
					id: n.id,
					targetUrl: this.getNotificationTarget(n),
					avatarUrl: this.getRepositoryAvatarUrl(n),
					avatarUsername: this.getRepositoryOwnerName(n),
					overlayIconUrl: this.getNotificationTypeImage(n),
					mainText: n.subject.title,
					subText: this.getSubline(n),
				}
			})
		},
		lastMoment() {
			return moment(this.lastDate)
		},
		emptyContentMessage() {
			if (this.state === 'no-token') {
				return t('integration_github', 'No GitHub account connected')
			} else if (this.state === 'error') {
				return t('integration_github', 'Error connecting to GitHub')
			} else if (this.state === 'ok') {
				return t('integration_github', 'No GitHub notifications!')
			}
			return ''
		},
		emptyContentIcon() {
			if (this.state === 'no-token') {
				return GithubIcon
			} else if (this.state === 'error') {
				return CloseIcon
			} else if (this.state === 'ok') {
				return CheckIcon
			}
			return CheckIcon
		},
	},

	watch: {
		windowVisibility(newValue) {
			if (newValue) {
				this.launchLoop()
			} else {
				this.stopLoop()
			}
		},
	},

	beforeDestroy() {
		document.removeEventListener('visibilitychange', this.changeWindowVisibility)
	},

	beforeMount() {
		this.launchLoop()
		document.addEventListener('visibilitychange', this.changeWindowVisibility)
	},

	mounted() {
	},

	methods: {
		onOAuthClick() {
			const redirectUri = window.location.protocol + '//' + window.location.host + generateUrl('/apps/integration_github/oauth-redirect')
			const oauthState = Math.random().toString(36).substring(3)
			const requestUrl = 'https://github.com/login/oauth/authorize'
				+ '?client_id=' + encodeURIComponent(this.initialState.client_id)
				+ '&redirect_uri=' + encodeURIComponent(redirectUri)
				+ '&state=' + encodeURIComponent(oauthState)
				+ '&scope=' + encodeURIComponent('read:user user:email repo notifications')

			const req = {
				values: {
					oauth_state: oauthState,
					redirect_uri: redirectUri,
					oauth_origin: 'dashboard',
				},
			}
			const url = generateUrl('/apps/integration_github/config')
			axios.put(url, req).then((response) => {
				window.location.replace(requestUrl)
			}).catch((error) => {
				showError(
					t('integration_github', 'Failed to save GitHub OAuth state')
					+ ': ' + error.response?.request?.responseText
				)
			})
		},
		changeWindowVisibility() {
			this.windowVisibility = !document.hidden
		},
		stopLoop() {
			clearInterval(this.loop)
		},
		launchLoop() {
			this.fetchNotifications()
			this.loop = setInterval(this.fetchNotifications, 60000)
		},
		fetchNotifications() {
			const req = {}
			if (this.lastDate) {
				req.params = {
					since: this.lastDate,
				}
			}
			axios.get(generateUrl('/apps/integration_github/notifications'), req).then((response) => {
				this.processNotifications(response.data)
				this.state = 'ok'
			}).catch((error) => {
				clearInterval(this.loop)
				if (error.response && error.response.status === 400) {
					this.state = 'no-token'
				} else if (error.response && error.response.status === 401) {
					showError(t('integration_github', 'Failed to get GitHub notifications'))
					this.state = 'error'
				} else {
					// there was an error in notif processing
					console.debug(error)
				}
			})
		},
		processNotifications(newNotifications) {
			if (this.lastDate) {
				// just add those which are more recent than our most recent one
				let i = 0
				while (i < newNotifications.length && this.lastMoment.isBefore(newNotifications[i].updated_at)) {
					i++
				}
				if (i > 0) {
					const toAdd = this.filter(newNotifications.slice(0, i))
					this.notifications = toAdd.concat(this.notifications)
				}
			} else {
				// first time we don't check the date
				this.notifications = this.filter(newNotifications)
			}
			// update lastDate manually (explained in data)
			const nbNotif = this.notifications.length
			this.lastDate = (nbNotif > 0) ? this.notifications[0].updated_at : null
		},
		filter(notifications) {
			// only keep the unread ones with specific reasons
			return notifications.filter((n) => {
				return (
					n.unread
					&& (
						['assign', 'mention', 'review_requested'].includes(n.reason)
						|| (n.reason === 'subscribed' && n.subject?.type === 'Release')
					)
				)
			})
		},
		onUnsubscribe(item) {
			// TODO adapt vue-dashboard to put the ID in returned item
			// const i = this.notifications.findIndex((n) => n.id === item.id)
			const i = this.notifications.findIndex((n) => this.getSubline(n) === item.subText)
			if (i !== -1) {
				const id = this.notifications[i].id
				this.editNotification(id, 'unsubscribe')
			}
		},
		onMarkRead(item) {
			// TODO adapt vue-dashboard to put the ID in returned item
			// const i = this.notifications.findIndex((n) => n.id === item.id)
			const i = this.notifications.findIndex((n) => this.getSubline(n) === item.subText)
			if (i !== -1) {
				const id = this.notifications[i].id
				this.notifications.splice(i, 1)
				this.editNotification(id, 'mark-read')
			}
		},
		editNotification(id, action) {
			axios.put(generateUrl('/apps/integration_github/notifications/' + id + '/' + action)).then((response) => {
				if (action === 'unsubscribe') {
					showSuccess(t('integration_github', 'Successfully unsubscribed'))
				}
			}).catch((error) => {
				showError(t('integration_github', 'Failed to edit GitHub notification'))
				console.debug(error)
			})
		},
		getRepositoryAvatarUrl(n) {
			return n.repository?.owner?.login
				? generateUrl('/apps/integration_github/avatar?') + encodeURIComponent('githubUserName') + '=' + encodeURIComponent(n.repository.owner.login)
				: ''
		},
		getRepositoryOwnerName(n) {
			return n.repository?.owner?.login
				? n.repository.owner.login
				: ''
		},
		getNotificationTarget(n) {
			if (n.subject?.type === 'Release') {
				return n.subject.url
					.replace('api.github.com', 'github.com')
					.replace('/repos/', '/')
					.replace(/\/[0-9]+/, '')
			} else if (n.subject?.type !== 'Discussion') {
				return n.subject.url
					.replace('api.github.com', 'github.com')
					.replace('/repos/', '/')
					.replace('/pulls/', '/pull/')
			} else {
				// this is a discussion
				return 'https://github.com/' + n.repository?.full_name + '/discussions'
			}
		},
		getNotificationActionChar(n) {
			if (['review_requested', 'assign'].includes(n.reason)) {
				return '👁'
			} else if (['comment', 'mention'].includes(n.reason)) {
				return '🗨'
			}
			return ''
		},
		getSubline(n) {
			return this.getNotificationActionChar(n) + ' ' + n.repository.name + this.getTargetIdentifier(n)
		},
		getNotificationTypeImage(n) {
			if (n.subject.type === 'PullRequest') {
				return imagePath('integration_github', 'pull_request.svg')
			} else if (n.subject.type === 'Issue') {
				return imagePath('integration_github', 'issue.svg')
			} else if (n.subject.type === 'Release') {
				return imagePath('integration_github', 'release.svg')
			}
			return ''
		},
		getTargetIdentifier(n) {
			if (['PullRequest', 'Issue'].includes(n.subject?.type) && n.subject?.url) {
				const parts = n.subject.url.split('/')
				return '#' + parts[parts.length - 1]
			}
			return ''
		},
		getFormattedDate(n) {
			return moment(n.updated_at).format('LLL')
		},
	},
}
</script>

<style scoped lang="scss">
::v-deep .connect-button {
	margin-top: 10px;
}
</style>
