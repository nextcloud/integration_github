<template>
	<div style="display: flex; align-items: center;">
		Reference picker example:
		<!-- eslint-disable vue/valid-v-on -->
		<textarea ref="out-text-editor"
			v-model="textContent"
			:placeholder="placeholder"
			style="width: unset;"
			rows="10"
			cols="50"
			@keydown.hash="onHashKeydown" />
		<NcButton v-tooltip.top="{ content: 'Open link picker' }"
			@click="onButtonClick">
			<template #icon>
				<LinkVariantIcon />
			</template>
		</NcButton>
		<ReferencePicker v-if="showRefPicker"
			:width="500"
			:focus-on-create="true"
			@submit="onLinkSubmit"
			@cancel-search="onCancelSearch"
			@cancel-raw-link="onCancelRawLink"
			@cancel-provider-select="onCancelProviderSelect" />
	</div>
</template>

<script>
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'

import { ReferencePicker } from '@nextcloud/vue-richtext'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'

import { showSuccess } from '@nextcloud/dialogs'

import Vue from 'vue'
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'

Vue.config.keyCodes.hash = 51
Vue.directive('tooltip', Tooltip)

export default {
	name: 'ReferenceTextareaTest',

	components: {
		ReferencePicker,
		NcButton,
		LinkVariantIcon,
	},

	props: {
	},

	data() {
		return {
			placeholder: 'The reference picker will pop if you type the "#" character',
			showRefPicker: false,
			textContent: '',
		}
	},

	computed: {
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		focusOnText() {
			this.$nextTick(() => {
				this.$refs['out-text-editor']?.focus()
			})
		},
		onLinkSubmit(link) {
			if (this.textContent.endsWith(' ')) {
				this.textContent = this.textContent + link
			} else {
				this.textContent = this.textContent + ' ' + link
			}

			this.showRefPicker = false
			this.focusOnText()
		},
		onCancelProviderSelect() {
			showSuccess('[GitHub] provider selection canceled')
			this.showRefPicker = false
			this.focusOnText()
		},
		onCancelSearch(title) {
			showSuccess('[GitHub] search canceled (' + title + ')')
		},
		onCancelRawLink(title) {
			showSuccess('[GitHub] raw link input canceled (' + title + ')')
		},
		onKeydown(e) {
			console.debug('on key down', e)
			// if key is not select by a key modifier, it is still possible with the pure keydown event:
			if (e.key === '#') {
				e.preventDefault()
				this.showRefPicker = true
			}
		},
		onButtonClick() {
			this.showRefPicker = true
		},
		onHashKeydown(e) {
			console.debug('on hash key down', e)
			e.preventDefault()
			this.showRefPicker = true
		},
	},
}
</script>

<style scoped lang="scss">
// nope
</style>
