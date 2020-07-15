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

namespace OCA\Github\Controller;

use OCP\App\IAppManager;
use OCP\Files\IAppData;
use OCP\AppFramework\Http\DataDisplayResponse;

use OCP\IURLGenerator;
use OCP\IConfig;
use OCP\IServerContainer;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\RedirectResponse;

use OCP\AppFramework\Http\ContentSecurityPolicy;

use OCP\ILogger;
use OCP\IRequest;
use OCP\IDBConnection;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

class GithubAPIController extends Controller {


    private $userId;
    private $config;
    private $dbconnection;
    private $dbtype;

    public function __construct($AppName,
                                IRequest $request,
                                IServerContainer $serverContainer,
                                IConfig $config,
                                IAppManager $appManager,
                                IAppData $appData,
                                ILogger $logger,
                                IDBConnection $dbconnection,
                                $userId) {
        parent::__construct($AppName, $request);
        $this->userId = $userId;
        $this->appData = $appData;
        $this->serverContainer = $serverContainer;
        $this->config = $config;
        $this->logger = $logger;
        $this->dbconnection = $dbconnection;
        $this->accessToken = $this->config->getUserValue($this->userId, 'github', 'token', '');
        $this->githubUserid = $this->config->getUserValue($this->userId, 'github', 'githubUserid', '');
    }

    /**
     * get notification list
     * @NoAdminRequired
     */
    public function getNotifications($since = null) {
        try {
            $url = 'https://api.github.com/notifications?participating=true';
            if ($since !== null) {
                $url .= '&since=' . $since;
            }

            $options = array(
                'http' => array(
                    'header'  => 'Authorization: Basic ' . base64_encode($this->githubUserid.':'.$this->accessToken).
                        "\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
                    'method'  => 'GET',
                )
            );
            $context  = stream_context_create($options);
            $result = file_get_contents($url, false, $context);
            $jsonResult = json_decode($result, true);
        }
        catch (\Exception $e) {
            $this->logger->warning('Github API error : '.$e, array('app' => $this->appName));
        }
        $response = new DataResponse($jsonResult);
        return $response;
    }

}
