<template>
    <div>
        <ul v-if="state === 'ok'" class="notification-list">
            <li v-for="n in notifications" :key="n.id" :title="getNotificationTitle(n)">
                <a :href="getNotificationTarget(n)" target="_blank" class="notification">
                    <Avatar
                        class="project-avatar"
                        :user="n.repository.name"
                        :tooltipMessage="n.repository.full_name"
                        />
                    <div class="notification__details">
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
import { Avatar } from '@nextcloud/vue'
import { showSuccess, showError } from '@nextcloud/dialogs'
import moment from '@nextcloud/moment'

export default {
    name: 'Dashboard',

    props: [],
    components: {
        Avatar
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
            loop: null,
            state: 'loading',
            settingsUrl: generateUrl('/settings/user/linked-accounts'),
            themingColor: OCA.Theming ? OCA.Theming.color.replace('#', '') : '0082C9'
        }
    },

    computed: {
        lastDate() {
            const nbNotif = this.notifications.length
            return (nbNotif > 0) ? this.notifications[0].updated_at : null
        },
        lastMoment() {
            return moment(this.lastDate)
        }
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
                    const toAdd = this.filter(newNotifications.slice(0, i+1))
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
            if (n.target_type === 'Note') {
                return 'icon-comment'
            } else if (['Issue', 'MergeRequest'].includes(n.target_type)) {
                if (n.action_name === 'closed') {
                    return 'icon-close'
                } else if (n.action_name === 'opened') {
                    return 'icon-add'
                } else if (n.action_name === 'accepted') {
                    return 'icon-checkmark-color'
                }
            }

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
        getNotificationTitle(n) {
            return '[' + n.repository.full_name + ']\n\n' + n.subject.title + '\n\n' + this.getNotificationContent(n);
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
</style>
