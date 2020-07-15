<template>
    <div id="github_prefs" class="section">
            <h2>{{ t('github', 'Github access token') }}</h2>
            <input type="text" v-model="state.token" @input="onTokenInput"/>
    </div>
</template>

<script>
import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils'
import { showSuccess, showError } from '@nextcloud/dialogs'

export default {
    name: 'Settings',

    props: [],
    components: {
    },

    mounted() {
    },

    data() {
        return {
            state: loadState('github', 'user-config')
        }
    },

    watch: {
    },

    methods: {
        onTokenInput() {
            const that = this
            delay(function() {
                that.saveToken()
            }, 2000)()
        },
        saveToken() {
            const req = {
                values: { token: this.state.token }
            }
            const url = generateUrl('/apps/github/config')
            axios.put(url, req)
                .then(function (response) {
                    showSuccess(t('github', 'Acces token saved.'))
                })
                .catch(function (error) {
                    showError(t('github', 'Failed to save option values') +
                        ': ' + error.response.request.responseText
                    )
                })
                .then(function () {
                })
        }
    }
}
</script>