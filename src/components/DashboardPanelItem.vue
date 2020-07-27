<template>
    <li @mouseover="hovered = true" @mouseleave="hovered = false" >
        <div class="popover-container">
            <!--Popover :open="hovered" placement="top" class="content-popover" offset="40">
                <template>
                    <h3>{{ n.repository.full_name }}</h3>
                    {{ getTargetIdentifier(n) }} {{ n.subject.title }}<br/>
                    {{ getFormattedDate(n) }}<br/><br/>
                    {{ getNotificationContent(n) }}
                </template>
            </Popover-->
        </div>
        <a :href="item.targetUrl" target="_blank" class="item-list__entry">
            <Avatar
                class="item-avatar"
                :url="item.avatarUrl"
                :user="item.avatarUsername"
                />
            <img class="item-icon" :src="item.overlayIconUrl"/>
            <div class="item__details">
                <h3>
                    {{ item.mainText }}
                </h3>
                <p class="message" :title="item.subText">
                    {{ item.subText }}
                </p>
            </div>
            <Actions v-if="gotMenu" :forceMenu="true">
                <ActionText v-for="(m, id) in itemMenu"
                    :key="id"
                    :title="m.text"
                    :icon="m.icon"
                    :closeAfterClick="true"
                    @click.prevent.stop="$emit(id, item)"
                />
            </Actions>
        </a>
    </li>
</template>

<script>
import { Avatar, Popover, Actions, ActionText } from '@nextcloud/vue'
export default {
    name: 'DashboardPanelItem',
    components: {
        Avatar, Popover, Actions, ActionText
    },

    props: {
        item: {
            type: Object,
            required: true,
        },
        itemMenu: {
            type: Object,
            default: () => { return {} }
        }
    },

    mounted() {
    },

    data() {
        return {
            hovered: false
        }
    },

    watch: {
    },

    computed: {
        gotMenu() {
            return Object.keys(this.itemMenu).length !== 0
        },
    },

    methods: {

    },
}
</script>

<style scoped lang="scss">
li .item-list__entry {
    display: flex;
    align-items: flex-start;
    padding: 8px;

    &:hover,
    &:focus {
        background-color: var(--color-background-hover);
        border-radius: var(--border-radius-large);
    }
    .item-avatar {
        position: relative;
        margin-top: auto;
        margin-bottom: auto;
    }
    .item__details {
        padding-left: 8px;
        max-height: 44px;
        flex-grow: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

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

    img.item-icon {
        position: absolute;
        width: 14px;
        height: 14px;
        margin: 27px 0 10px 24px;
    }

    button.primary {
        padding: 21px;
        margin: 0;
    }
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
