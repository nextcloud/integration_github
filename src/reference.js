/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerWidget } from '@nextcloud/vue/components/NcRichText'

registerWidget('integration_github_issue_pr', async (el, { richObjectType, richObject, accessible }) => {
	const { createApp } = await import('vue')
	const { default: GithubIssuePrReferenceWidget } = await import('./views/GithubIssuePrReferenceWidget.vue')

	const app = createApp(
		GithubIssuePrReferenceWidget,
		{
			richObjectType,
			richObject,
			accessible,
		},
	)
	app.mixin({ methods: { t, n } })
	app.mount(el)
}, () => {}, { hasInteractiveView: false })

registerWidget('integration_github_code_permalink', async (el, { richObjectType, richObject, accessible }) => {
	const { createApp } = await import('vue')
	const { default: GithubCodePermalinkReferenceWidget } = await import('./views/GithubCodePermalinkReferenceWidget.vue')

	const app = createApp(
		GithubCodePermalinkReferenceWidget,
		{
			richObjectType,
			richObject,
			accessible,
		},
	)
	app.mixin({ methods: { t, n } })
	app.mount(el)
}, () => {}, { hasInteractiveView: false })
