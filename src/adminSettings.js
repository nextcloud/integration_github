/*jshint esversion: 6 */

/**
 * Nextcloud - github
 *
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2020
 */

import Vue from 'vue'
import './bootstrap'
import AdminSettings from './components/AdminSettings'

'use strict'

new Vue({
    el: "#github_prefs",
    render: h => h(AdminSettings),
})