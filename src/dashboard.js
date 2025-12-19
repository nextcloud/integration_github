/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

document.addEventListener('DOMContentLoaded', () => {
	OCA.Dashboard.register('github_notifications', async (el, { widget }) => {
		const { createApp } = await import('vue')
		const { default: Dashboard } = await import('./views/Dashboard.vue')
		const app = createApp(Dashboard, {
			title: widget.title,
		})
		app.mixin({ methods: { t, n } })
		app.mount(el)
	})
})
