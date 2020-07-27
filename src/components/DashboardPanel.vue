<template>
    <div>
        <slot name="header" />
        <ul>
            <DashboardPanelItem
                v-for="item in items"
                :key="item.id"
                :item="item"
                :itemMenu="itemMenu"
                v-on="handlers"
                />
        </ul>
        <div v-if="loading" class="icon-loading-small"></div>
        <slot name="empty-content" v-else-if="items.length === 0"/>
        <p v-else-if="showMoreLess" class="moreOrLess">
            <span @click="$emit('moreClicked')">{{ t('core', 'More items...') }}</span>
            <span v-show="items.length > 7" @click="$emit('lessClicked')" class="icon icon-close"/>
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
        showMoreLess: {
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
.moreOrLess * {
    cursor: pointer;
}
.moreOrLess {
    text-align: center;
}
.icon-close {
    float: right;
    position: relative;
    bottom: -3px;
}
</style>