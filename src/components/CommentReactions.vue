<template>
	<div class="reactions">
		<button v-for="(r, rKey) in displayedReactions"
			:key="rKey"
			class="reaction"
			@mouseenter="$emit('mouseenter')">
			<img :src="r.url">
			{{ r.count }}
		</button>
	</div>
</template>

<script>
import { imagePath } from '@nextcloud/router'

export default {
	name: 'CommentReactions',

	components: {
	},

	props: {
		reactions: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			availableReactions: {
				'+1': imagePath('integration_github', 'reactions/plus1.png'),
				'-1': imagePath('integration_github', 'reactions/minus1.png'),
				laugh: imagePath('integration_github', 'reactions/laugh.png'),
				hooray: imagePath('integration_github', 'reactions/tada.png'),
				confused: imagePath('integration_github', 'reactions/confused.png'),
				heart: imagePath('integration_github', 'reactions/heart.png'),
				rocket: imagePath('integration_github', 'reactions/rocket.png'),
				eyes: imagePath('integration_github', 'reactions/eyes.png'),
			},
		}
	},

	computed: {
		displayedReactions() {
			const result = {}
			Object.keys(this.availableReactions).forEach(rKey => {
				if (this.reactions[rKey] > 0) {
					result[rKey] = {
						url: this.availableReactions[rKey],
						count: this.reactions[rKey],
					}
				}
			})
			return result
		},
	},

	watch: {
	},

	mounted() {
	},

	methods: {
	},
}
</script>

<style scoped lang="scss">
.reactions {
	display: flex;
	align-items: center;
	.reaction {
		width: 42px;
		height: 26px;
		min-height: 26px;
		padding: 0;
		margin-right: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: normal;
		img {
			width: 12px;
			height: 12px;
			margin-right: 6px;
		}
	}
}
</style>
