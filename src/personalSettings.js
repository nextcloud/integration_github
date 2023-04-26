/**
 * Nextcloud - github
 *
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <julien-nc@posteo.net>
 * @copyright Julien Veyssier 2020
 */

import Vue from 'vue'
import './bootstrap.js'
import PersonalSettings from './components/PersonalSettings.vue'

const View = Vue.extend(PersonalSettings)
new View().$mount('#github_prefs')
