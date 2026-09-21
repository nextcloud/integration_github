/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineConfig, devices } from '@playwright/test'

// Runs against the test container started by playwright/start-server.mjs, with this app mounted.
// PLAYWRIGHT_BASE_URL runs against an existing instance instead, e.g.:
//   PLAYWRIGHT_BASE_URL=http://nextcloud.local npx playwright test
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8081'

export default defineConfig({
	testDir: './playwright',

	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	// the settings tests change shared state
	workers: 1,

	reporter: process.env.CI ? [['dot'], ['github'], ['html', { open: 'never' }]] : 'html',

	use: {
		baseURL: baseURL + '/index.php/',
		trace: 'on-first-retry',
		video: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
			command: 'node playwright/start-server.mjs',
			// wait for the ready line, the port opens before Nextcloud has finished booting
			wait: {
				stdout: /Nextcloud ready at/,
			},
			gracefulShutdown: {
				signal: 'SIGTERM',
				timeout: 10000,
			},
			// locally, reuse the container of a previous run
			reuseExistingServer: !process.env.CI,
			stdout: 'pipe',
			stderr: 'pipe',
			timeout: 5 * 60 * 1000,
		},
})
