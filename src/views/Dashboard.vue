<template>
    <div>
    <DashboardPanel :items="items">
        <template slot="empty-content">
            <div v-if="state === 'no-token'">
                <a :href="settingsUrl">
                    {{ t('github', 'Click here to configure the access to your Github account.')}}
                </a>
            </div>
            <div v-else-if="state === 'error'">
                <a :href="settingsUrl">
                    {{ t('github', 'Incorrect access token.') }}
                    {{ t('github', 'Click here to configure the access to your Github account.')}}
                </a>
            </div>
            <div v-else-if="state === 'loading'" class="icon-loading-small"></div>
            <div v-else-if="state === 'ok'">
                {{ t('github', 'Nothing to show') }}
            </div>
        </template>
    </DashboardPanel>
    </div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { showSuccess, showError } from '@nextcloud/dialogs'
import { getLocale } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import DashboardPanel from '../components/DashboardPanel'

export default {
    name: 'Dashboard',

    props: [],
    components: {
        DashboardPanel,
    },

    beforeMount() {
        this.fetchNotifications()
        this.loop = setInterval(() => this.fetchNotifications(), 15000)
    },

    mounted() {
    },

    data() {
        return {
            notifications: [],
            locale: getLocale(),
            loop: null,
            state: 'loading',
            settingsUrl: generateUrl('/settings/user/linked-accounts'),
            themingColor: OCA.Theming ? OCA.Theming.color.replace('#', '') : '0082C9',
            hovered: {},
        }
    },

    computed: {
        items() {
            return this.notifications.map((n) => {
                return {
                    id: n.id,
                    targetUrl: this.getNotificationTarget(n),
                    avatarUrl: this.getRepositoryAvatarUrl(n),
                    //avatarUsername: '',
                    overlayIconUrl: this.getNotificationTypeImage(n),
                    mainText: n.subject.title,
                    subText: this.getSubline(n),
                }
            })
        },
        lastDate() {
            const nbNotif = this.notifications.length
            return (nbNotif > 0) ? this.notifications[0].updated_at : null
        },
        lastMoment() {
            return moment(this.lastDate)
        },
    },

    methods: {
        fetchNotifications() {
            const req = {}
            if (this.lastDate) {
                req.params = {
                    since: this.lastDate
                }
            }
            axios.get(generateUrl('/apps/github/notifications'), req).then((response) => {
                this.processNotifications(response.data)
                this.state = 'ok'
            }).catch((error) => {
                clearInterval(this.loop)
                if (error.response && error.response.status === 400) {
                    this.state = 'no-token'
                } else if (error.response && error.response.status === 401) {
                    showError(t('github', 'Failed to get Github notifications.'))
                    this.state = 'error'
                } else {
                    // there was an error in notif processing
                    console.log(error)
                }
            })
        },
        processNotifications(newNotifications) {
            if (this.lastDate) {
                // just add those which are more recent than our most recent one
                let i = 0;
                while (i < newNotifications.length && this.lastMoment.isBefore(newNotifications[i].updated_at)) {
                    i++
                }
                if (i > 0) {
                    const toAdd = this.filter(newNotifications.slice(0, i))
                    this.notifications = toAdd.concat(this.notifications).slice(0, 7)
                }
            } else {
                // first time we don't check the date
                this.notifications = this.filter(newNotifications).slice(0, 7)
            }
        },
        filter(notifications) {
            // only keep the unread ones with specific reasons
            return notifications.filter((n) => {
                return (n.unread && ['assign', 'mention', 'review_requested'].includes(n.reason))
            })
        },
        getRepositoryAvatarUrl(n) {
            return (n.repository && n.repository.owner && n.repository.owner.avatar_url) ?
                    generateUrl('/apps/github/avatar?') + encodeURIComponent('url') + '=' + encodeURIComponent(n.repository.owner.avatar_url) :
                    ''
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
                    return t('github', 'You were mentioned in a pull request')
                } else if (n.subject.type === 'Issue') {
                    return t('github', 'You were mentioned in an issue')
                }
            } else if (n.reason === 'comment') {
                return t('github', 'Comment')
            } else if (n.reason === 'review_requested') {
                return t('github', 'Your review was requested')
            } else if (n.reason === 'state_change') {
                if (n.subject.type === 'PullRequest') {
                    return t('github', 'Pull request state changed')
                } else if (n.subject.type === 'Issue') {
                    return t('github', 'Issue state changed')
                }
            } else if (n.reason === 'assign') {
                return t('github', 'You are assigned')
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
            return n.repository.full_name + ' ' + this.getNotificationActionChar(n) + ' ' + this.getTargetIdentifier(n)
        },
        getNotificationTypeImage(n) {
            if (n.subject.type === 'PullRequest') {
                return generateUrl('/svg/github/pull_request?color=' + this.themingColor)
            } else if (n.subject.type === 'Issue') {
                return generateUrl('/svg/github/issue?color=' + this.themingColor)
            }
            return generateUrl('/svg/core/actions/sound?color=' + this.themingColor)
        },
        getTargetIdentifier(n) {
            if (['PullRequest', 'Issue'].includes(n.subject.type)) {
                const parts = n.subject.url.split('/')
                return '#' + parts[parts.length - 1]
            }
            return ''
        },
        getFormattedDate(n) {
            return moment(n.updated_at).locale(this.locale).format('LLL')
        },
    },
}
</script>

<style scoped lang="scss">
</style>
