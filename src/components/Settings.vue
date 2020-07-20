<template>
    <div id="github_prefs" class="section">
            <h2>
                <a class="icon icon-github" :style="{'background-image': 'url(' + iconUrl + ')'}"></a>
                {{ t('github', 'Github') }}
            </h2>
            <div class="grid-form">
                <label for="github-token">
                    <a class="icon icon-category-auth"></a>
                    {{ t('github', 'Github access token') }}
                </label>
                <input id="github-token" type="password" v-model="state.token" @input="onInput"/>
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
    name: 'Settings',

    props: [],
    components: {
    },

    mounted() {
    },

    data() {
        return {
            state: loadState('github', 'user-config'),
            iconUrl: imagePath('github', 'app.svg')
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
        },
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
    width: 500px;
    display: grid;
    grid-template: 1fr / 1fr 1fr;
    margin-left: 30px;
}
#github_prefs .icon {
    display: inline-block;
    width: 32px;
}
#github_prefs .grid-form .icon {
    margin-bottom: -3px;
}
.icon-github {
    mix-blend-mode: difference;
    background-size: 23px 23px;
    height: 23px;
    margin-bottom: -4px;
}
</style>