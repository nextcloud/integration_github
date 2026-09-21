/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
	configureNextcloud,
	runOcc,
	startNextcloud,
	stopNextcloud,
	waitOnNextcloud,
} from '@nextcloud/e2e-test-server/docker'

async function stop() {
	process.stderr.write('Stopping Nextcloud server…\n')
	// locally the container is kept, so the next run starts without a cold boot
	if (process.env.CI) {
		await stopNextcloud()
	}
	process.exit(0)
}

process.on('SIGTERM', stop)
process.on('SIGINT', stop)

// BRANCH is the server branch to test against, e.g. master or stable33
const ip = await startNextcloud(process.env.BRANCH ?? 'master', true, { exposePort: 8081 })
await waitOnNextcloud(ip)
await configureNextcloud(['integration_github'])
await runOcc(['config:system:set', 'no_unsupported_browser_warning', '--value', 'true', '--type', 'boolean'])

process.stdout.write('Nextcloud ready at http://localhost:8081\n')

// stay alive, so Playwright can stop the server through the SIGTERM handler
while (true) {
	await new Promise((resolve) => setTimeout(resolve, 5000))
}
