<template>
	<div class="custom-github-issue-picker-element">
		<NcButton @click="onSubmit">
			custom
		</NcButton>
	</div>
</template>

<script>
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'

export default {
	name: 'GithubIssuePrCustomPickerElement',

	components: {
		NcButton,
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
	},

	methods: {
		onSubmit() {
			console.debug('in github, submit', 'Custom picker result for ' + this.providerId)
			this.$emit('submit', 'Custom picker result for the "' + this.providerId + '" provider')
		},
	},
}
</script>

<style scoped lang="scss">
.custom-github-issue-picker-element {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
