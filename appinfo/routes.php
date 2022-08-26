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
		['name' => 'config#popupSuccessPage', 'url' => '/popup-success', 'verb' => 'GET'],

		['name' => 'githubAPI#getNotifications', 'url' => '/notifications', 'verb' => 'GET'],
		['name' => 'githubAPI#unsubscribeNotification', 'url' => '/notifications/{id}/unsubscribe', 'verb' => 'PUT'],
		['name' => 'githubAPI#markNotificationAsRead', 'url' => '/notifications/{id}/mark-read', 'verb' => 'PUT'],
		['name' => 'githubAPI#getAvatar', 'url' => '/avatar', 'verb' => 'GET'],
		// get user/issue/pr information
		['name' => 'githubAPI#getUserInfo', 'url' => '/users/{githubUserName}', 'verb' => 'GET'],
		['name' => 'githubAPI#getIssueInfo', 'url' => '/repos/{owner}/{repo}/issues/{issueNumber}', 'verb' => 'GET'],
		['name' => 'githubAPI#getIssueCommentInfo', 'url' => '/repos/{owner}/{repo}/issues/comments/{commentId}', 'verb' => 'GET'],
		['name' => 'githubAPI#getPrInfo', 'url' => '/repos/{owner}/{repo}/pulls/{prNumber}', 'verb' => 'GET'],
	]
];
