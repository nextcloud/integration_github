<template>
    <div>
        <ul v-if="state === 'ok'" class="notification-list">
            <li v-for="n in notifications" :key="n.id">
                <div class="popover-container">
                    <Popover :open="hovered[n.id]" placement="top" class="content-popover" offset="18">
                        <template>
                            <h3>{{ n.repository.full_name }}</h3>
                            {{ getIdentifier(n) }} {{ n.subject.title }}<br/><br/>
                            {{ getNotificationContent(n) }}
                        </template>
                    </Popover>
                </div>
                <a :href="getNotificationTarget(n)" target="_blank" class="notification"
                    @mouseover="$set(hovered, n.id, true)" @mouseleave="$set(hovered, n.id, false)">
                    <Popover :open="hovered[n.id]" placement="left" class="date-popover" offset="10">
                        <template>
                            {{ getFormattedDate(n) }}
                        </template>
                    </Popover>
                    <Avatar
                        class="project-avatar"
                        :url="getRepositoryAvatarUrl(n)"
                        :tooltipMessage="n.repository.full_name"
                        />
                    <div class="notification__details"
                        >
                        <h3>
                            <img class="notification-icon" :src="getNotificationTypeImage(n)"/>
                            {{ n.subject.title }}
                        </h3>
                        <p class="message">
                            <span :class="'icon ' + getNotificationActionClass(n)"/>
                            {{ getNotificationContent(n) }}
                        </p>
                    </div>
                </a>
            </li>
        </ul>
        <div v-else-if="state === 'no-token'">
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
    </div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { Avatar, Popover } from '@nextcloud/vue'
import { showSuccess, showError } from '@nextcloud/dialogs'
import { getLocale } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'

export default {
    name: 'Dashboard',

    props: [],
    components: {
        Avatar, Popover
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
                    this.notifications = toAdd.concat(this.notifications)
                }
            } else {
                // first time we don't check the date
                this.notifications = this.filter(newNotifications)
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
            }
            return ''
        },
        getNotificationTypeImage(n) {
            if (n.subject.type === 'PullRequest') {
                return generateUrl('/svg/github/pull_request?color=' + this.themingColor)
            } else if (n.subject.type === 'Issue') {
                return generateUrl('/svg/github/issues?color=' + this.themingColor)
            }
            return generateUrl('/svg/core/actions/sound?color=' + this.themingColor)
        },
        getNotificationActionClass(n) {
            if (n.reason === 'mention') {
                return 'icon-comment'
            } else if (n.reason === 'comment') {
                return 'icon-comment'
            } else if (n.reason === 'review_requested') {
                return 'icon-toggle'
            } else if (n.reason === 'state_change') {
                return 'icon-rename'
            }
            return ''
        },
        getIdentifier(n) {
            if (['PullRequest', 'Issue'].includes(n.subject.type)) {
                const parts = n.subject.url.split('/')
                return '[#' + parts[parts.length - 1] + ']'
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
.notification-icon {
    width: 16px;
    height: 12px;
}
li .notification {
    display: flex;
    align-items: flex-start;
    padding: 8px;

    &:hover,
    &:focus {
        background-color: var(--color-background-hover);
        border-radius: var(--border-radius-large);
    }
    .project-avatar {
        position: relative;
        margin-top: auto;
        margin-bottom: auto;
    }
    .notification__details {
        padding-left: 8px;
        max-height: 44px;
        flex-grow: 1;
        overflow: hidden;
        h3,
        .message {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .message span {
            width: 10px;
            display: inline-block;
            margin-bottom: -3px;
        }
        h3 {
            font-size: 100%;
            margin: 0;
        }
        .message {
            width: 100%;
            color: var(--color-text-maxcontrast);
        }
    }
    button.primary {
        padding: 21px;
        margin: 0;
    }
}
.date-popover {
    position: relative;
    top: 7px;
}
.content-popover {
    height: 0px;
    width: 0px;
    margin-left: auto;
    margin-right: auto;
}
.popover-container {
    width: 100%;
    height: 0px;
}
</style>
