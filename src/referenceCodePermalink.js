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

import { registerWidget, registerCustomPickerElement, CustomPickerRenderResult } from '@nextcloud/vue-richtext'
import './bootstrap.js'
import Vue from 'vue'
import GithubCodePermalinkReferenceWidget from './views/GithubCodePermalinkReferenceWidget.vue'
// import GithubIssuePrCustomPickerElement from './views/GithubIssuePrCustomPickerElement.vue'
import FileReferencePickerElement from './views/FileReferencePickerElement.vue'

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

/*
registerCustomPickerElement('github-permalink', (el, { providerId, accessible }) => {
	const Element = Vue.extend(GithubIssuePrCustomPickerElement)
	const vueElement = new Element({
		propsData: {
			providerId,
			accessible,
		},
	}).$mount(el)
	return new CustomPickerRenderResult(vueElement.$el, vueElement)
}, (el, renderResult) => {
	console.debug('github-permalink custom destroy callback. el', el, 'renderResult:', renderResult)
	renderResult.object.$destroy()
})
*/

registerCustomPickerElement('files-files', (el, { providerId, accessible }) => {
	const Element = Vue.extend(FileReferencePickerElement)
	const vueElement = new Element({
		propsData: {
			providerId,
			accessible,
		},
	}).$mount(el)
	return new CustomPickerRenderResult(vueElement.$el, vueElement)
}, (el, renderResult) => {
	console.debug('file custom destroy callback. el', el, 'renderResult:', renderResult)
	renderResult.object.$destroy()
})
