<template>
    <div id="github_prefs" class="section">
            <h2>
                <a class="icon icon-github"></a>
                {{ t('github', 'Github') }}
            </h2>
            <p class="settings-hint">
                {{ t('github', 'When you create a personal access token yourself, give it at least "read:user", "user:email" and "notifications" permissions.') }}
            </p>
            <div class="github-grid-form">
                <label for="github-token">
                    <a class="icon icon-category-auth"></a>
                    {{ t('github', 'Github access token') }}
                </label>
                <input id="github-token" type="password" v-model="state.token" @input="onInput"
                    :readonly="readonly"
                    @focus="readonly = false"
                    :placeholder="t('github', 'Get a token in Github settings')" />
                <button id="github-oauth" v-if="showOAuth" @click="onOAuthClick">
                    <span class="icon icon-external"/>
                    {{ t('github', 'Get access with OAuth') }}
                </button>
            </div>
    </div>
</template>

<script>
import { loadState } from '@nextcloud/initial-state'
import { generateUrl, imagePath } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils'
import { showSuccess, showError } from '@nextcloud/dialogs'

export default {
    name: 'PersonalSettings',

    props: [],
    components: {
    },

    mounted() {
        const paramString = window.location.search.substr(1)
        const urlParams = new URLSearchParams(paramString)
        const ghToken = urlParams.get('githubToken')
        if (ghToken === 'success') {
            showSuccess(t('github', 'Github OAuth access token successfully retrieved!'))
        } else if (ghToken === 'error') {
            showError(t('github', 'Github OAuth error:') + ' ' + urlParams.get('message'))
        }
    },

    data() {
        return {
            state: loadState('github', 'user-config'),
            readonly: true,
        }
    },

    watch: {
    },

    computed: {
        showOAuth() {
            return this.state.client_id && this.state.client_secret
        },
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
        },
        onOAuthClick() {
            const redirect_endpoint = generateUrl('/apps/github/oauth-redirect')
            const redirect_uri = OC.getProtocol() + '://' + OC.getHostName() + redirect_endpoint
            const oauth_state = Math.random().toString(36).substring(3)
            const request_url = 'https://github.com/login/oauth/authorize?client_id=' + encodeURIComponent(this.state.client_id) +
                '&redirect_uri=' + encodeURIComponent(redirect_uri) +
                '&state=' + encodeURIComponent(oauth_state) +
                '&scope=' + encodeURIComponent('user repo notifications')

            const req = {
                values: {
                    oauth_state: oauth_state,
                }
            }
            const url = generateUrl('/apps/github/config')
            axios.put(url, req)
                .then(function (response) {
                    window.location.replace(request_url)
                })
                .catch(function (error) {
                    showError(t('github', 'Failed to save Github OAuth state') +
                        ': ' + error.response.request.responseText
                    )
                })
                .then(function () {
                })
        }
    }
}
</script>

<style scoped lang="scss">
.github-grid-form label {
    line-height: 38px;
}
.github-grid-form input {
    width: 100%;
}
.github-grid-form {
    width: 700px;
    display: grid;
    grid-template: 1fr / 233px 233px 300px;
    margin-left: 30px;
    button .icon {
        margin-bottom: -1px;
    }
}
#github_prefs .icon {
    display: inline-block;
    width: 32px;
}
#github_prefs .grid-form .icon {
    margin-bottom: -3px;
}
.icon-github {
    background-image: url(./../../img/app-dark.svg);
    background-size: 23px 23px;
    height: 23px;
    margin-bottom: -4px;
}

body.dark .icon-github {
    background-image: url(./../../img/app.svg);
}
</style>
