/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Page } from '@playwright/test'

import { login } from '@nextcloud/e2e-test-server/playwright'
import { test as base, expect } from '@playwright/test'

// the test container always has this admin user
const admin = { userId: 'admin', password: 'admin' }
const ocs = { 'OCS-APIRequest': 'true', Accept: 'application/json' }

// served as the avatar of the mocked author
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')

// an issue as the app puts it into the rich object of a link preview
const issue = {
	github_type: 'issue',
	github_repo_owner: 'nextcloud',
	github_repo: 'integration_github',
	github_issue_id: '243',
	id: 243,
	number: 243,
	title: 'The dashboard widget stays empty',
	html_url: 'https://github.com/nextcloud/integration_github/issues/243',
	state: 'closed',
	state_reason: 'completed',
	comments: 2,
	created_at: '2026-09-18T10:00:00Z',
	updated_at: '2026-09-18T11:00:00Z',
	user: { login: 'janedoe' },
	labels: [{ name: 'bug', color: 'd73a4a' }],
	assignees: [],
	reactions: { total_count: 0 },
}

// a code permalink as the app puts it into the rich object of a link preview
const permalink = {
	github_type: 'code',
	owner: 'nextcloud',
	repo: 'integration_github',
	filePath: 'src/reference.js',
	link: 'https://github.com/nextcloud/integration_github/blob/5f3c2a1/src/reference.js#L10-L12',
	html_url: 'https://github.com/nextcloud/integration_github/blob/5f3c2a1/src/reference.js#L10-L12',
	ref: { original_ref: 'main', sha: '5f3c2a1b8d4e6f7a9c0b1d2e3f4a5b6c7d8e9f01' },
	lineBegin: 10,
	lineEnd: 12,
	lines: ['const first = 1', 'const second = 2', 'const third = 3'],
}

// Every test also fails on an uncaught exception, or on an unexpected failing request to one of the app's own routes.
// Errors of other apps on the instance are ignored on purpose.
const test = base.extend<{ appErrors: void }>({
	appErrors: [async ({ page }, use) => {
		const errors: string[] = []
		page.on('pageerror', (error) => errors.push(`uncaught: ${error.message}`))
		page.on('response', (response) => {
			if (response.status() >= 400 && response.url().includes('/integration_github/')) {
				errors.push(`${response.status()} ${response.request().method()} ${new URL(response.url()).pathname}`)
			}
		})
		await use()
		expect(errors).toEqual([])
	}, { auto: true }],
})

/**
 * Load the reference bundle of the app and render one of its widgets, the way Nextcloud does
 * wherever a link preview appears.
 *
 * @param page a page of a logged in user
 * @param type the rich object type of the widget
 * @param richObject the rich object to render
 */
async function renderReferenceWidget(page: Page, type: string, richObject: object) {
	// the widget asks the app for the avatar of a GitHub user, which needs an account
	await page.route('**/apps/integration_github/avatar**', (route) => route.fulfill({ contentType: 'image/png', body: png }))
	await page.goto('apps/files/')
	const registered = await page.evaluate(async ([widgetType, object]) => {
		const globals = window as unknown as {
			OC: { appswebroots: Record<string, string> }
			_vue_richtext_widgets: Record<string, { callback: (element: HTMLElement, data: object) => void }>
		}
		await import(/* @vite-ignore */ `${globals.OC.appswebroots.integration_github}/js/integration_github-reference.mjs`)
		const element = document.createElement('div')
		element.id = 'reference-widget'
		document.body.appendChild(element)
		globals._vue_richtext_widgets[widgetType as string].callback(element, {
			richObjectType: widgetType,
			richObject: object,
			accessible: false,
		})
		return Object.keys(globals._vue_richtext_widgets)
	}, [type, richObject] as [string, object])
	expect(registered).toEqual(expect.arrayContaining(['integration_github_issue_pr', 'integration_github_code_permalink']))
	return page.locator('#reference-widget')
}

test.beforeEach(async ({ page }) => {
	await login(page.request, admin)
})

test.describe('Link previews', () => {
	test('offer the providers to the smart picker', async ({ page }) => {
		const response = await page.request.get('../ocs/v2.php/references/providers', { headers: ocs })
		expect(response.ok()).toBe(true)
		const providers = (await response.json()).ocs.data as Array<{ id: string, title: string, icon_url: string }>
		const expected = {
			'github-issue-pr': 'GitHub issues, pull requests and comments',
			'github-permalink': 'GitHub code permalink',
		}
		for (const [id, title] of Object.entries(expected)) {
			const provider = providers.find((candidate) => candidate.id === id)
			expect(provider, `provider ${id}`).toBeDefined()
			expect(provider?.title).toBe(title)
			// the provider icon is served by the app
			expect((await page.request.get(provider!.icon_url)).ok()).toBe(true)
		}
	})

	test('render an issue in the reference widget', async ({ page }) => {
		const widget = await renderReferenceWidget(page, 'integration_github_issue_pr', issue)

		const link = widget.getByRole('link', { name: issue.title })
		await expect(link).toBeVisible()
		await expect(link).toHaveAttribute('href', issue.html_url)
		await expect(widget.getByText('nextcloud/integration_github #243')).toBeVisible()
		await expect(widget.getByText('by janedoe')).toBeVisible()
		await expect(widget.getByText('bug', { exact: true })).toBeVisible()
	})

	test('render a code permalink in the reference widget', async ({ page }) => {
		const widget = await renderReferenceWidget(page, 'integration_github_code_permalink', permalink)

		await expect(widget.getByText('nextcloud/integration_github/src/reference.js')).toBeVisible()
		await expect(widget.getByText('Line 10 to 12')).toBeVisible()
		await expect(widget.getByText('const second = 2')).toBeVisible()
	})
})

test.describe('Search providers', () => {
	test('offer the providers to unified search', async ({ page }) => {
		const response = await page.request.get('../ocs/v2.php/search/providers', { headers: ocs })
		expect(response.ok()).toBe(true)
		const providers = (await response.json()).ocs.data as Array<{ id: string, appId: string, name: string }>
		const expected = {
			'github-search-issues': 'GitHub issues and pull requests',
			'github-search-repos': 'GitHub repositories',
		}
		for (const [id, name] of Object.entries(expected)) {
			expect(providers.find((candidate) => candidate.id === id), `provider ${id}`).toMatchObject({
				appId: 'integration_github',
				name,
			})
		}
	})

	test('answer an empty result for a user without a GitHub account', async ({ page }) => {
		for (const id of ['github-search-issues', 'github-search-repos']) {
			const response = await page.request.get(`../ocs/v2.php/search/providers/${id}/search?term=nextcloud`, { headers: ocs })
			expect(response.ok(), id).toBe(true)
			expect((await response.json()).ocs.data.entries, id).toEqual([])
		}
	})
})
