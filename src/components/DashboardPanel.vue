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
</style>