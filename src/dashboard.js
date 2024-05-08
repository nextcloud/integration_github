/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { linkTo } from '@nextcloud/router'
import { getRequestToken } from '@nextcloud/auth'

__webpack_nonce__ = btoa(getRequestToken()) // eslint-disable-line
__webpack_public_path__ = linkTo('integration_github', 'js/') // eslint-disable-line

document.addEventListener('DOMContentLoaded', () => {
	OCA.Dashboard.register('github_notifications', async (el, { widget }) => {
		const { default: Vue } = await import(/* webpackChunkName: "dashboard-lazy" */'vue')
		const { default: Dashboard } = await import(/* webpackChunkName: "dashboard-lazy" */'./views/Dashboard.vue')
		Vue.mixin({ methods: { t, n } })
		const View = Vue.extend(Dashboard)
		new View({
			propsData: { title: widget.title },
		}).$mount(el)
	})
})
