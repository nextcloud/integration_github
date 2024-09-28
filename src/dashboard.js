/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

document.addEventListener('DOMContentLoaded', () => {
	OCA.Dashboard.register('github_notifications', async (el, { widget }) => {
		const { default: Vue } = await import('vue')
		const { default: Dashboard } = await import('./views/Dashboard.vue')
		Vue.mixin({ methods: { t, n } })
		const View = Vue.extend(Dashboard)
		new View({
			propsData: { title: widget.title },
		}).$mount(el)
	})
})
