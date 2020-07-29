<template>
    <div>
        <slot name="header" />
        <ul>
            <li v-for="item in items" :key="item.id">
                <slot name="default" :item="item">
                    <DashboardPanelItem
                        :item="item"
                        :itemMenu="itemMenu"
                        v-on="handlers" />
                </slot>
            </li>
        </ul>
        <div v-if="loading" class="icon-loading-small"></div>
        <slot v-else-if="items.length === 0" name="empty-content" />
        <p v-else-if="showMore" class="more">
            <span @click="$emit('moreClicked')">{{ t('core', 'Show more items...') }}</span>
        </p>
        <slot name="footer" />
    </div>
</template>

<script>
import DashboardPanelItem from './DashboardPanelItem'
export default {
    name: 'DashboardPanel',

    props: {
        items: {
            type: Array,
            default: () => { return [] }
        },
        showMore: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        itemMenu: {
            type: Object,
            default: () => { return {} }
        }
    },
    components: {
        DashboardPanelItem
    },

    created() {
    },

    data() {
        return {
        }
    },

    watch: {
    },

    computed: {
        // forward menu events to my parent
        handlers() {
            const h = {}
            for (const evName in this.itemMenu) {
                h[evName] = (it) => {
                    this.$emit(evName, it)
                }
            }
            return h
        },
    },

    methods: {
    },
}
</script>

<style scoped lang="scss">
.more * {
    cursor: pointer;
}
.more {
    text-align: center;
    color: var(--color-text-lighter)
}
</style>