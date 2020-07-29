<!--
 - @copyright Copyright (c) 2020 Julien Veyssier <eneiluj@posteo.net>
 -
 - @author Julien Veyssier <eneiluj@posteo.net>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<docs>
This component displays a dashboard panel with an item list as its content.

You can define an optional header, footer and empty-content.

You can set this component in loading mode.

The default item rendering can be overridden with the default slot.

Items can have a context menu.

## Usage

### Item list

This component takes a list of items in the "items" prop.

If the default slot is not overridden, then do whatever you want with the item objects structure.
You will access them in your custom default item slot.

If the default slot is not overridden, DashboardPanelItem component
is used so an items must look like:
```js static
const itemList = [
    {
        id: '1', // string or integer
        targetUrl: 'https://target.org', // the item element is a link to this URL
        avatarUrl: 'https://avatar.url/img.png', // used if avatarUsername is not defined
        avatarUsername: 'Robert', // used if avatarUrl is not defined
        overlayIconUrl: generateUrl('/svg/core/actions/sound?color=' + this.themingColor), // optional, small icon to display on the bottom-right corner of the avatar
        mainText: 'First item text',
        subText: 'First item subtext',
    },
    {
        id: '2',
        targetUrl: 'https://other-target.org',
        avatarUrl: 'https://other-avatar.url/img.png',
        overlayIconUrl: generateUrl('/svg/core/actions/add?color=' + this.themingColor),
        mainText: 'Second item text',
        subText: 'Second item subtext',
    },
]
```

### Item menu
You can optionally pass an object in the "itemMenu" prop to define a context
menu for each items. Each entry of this object must define "text" and "icon" properties.

When clicking the menu item, an event (named like the itemMenu key) will be emitted to the panel's parent.
```js static
const itemMenu = {
    'markDone': {
        text: t('app', 'Mark as done'),
        icon: 'icon-checkmark',
    },
    'hide': {
        text: t('app', 'Hide'),
        icon: 'icon-toggle',
    }
},
```

### All props
* showMore: A boolean to show a "show more" text on the panel's bottom
* loading: A boolean to put the panel in a loading state
* itemMenu: context menu entries for each items
* items: the items themselves

### Events
* moreClicked: The "show more" text was clicked
* for each menu item, an event named like its key is emitted with the item as a parameter

### Slots
* default (optional, default=DashboardPanelItem): The default slot can be optionnally overridden. It contains the template of one item.
* header (optional): Something to display on top of the panel
* empty-content (optional): What to display when the item list is empty
* footer (optional): Something to display

### Simplest example
```vue
<template>
    <DashboardPanel :items="items">
        <template v-slot:default="{ item }">
            {{ item.title }}
        </template>
    </DashboardPanel>
</template>

<script>
import DashboardPanel from '../components/DashboardPanel'
const myItems = [
    {
        title: 'first',
        content: 'blabla',
    },
    {
        title: 'second',
        content: 'fuzzfuzz',
    },
]

export default {
    name: 'Dashboard',
    props: [],
    components: {
        DashboardPanel,
    },
    data() {
        return {
            items: myItems
        }
    },
}
</script>
```

### Complete example
```vue
<template>
    <DashboardPanel :items="items"
        :showMore="true"
        @moreClicked="onMoreClick"
        @hide="onHide"
        @markDone="onMarkDone"
        :loading="state === 'loading'"
        >

        <template v-slot:empty-content>
            Nothing to display
        </template>
    </DashboardPanel>
</template>

<script>
import DashboardPanel from '../components/DashboardPanel'
const myItems = [
    {
        id: '1',
        targetUrl: 'https://target.org',
        avatarUrl: 'https://avatar.url/img.png',
        avatarUsername: 'Robert',
        overlayIconUrl: generateUrl('/svg/core/actions/sound?color=' + this.themingColor),
        mainText: 'First item text',
        subText: 'First item subtext',
    },
    {
        id: '2',
        targetUrl: 'https://other-target.org',
        avatarUrl: 'https://other-avatar.url/img.png',
        overlayIconUrl: generateUrl('/svg/core/actions/add?color=' + this.themingColor),
        mainText: 'Second item text',
        subText: 'Second item subtext',
    },
]

export default {
    name: 'Dashboard',
    props: [],
    components: {
        DashboardPanel,
    },
    data() {
        return {
            items: myItems,
            loading: true,
        }
    },
    methods: {
        onMoreClick() {
            console.log('more clicked')
            const win = window.open('https://wherever.you.want', '_blank')
            win.focus()
        },
        onHide(item) {
            console.log('user wants to hide item ' + item.id)
            // do what you want
        },
        onMarkDone(item) {
            console.log('user wants to mark item ' + item.id + ' as done')
            // do what you want
        },
    },
}
</script>
```
</docs>

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