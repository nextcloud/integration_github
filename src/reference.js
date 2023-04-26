/**
 * @copyright Copyright (c) 2022 Julien Veyssier <julien-nc@posteo.net>
 *
 * @author Julien Veyssier <julien-nc@posteo.net>
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

import { registerWidget } from '@nextcloud/vue/dist/Components/NcRichText.js'

__webpack_nonce__ = btoa(OC.requestToken) // eslint-disable-line
__webpack_public_path__ = OC.linkTo('integration_github', 'js/') // eslint-disable-line

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
