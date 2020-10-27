<?php
/**
 * Nextcloud - github
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2020
 */

return [
    'routes' => [
        ['name' => 'config#oauthRedirect', 'url' => '/oauth-redirect', 'verb' => 'GET'],
        ['name' => 'config#setConfig', 'url' => '/config', 'verb' => 'PUT'],
        ['name' => 'config#setAdminConfig', 'url' => '/admin-config', 'verb' => 'PUT'],
        ['name' => 'githubAPI#getNotifications', 'url' => '/notifications', 'verb' => 'GET'],
        ['name' => 'githubAPI#unsubscribeNotification', 'url' => '/notifications/{id}/unsubscribe', 'verb' => 'PUT'],
        ['name' => 'githubAPI#markNotificationAsRead', 'url' => '/notifications/{id}/mark-read', 'verb' => 'PUT'],
        ['name' => 'githubAPI#getAvatar', 'url' => '/avatar', 'verb' => 'GET'],
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ]
];
