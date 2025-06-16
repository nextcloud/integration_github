<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="reactions">
		<div v-for="(r, rKey) in displayedReactions"
			:key="rKey">
			<button class="reaction"
				:title="reactionDetailsByType[rKey]"
				@mouseenter="$emit('mouseenter')">
				<img :src="r.url">
				{{ r.count }}
			</button>
		</div>
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
		reactionData: {
			type: Array,
			default: () => null,
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
		reactionDetailsByType() {
			if (this.reactionData === null) {
				return {}
			}
			const byType = {}
			this.reactionData.forEach(reaction => {
				if (!byType[reaction.content]) {
					byType[reaction.content] = []
				}
				byType[reaction.content].push(reaction.user.login)
			})
			Object.keys(byType).forEach(rKey => {
				// TRANSLATORS this text is shown on the emoji icon hover tooltip, it is a list of users who reacted with this emoji (e.g. "user1, user2, user3 reacted with eyes emoji")
				byType[rKey] = t('integration_github', '{logins} reacted with {emoji} emoji', { logins: byType[rKey].join(', '), emoji: rKey })
			})
			console.debug('bytype', byType)
			return byType
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
	flex-wrap: wrap;
	.reaction {
		height: 26px;
		min-height: 26px;
		padding: 0 6px;
		margin-right: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: normal;
		img {
			width: 12px;
			height: 12px;
			margin-right: 4px;
		}
	}
}
</style>
