/**
 * @copyright Copyright (c) 2022 Julien Veyssier <eneiluj@posteo.net>
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { registerWidget } from '@nextcloud/vue-richtext'
import './bootstrap.js'
import Vue from 'vue'
import GithubIssuePrReferenceWidget from './views/GithubIssuePrReferenceWidget.vue'
import GithubCodePermalinkReferenceWidget from './views/GithubCodePermalinkReferenceWidget.vue'

registerWidget('integration_github_issue_pr', (el, { richObjectType, richObject, accessible }) => {
	const Widget = Vue.extend(GithubIssuePrReferenceWidget)
	new Widget({
		propsData: {
			richObjectType,
			richObject,
			accessible,
		},
	}).$mount(el)
})

registerWidget('integration_github_code_permalink', (el, { richObjectType, richObject, accessible }) => {
	const Widget = Vue.extend(GithubCodePermalinkReferenceWidget)
	new Widget({
		propsData: {
			richObjectType,
			richObject,
			accessible,
		},
	}).$mount(el)
})
