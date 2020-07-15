<template>
    <div id="github_prefs" class="section">
            <h2>{{ t('github', 'Github access') }}</h2>
            <div class="grid-form">
                <label for="github-token">{{ t('github', 'Github access token') }}</label>
                <input id="github-token" type="text" v-model="state.token" @input="onInput"/>
            </div>
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
        onInput() {
            const that = this
            delay(function() {
                that.saveOptions()
            }, 2000)()
        },
        saveOptions() {
            const req = {
                values: {
                    token: this.state.token
                }
            }
            const url = generateUrl('/apps/github/config')
            axios.put(url, req)
                .then(function (response) {
                    showSuccess(t('github', 'Github options saved.'))
                })
                .catch(function (error) {
                    showError(t('github', 'Failed to save Github options') +
                        ': ' + error.response.request.responseText
                    )
                })
                .then(function () {
                })
            this.getno()
        },
        /*
        getno() {
            const url = generateUrl('/apps/github/notifications')
            axios.get(url)
                .then(function (response) {
                    console.log(response.data)
                })
                .catch(function (error) {
                    showError(t('github', 'Failed to get Github notifications') +
                        ': ' + error.response.request.responseText
                    )
                })
                .then(function () {
                })
        },
        */
    }
}
</script>

<style scoped lang="scss">
.grid-form label {
    line-height: 38px;
}
.grid-form input {
    width: 100%;
}
.grid-form {
    width: 400px;
    display: grid;
    grid-template: 1fr / 1fr 1fr;
}
</style>