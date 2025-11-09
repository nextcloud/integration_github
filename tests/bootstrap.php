<?php

require_once __DIR__ . '/../../../tests/bootstrap.php';

use OCP\App\IAppManager;

\OC::$server->get(IAppManager::class)->loadApps();
OC_Hook::clear();
