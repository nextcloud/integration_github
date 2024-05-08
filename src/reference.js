/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerWidget } from '@nextcloud/vue/dist/Components/NcRichText.js'
import { linkTo } from '@nextcloud/router'
import { getRequestToken } from '@nextcloud/auth'

__webpack_nonce__ = btoa(getRequestToken()) // eslint-disable-line
__webpack_public_path__ = linkTo('integration_github', 'js/') // eslint-disable-line

registerWidget('integration_github_issue_pr', async (el, { richObjectType, richObject, accessible }) => {
	const { default: Vue } = await import(/* webpackChunkName: "reference-issue-lazy" */'vue')
	const { default: GithubIssuePrReferenceWidget } = await import(/* webpackChunkName: "reference-issue-lazy" */'./views/GithubIssuePrReferenceWidget.vue')
	Vue.mixin({ methods: { t, n } })
	const Widget = Vue.extend(GithubIssuePrReferenceWidget)
	new Widget({
		propsData: {
			richObjectType,
			richObject,
			accessible,
		},
	}).$mount(el)
})

registerWidget('integration_github_code_permalink', async (el, { richObjectType, richObject, accessible }) => {
	const { default: Vue } = await import(/* webpackChunkName: "reference-permalink-lazy" */'vue')
	const { default: GithubCodePermalinkReferenceWidget } = await import(/* webpackChunkName: "reference-permalink-lazy" */'./views/GithubCodePermalinkReferenceWidget.vue')
	Vue.mixin({ methods: { t, n } })
	const Widget = Vue.extend(GithubCodePermalinkReferenceWidget)
	new Widget({
		propsData: {
			richObjectType,
			richObject,
			accessible,
		},
	}).$mount(el)
})
