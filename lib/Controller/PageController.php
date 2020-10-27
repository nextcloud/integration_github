<?php
/**
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2019
 */

namespace OCA\Github\Controller;

use OCP\App\IAppManager;

use OCP\IURLGenerator;
use OCP\IConfig;
use \OCP\IL10N;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\RedirectResponse;

use OCP\AppFramework\Http\ContentSecurityPolicy;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;
use OCP\AppFramework\ApiController;
use OCP\Constants;
use OCP\Share;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IUserManager;
use OCP\Share\IManager;
use OCP\IServerContainer;
use OCP\IGroupManager;
use Psr\Log\LoggerInterface;
use OCP\IDBConnection;
use OCP\IInitialStateService;


class PageController extends ApiController {

    private $userId;
    private $userfolder;
    private $config;
    private $appVersion;
    private $shareManager;
    private $userManager;
    private $groupManager;
    private $dbconnection;
    private $dbtype;
    private $dbdblquotes;
    private $defaultDeviceId;
    private $trans;
    private $logger;
    protected $appName;

    public function __construct($AppName,
                                IRequest $request,
                                IServerContainer $serverContainer,
                                IConfig $config,
                                IManager $shareManager,
                                IAppManager $appManager,
                                IUserManager $userManager,
                                IGroupManager $groupManager,
                                IL10N $trans,
                                LoggerInterface $logger,
                                IInitialStateService $initialStateService,
                                IDBConnection $dbconnection,
                                $UserId){
        parent::__construct($AppName, $request,
                            'PUT, POST, GET, DELETE, PATCH, OPTIONS',
                            'Authorization, Content-Type, Accept',
                            1728000);
        $this->logger = $logger;
        $this->appName = $AppName;
        $this->userId = $UserId;
        $this->trans = $trans;
		$this->initialStateService = $initialStateService;
        $this->dbtype = $config->getSystemValue('dbtype');
        // IConfig object
        $this->config = $config;

        if ($this->dbtype === 'pgsql'){
            $this->dbdblquotes = '"';
        }
        else{
            $this->dbdblquotes = '`';
        }
        $this->dbconnection = $dbconnection;
        if ($UserId !== null and $UserId !== '' and $serverContainer !== null){
            // path of user files folder relative to DATA folder
            $this->userfolder = $serverContainer->getUserFolder($UserId);
        }
    }

    /**
     * Welcome page
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index() {
		$userConfig = [
			'token' => $token,
			'client_id' => $clientID,
			'client_secret' => $clientSecret,
			'search_issues_enabled' => ($searchIssuesEnabled === '1'),
			'search_repos_enabled' => ($searchReposEnabled === '1'),
			'user_name' => $userName,
		];
        $this->initialStateService->provideInitialState($this->appName, 'user-config', $userConfig);

        $params = [];
        $response = new TemplateResponse('integration_github', 'personalSettings', $params);
        $csp = new ContentSecurityPolicy();
        $csp->addAllowedImageDomain('*')
            ->addAllowedMediaDomain('*')
            //->addAllowedChildSrcDomain('*')
            ->addAllowedFrameDomain('*')
            ->addAllowedWorkerSrcDomain('*')
            //->allowInlineScript(true)
            ->allowEvalScript(true)
            ->addAllowedObjectDomain('*')
            ->addAllowedScriptDomain('*')
            ->addAllowedConnectDomain('*');
        $response->setContentSecurityPolicy($csp);
        return $response;
    }

}
