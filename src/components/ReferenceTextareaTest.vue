<template>
	<div style="display: flex; align-items: center; margin: 600px 0;">
		<div id="inputs">
			<!-- eslint-disable vue/valid-v-on -->
			<textarea ref="out-text-editor"
				v-model="textContent"
				:placeholder="placeholder"
				style="width: unset;"
				rows="20"
				cols="50"
				@keydown.hash="onHashKeydown" />
			<!--NcRichContenteditableLink
				:value.sync="textContent"
				:auto-complete="autoComplete"
				:user-data="{}"
				placeholder="super placeholder for NcRichContenteditableLink"
				@submit="onRCESubmit" /-->
			<NcRichContenteditable
				:value.sync="textContent"
				:auto-complete="autoComplete"
				:user-data="{}"
				placeholder="super placeholder for NcRichContenteditable"
				@submit="onRCESubmit" />
		</div>
		<NcButton v-tooltip.top="{ content: 'Open link picker' }"
			@click="onButtonClick">
			<template #icon>
				<LinkVariantIcon />
			</template>
		</NcButton>
		<NcButton v-tooltip.top="{ content: 'Open link picker modal' }"
			@click="onModalButtonClick">
			<template #icon>
				<LinkVariantIcon />
			</template>
		</NcButton>
		<div v-if="showRefPicker" class="resizable">
			<ReferencePicker
				:focus-on-create="true"
				@submit="onLinkSubmit"
				@cancel-search="onCancelSearch"
				@cancel-raw-link="onCancelRawLink"
				@cancel="onCancelProviderSelect" />
		</div>
		<ReferencePickerModal v-if="showRefPickerModal"
			:focus-on-create="true"
			@submit="onLinkSubmit"
			@cancel="onCancelModal" />
	</div>
</template>

<script>
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'

import { ReferencePicker, ReferencePickerModal } from '@nextcloud/vue-richtext'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
// import { NcRichContenteditableLink } from '@nextcloud/vue/dist/Components/NcRichContenteditable.js'
import NcRichContenteditable from '@nextcloud/vue/dist/Components/NcRichContenteditable.js'

import Vue from 'vue'
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'

Vue.config.keyCodes.hash = 51
Vue.directive('tooltip', Tooltip)

export default {
	name: 'ReferenceTextareaTest',

	components: {
		ReferencePicker,
		ReferencePickerModal,
		NcButton,
		LinkVariantIcon,
		NcRichContenteditable,
		// NcRichContenteditableLink,
	},

	props: {
	},

	data() {
		return {
			placeholder: 'The reference picker will pop if you type the "#" character',
			showRefPicker: false,
			showRefPickerModal: false,
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
		onRCESubmit() {
			console.debug('RCE submit', this.textContent)
		},
		autoComplete(search, callback) {
			const values = []
			callback(values)
		},
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
			this.showRefPickerModal = false
			this.focusOnText()
		},
		onCancelProviderSelect() {
			// showSuccess('[GitHub] provider selection canceled')
			this.showRefPicker = false
			this.focusOnText()
		},
		onCancelModal() {
			this.showRefPickerModal = false
		},
		onCancelSearch(title) {
			// showSuccess('[GitHub] search canceled (' + title + ')')
		},
		onCancelRawLink(title) {
			// showSuccess('[GitHub] raw link input canceled (' + title + ')')
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
			this.showRefPicker = !this.showRefPicker
		},
		onModalButtonClick() {
			this.showRefPickerModal = true
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
#inputs {
	display: flex;
	flex-direction: column;
}

.resizable {
	border: 2px solid var(--color-border);
	width: 400px;
	resize: horizontal;
	overflow: auto;
	height: 350px;
}
</style>
