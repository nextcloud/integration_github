<template>
    <div>
        <ul v-if="state === 'ok'">
            <li v-for="notification in notifications" :key="notification.id">
                {{ notification.subject.title }} - {{ notification.updated_at }}
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
import { showSuccess, showError } from '@nextcloud/dialogs'
import moment from '@nextcloud/moment'

export default {
    name: 'Dashboard',

    props: [],
    components: {
    },

    beforeMount() {
        this.fetchNotifications()
        this.loop = setInterval(() => this.fetchNotifications(), 5000)
    },

    mounted() {
    },

    data() {
        return {
            notifications: [],
            loop: null,
            state: 'loading',
            settingsUrl: generateUrl('/settings/user/linked-accounts')
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
    },
}
</script>

<style scoped lang="scss">
</style>