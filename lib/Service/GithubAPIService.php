<?php
/**
 * Nextcloud - github
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier
 * @copyright Julien Veyssier 2020
 */

namespace OCA\Github\Service;

use OCP\IL10N;
use OCP\ILogger;
use OCP\Http\Client\IClientService;

class GithubAPIService {

    private $l10n;
    private $logger;

    /**
     * Service to make requests to Github v3 (JSON) API
     */
    public function __construct (
        string $appName,
        ILogger $logger,
        IL10N $l10n,
        IClientService $clientService
    ) {
        $this->appName = $appName;
        $this->l10n = $l10n;
        $this->logger = $logger;
        $this->clientService = $clientService;
        $this->client = $clientService->newClient();
    }

    public function getAvatar($url) {
        return $this->client->get($url)->getBody();
    }

    public function getNotifications($accessToken, $since = null, $participating = null) {
        $params = [];
        if (is_null($since)) {
            $twoWeeksEarlier = new \DateTime();
            $twoWeeksEarlier->sub(new \DateInterval('P14D'));
            $params['since'] = $twoWeeksEarlier->format('Y-m-d\TH:i:s\Z');
        } else {
            $params['since'] = $since;
        }
        if (!is_null($participating)) {
            $params['participating'] = $participating ? 'true' : 'false';
        }
        $result = $this->request($accessToken, 'notifications', $params);
        return $result;
    }

    public function unsubscribeNotification($accessToken, $id) {
        $params = [
            'ignored' => true
        ];
        $result = $this->request($accessToken, 'notifications/threads/' . $id . '/subscription', $params, 'PUT');
        return $result;
    }

    public function markNotificationAsRead($accessToken, $id) {
        $result = $this->request($accessToken, 'notifications/threads/' . $id, [], 'POST');
        return $result;
    }

    public function request($accessToken, $endPoint, $params = [], $method = 'GET') {
        try {
            $url = 'https://api.github.com/' . $endPoint;
            $options = [
                'headers' => [
                    'Authorization' => 'token ' . $accessToken,
                    'User-Agent' => 'Nextcloud Github integration'
                ],
            ];

            if (count($params) > 0) {
                if ($method === 'GET') {
                    $paramsContent = http_build_query($params);
                    $url .= '?' . $paramsContent;
                } else {
                    $options['body'] = json_encode($params);
                }
            }

            if ($method === 'GET') {
                $response = $this->client->get($url, $options);
            } else if ($method === 'POST') {
                $response = $this->client->post($url, $options);
            } else if ($method === 'PUT') {
                $response = $this->client->put($url, $options);
            } else if ($method === 'DELETE') {
                $response = $this->client->delete($url, $options);
            }
            $body = $response->getBody();
            $respCode = $response->getStatusCode();

            if ($respCode >= 400) {
                return $this->l10n->t('Bad credentials');
            } else {
                return json_decode($body, true);
            }
        } catch (\Exception $e) {
            $this->logger->warning('Github API error : '.$e, array('app' => $this->appName));
            return $e;
        }
    }

}
