<template>
	<div>
		<button
			@click="onClick">
			plop
		</button>
		<dbp-file-source
			id="file-source"
			lang="en"
			enabled-sources="nextcloud"
			:dialog-open="dialogOpen"
			:nextcloud-auth-url="authUrl"
			:nextcloud-web-dav-url="davUrl" />
	</div>
</template>

<script>
// import '../ext/first/dbp-file-source'
// import '../ext/second/dbp-file-source'
import 'dbp-toolkit/packages/file-handling/dist/dbp-file-source'

export default {
	name: 'NcFilePicker',

	components: {
	},

	props: {
		ncUrl: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			dialogOpen: undefined,
		}
	},

	computed: {
		authUrl() {
			return this.ncUrl + '/index.php/apps/webapppassword'
		},
		davUrl() {
			return this.ncUrl + '/remote.php/dav/files'
		},
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onClick() {
			this.dialogOpen = ''
		},
	},
}
</script>

<style scoped lang="scss">
</style>
