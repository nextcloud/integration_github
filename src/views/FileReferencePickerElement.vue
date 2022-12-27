<template>
	<div />
</template>

<script>
import { FilePicker, FilePickerType } from '@nextcloud/dialogs'
import { generateUrl } from '@nextcloud/router'

export default {
	name: 'FileReferencePickerElement',

	components: {
	},

	props: {
		providerId: {
			type: String,
			required: true,
		},
		accessible: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
		}
	},

	computed: {
	},

	watch: {
	},

	mounted() {
		this.openFilePicker()
		window.addEventListener('click', this.onWindowClick)
	},

	beforeDestroy() {
		window.removeEventListener('click', this.onWindowClick)
	},

	methods: {
		onWindowClick(e) {
			if (e.target.tagName === 'A' && e.target.classList.contains('oc-dialog-close')) {
				this.$emit('cancel')
				// this also works
				// const evt = new CustomEvent('cancel')
				// this.$el.dispatchEvent(evt)
			}
		},
		openFilePicker() {
			const filePicker = new FilePicker(
				'Select file or folder to link to',
				false, // multiselect
				[], // mime filter
				true, // modal
				FilePickerType.Choose, // type
				true, // directories
				'' // path
			)

			filePicker.pick()
				.then((file) => {
					const client = OC.Files.getClient()
					client.getFileInfo(file).then((_status, fileInfo) => {
						this.submit(fileInfo.id)
					})
				})
				.catch((error) => {
					console.debug('EROROROROR', error)
				})
				.then(() => {
					console.debug('FINAL then')
				})
		},
		submit(fileId) {
			const fileLink = window.location.protocol + '//' + window.location.host
				+ generateUrl('/f/{fileId}', { fileId })
			this.$emit('submit', fileLink)
			// const evt = new CustomEvent('submit', { detail: fileLink })
			// this.$el.dispatchEvent(evt)
		},
	},
}
</script>

<style scoped lang="scss">
// nothing yet
</style>
