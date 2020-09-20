<template>
	<DashboardWidget :items="items"
		:show-more-url="showMoreUrl"
		:show-more-text="title"
		:loading="state === 'loading'"
		:item-menu="itemMenu"
		@unsubscribe="onUnsubscribe"
		@markRead="onMarkRead">
		<template v-slot:empty-content>
			<EmptyContent
				v-if="emptyContentMessage"
				:icon="emptyContentIcon">
				<template #desc>
					{{ emptyContentMessage }}
					<div v-if="state === 'no-token' || state === 'error'" class="connect-button">
						<a class="button" :href="settingsUrl">
							{{ t('integration_github', 'Connect to GitHub') }}
						</a>
					</div>
				</template>
			</EmptyContent>
		</template>
	</DashboardWidget>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { showError } from '@nextcloud/dialogs'
import moment from '@nextcloud/moment'
import { DashboardWidget } from '@nextcloud/vue-dashboard'
import EmptyContent from '@nextcloud/vue/dist/Components/EmptyContent'

export default {
	name: 'Dashboard',

	components: {
		DashboardWidget, EmptyContent,
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
			darkThemeColor: OCA.Accessibility.theme === 'dark' ? '181818' : 'ffffff',
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
		}
	},

	computed: {
		items() {
			return this.notifications.map((n) => {
				return {
					id: n.id,
					targetUrl: this.getNotificationTarget(n),
					avatarUrl: this.getRepositoryAvatarUrl(n),
					// avatarUsername: '',
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
				return 'icon-github'
			} else if (this.state === 'error') {
				return 'icon-close'
			} else if (this.state === 'ok') {
				return 'icon-checkmark'
			}
			return 'icon-checkmark'
		},
	},

	beforeMount() {
		this.fetchNotifications()
		this.loop = setInterval(() => this.fetchNotifications(), 15000)
	},

	mounted() {
	},

	methods: {
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
					showError(t('integration_github', 'Failed to get GitHub notifications.'))
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
				return (n.unread && ['assign', 'mention', 'review_requested'].includes(n.reason))
			})
		},
		onUnsubscribe(item) {
			const i = this.notifications.findIndex((n) => n.id === item.id)
			if (i !== -1) {
				this.notifications.splice(i, 1)
			}
			this.editNotification(item, 'unsubscribe')
		},
		onMarkRead(item) {
			const i = this.notifications.findIndex((n) => n.id === item.id)
			if (i !== -1) {
				this.notifications.splice(i, 1)
			}
			this.editNotification(item, 'mark-read')
		},
		editNotification(item, action) {
			axios.put(generateUrl('/apps/integration_github/notifications/' + item.id + '/' + action)).then((response) => {
			}).catch((error) => {
				showError(t('integration_github', 'Failed to edit GitHub notification.'))
				console.debug(error)
			})
		},
		getRepositoryAvatarUrl(n) {
			console.debug(n.repository.owner.avatar_url)
			return (n.repository && n.repository.owner && n.repository.owner.avatar_url)
				? generateUrl('/apps/integration_github/avatar?') + encodeURIComponent('url') + '=' + encodeURIComponent(n.repository.owner.avatar_url)
				: ''
		},
		getNotificationTarget(n) {
			return n.subject.url
				.replace('api.github.com', 'github.com')
				.replace('/repos/', '/')
				.replace('/pulls/', '/pull/')
		},
		getNotificationContent(n) {
			// reason : mention, comment, review_requested, state_change
			if (n.reason === 'mention') {
				if (n.subject.type === 'PullRequest') {
					return t('integration_github', 'You were mentioned in a pull request')
				} else if (n.subject.type === 'Issue') {
					return t('integration_github', 'You were mentioned in an issue')
				}
			} else if (n.reason === 'comment') {
				return t('integration_github', 'Comment')
			} else if (n.reason === 'review_requested') {
				return t('integration_github', 'Your review was requested')
			} else if (n.reason === 'state_change') {
				if (n.subject.type === 'PullRequest') {
					return t('integration_github', 'Pull request state changed')
				} else if (n.subject.type === 'Issue') {
					return t('integration_github', 'Issue state changed')
				}
			} else if (n.reason === 'assign') {
				return t('integration_github', 'You are assigned')
			}
			return ''
		},
		getNotificationActionChar(n) {
			if (['review_requested', 'assign'].includes(n.reason)) {
				return '👁 '
			} else if (['comment', 'mention'].includes(n.reason)) {
				return '🗨 '
			}
			return ''
		},
		getSubline(n) {
			return this.getNotificationActionChar(n) + ' ' + n.repository.name + this.getTargetIdentifier(n)
		},
		getNotificationTypeImage(n) {
			if (n.subject.type === 'PullRequest') {
				return generateUrl('/svg/integration_github/pull_request?color=ffffff')
			} else if (n.subject.type === 'Issue') {
				return generateUrl('/svg/integration_github/issue?color=ffffff')
			}
			return ''
		},
		getTargetIdentifier(n) {
			if (['PullRequest', 'Issue'].includes(n.subject.type)) {
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
