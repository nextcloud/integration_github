<?php
/**
 * Nextcloud - Github
 *
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2020
 */

namespace OCA\Github\AppInfo;

use OCP\IContainer;
use OCP\IUser;

use OCP\AppFramework\App;
use OCP\AppFramework\IAppContainer;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;

use OCA\Github\Dashboard\GithubWidget;
use OCA\Github\Search\GithubSearchProvider;

/**
 * Class Application
 *
 * @package OCA\Github\AppInfo
 */
class Application extends App implements IBootstrap {

	public const APP_ID = 'integration_github';

	/**
	 * Constructor
	 *
	 * @param array $urlParams
	 */
	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);

		$container = $this->getContainer();
	}

	public function register(IRegistrationContext $context): void {
		$context->registerDashboardWidget(GithubWidget::class);

		$config = $this->getContainer()->query(\OCP\IConfig::class);
		$context->registerSearchProvider(GithubSearchProvider::class);
	}

	public function boot(IBootContext $context): void {
	}
}

