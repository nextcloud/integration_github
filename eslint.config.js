/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { recommendedJavascript } from '@nextcloud/eslint-config'

export default [
	...recommendedJavascript,
	{
		name: 'integration_github/rules',
		rules: {
			'jsdoc/require-jsdoc': 'off',
			'jsdoc/tag-lines': 'off',
			'no-console': ['error', { allow: ['error', 'warn', 'info', 'debug'] }],
			'vue/first-attribute-linebreak': 'off',
		},
	},
]
