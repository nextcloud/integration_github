<template>
    <div>
        <slot name="header" />
        <ul>
            <DashboardPanelItem
                v-for="item in items"
                :key="item.id"
                :item="item"
                />
        </ul>
        <slot name="empty-content" v-if="items.length === 0"/>
        <p v-else-if="showMoreLess" class="moreOrLess">
            <span @click="$emit('moreClicked')">{{ t('core', 'More items...') }}</span>
            <span @click="$emit('lessClicked')" class="icon icon-close"/>
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
        }
    },
    components: {
        DashboardPanelItem
    },

    mounted() {
    },

    data() {
        return {
        }
    },

    watch: {
    },

    computed: {
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