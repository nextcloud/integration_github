<template>
	<div>
		<button
			@click="onClick">
			plop
		</button>
	</div>
</template>

<script>
// import '../ext/first/dbp-file-source'
// import '../ext/ddd/local/dbp-file-source/tabulator-tables/css/tabulator.min.css'
// import '../ext/ddd/dbp-file-source'
// import '../ext/dddsrc/dbp-file-source'
// import 'dbp-toolkit/packages/file-handling/dist/dbp-file-source'
// import createClient from 'webdav'
// const { createClient } = require("webdav")
import { createClient } from 'webdav/web'

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

	async mounted() {
		const client = createClient(
			this.davUrl + '/julien',
			{
				username: 'julien',
				password: '',
			}
		)
		const directoryItems = await client.getDirectoryContents('/')
		console.debug(directoryItems)
	},

	methods: {
		onClick() {
			this.dialogOpen = ''
		},
	},
}
</script>
