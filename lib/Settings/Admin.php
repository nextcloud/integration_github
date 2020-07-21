<?php
namespace OCA\Github\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IL10N;
use OCP\IConfig;
use OCP\Settings\ISettings;
use OCP\Util;
use OCP\IURLGenerator;
use OCP\IInitialStateService;

class Admin implements ISettings {

    private $request;
    private $config;
    private $dataDirPath;
    private $urlGenerator;
    private $l;

    public function __construct(
                        string $appName,
                        IL10N $l,
                        IRequest $request,
                        IConfig $config,
                        IURLGenerator $urlGenerator,
                        IInitialStateService $initialStateService,
                        $userId) {
        $this->appName = $appName;
        $this->urlGenerator = $urlGenerator;
        $this->request = $request;
        $this->l = $l;
        $this->config = $config;
        $this->initialStateService = $initialStateService;
        $this->userId = $userId;
    }

    /**
     * @return TemplateResponse
     */
    public function getForm() {
        $clientID = $this->config->getAppValue('github', 'client_id', '');
        $clientSecret = $this->config->getAppValue('github', 'client_secret', '');

        $adminConfig = [
            'client_id' => $clientID,
            'client_secret' => $clientSecret
        ];
        $this->initialStateService->provideInitialState($this->appName, 'admin-config', $adminConfig);
        return new TemplateResponse('github', 'adminSettings');
    }

    public function getSection() {
        return 'linked-accounts';
    }

    public function getPriority() {
        return 10;
    }
}
