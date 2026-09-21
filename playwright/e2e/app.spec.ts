/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Page } from '@playwright/test'

import { login } from '@nextcloud/e2e-test-server/playwright'
import { test as base, expect } from '@playwright/test'

// the test container always has this admin user
const admin = { userId: 'admin', password: 'admin' }

// the dashboard widget learns from this 400 that no GitHub account is connected
const expectedFailures = ['400 GET /index.php/apps/integration_github/notifications']

// served as the repository owner avatar of mocked notifications
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')

// a notification as the app returns it for a connected account
const notification = {
	id: '243',
	unread: true,
	reason: 'mention',
	updated_at: '2026-09-18T10:00:00Z',
	subject: {
		title: 'Show the content of the dashboard widget again',
		url: 'https://api.github.com/repos/nextcloud/integration_github/issues/243',
		type: 'Issue',
	},
	repository: {
		name: 'integration_github',
		full_name: 'nextcloud/integration_github',
		owner: { login: 'nextcloud' },
	},
}

// Every test also fails on an uncaught exception, or on an unexpected failing request to one of the app's own routes.
// Errors of other apps on the instance are ignored on purpose.
const test = base.extend<{ appErrors: void }>({
	appErrors: [async ({ page }, use) => {
		const errors: string[] = []
		page.on('pageerror', (error) => errors.push(`uncaught: ${error.message}`))
		page.on('response', (response) => {
			const failure = `${response.status()} ${response.request().method()} ${new URL(response.url()).pathname}`
			if (response.status() >= 400 && response.url().includes('/integration_github/') && !expectedFailures.includes(failure)) {
				errors.push(failure)
			}
		})
		await use()
		expect(errors).toEqual([])
	}, { auto: true }],
})

/**
 * Flip a switch of the GitHub section, check that the new value survives a reload, then flip it back.
 *
 * @param page the page showing the section
 * @param label the text of the switch
 * @param route the app route that stores the value
 */
async function expectSwitchToBeSaved(page: Page, label: string, route: string) {
	const section = page.locator('#github_prefs')
	const toggle = async () => {
		const saved = page.waitForResponse((response) => response.url().includes(route))
		// the switch hides its input, so click the label
		await section.getByText(label, { exact: true }).click()
		expect((await saved).ok()).toBe(true)
	}

	const before = await section.getByLabel(label, { exact: true }).isChecked()
	await toggle()
	try {
		await page.reload()
		await expect(section.getByLabel(label, { exact: true })).toBeChecked({ checked: !before })
	} finally {
		await toggle()
	}
}

test.beforeEach(async ({ page }) => {
	await login(page.request, admin)
})

test.describe('Admin settings', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('settings/admin/connected-accounts')
	})

	test('show the GitHub section', async ({ page }) => {
		const section = page.locator('#github_prefs')
		await expect(section.getByRole('heading', { name: /GitHub integration/ })).toBeVisible()
		await expect(section.getByLabel('Client ID', { exact: true })).toBeVisible()
		await expect(section.getByLabel('Client secret', { exact: true })).toBeVisible()
		await expect(section.getByLabel('Default access token', { exact: true })).toBeVisible()
	})

	test('save the link preview setting', async ({ page }) => {
		await expectSwitchToBeSaved(page, 'Enable GitHub link previews', '/apps/integration_github/admin-config')
	})
})

test.describe('Personal settings', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('settings/user/connected-accounts')
	})

	test('show the GitHub section', async ({ page }) => {
		const section = page.locator('#github_prefs')
		await expect(section.getByRole('heading', { name: /GitHub integration/ })).toBeVisible()
		await expect(section.getByLabel('Enable navigation link', { exact: true })).toBeVisible()
	})

	test('save the link preview setting', async ({ page }) => {
		await expectSwitchToBeSaved(page, 'Enable GitHub link previews', '/apps/integration_github/config')
	})
})

test.describe('Dashboard widget', () => {
	test.beforeEach(async ({ page }) => {
		// show only the GitHub widget
		const layout = await page.request.post('../ocs/v2.php/apps/dashboard/api/v3/layout', {
			headers: { 'OCS-APIRequest': 'true' },
			data: { layout: ['github_notifications'] },
		})
		expect(layout.ok()).toBe(true)
	})

	test('ask to connect a GitHub account', async ({ page }) => {
		await page.goto('apps/dashboard/')
		const widget = page.locator('.panel').filter({ hasText: 'GitHub notifications' })
		await expect(widget.getByText('No GitHub account connected')).toBeVisible()
		await expect(widget.getByRole('button', { name: 'Connect to GitHub' })).toBeVisible()
	})

	test('list the notifications of a connected account', async ({ page }) => {
		// answer the way the app does for a connected account, the test container cannot reach GitHub
		await page.route('**/apps/integration_github/notifications**', (route) => route.fulfill({ json: [notification] }))
		await page.route('**/apps/integration_github/avatar/**', (route) => route.fulfill({ contentType: 'image/png', body: png }))
		await page.goto('apps/dashboard/')

		const widget = page.locator('.panel').filter({ hasText: 'GitHub notifications' })
		const item = widget.getByRole('link', { name: /Show the content of the dashboard widget again/ })
		await expect(item).toBeVisible()
		await expect(item).toHaveAttribute('href', 'https://github.com/nextcloud/integration_github/issues/243')
		await expect(widget.getByText('🗨 integration_github#243', { exact: true })).toBeVisible()
	})
})
