<?php
/**
 * Nextcloud - Github
 *
 *
 * @author Julien Veyssier <julien-nc@posteo.net>
 * @copyright Julien Veyssier 2020
 */

namespace OCA\Github\AppInfo;

use OCA\Github\Dashboard\GithubWidget;
use OCA\Github\Listener\ContentSecurityPolicyListener;
use OCA\Github\Listener\GithubReferenceListener;
use OCA\Github\Reference\GithubCodeReferenceProvider;
use OCA\Github\Reference\GithubIssuePrReferenceProvider;
use OCA\Github\Search\GithubSearchIssuesProvider;
use OCA\Github\Search\GithubSearchReposProvider;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

use OCP\Collaboration\Reference\RenderReferenceEvent;

use OCP\IConfig;
use OCP\IL10N;
use OCP\INavigationManager;

use OCP\IURLGenerator;
use OCP\IUserSession;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;
use Psr\Container\ContainerInterface;

class Application extends App implements IBootstrap {

	public const APP_ID = 'integration_github';

	private ContainerInterface $container;
	private IConfig $config;

	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);

		$this->container = $this->getContainer();
		$this->config = $this->container->get(IConfig::class);
	}

	public function register(IRegistrationContext $context): void {
		if ($this->config->getAppValue(self::APP_ID, 'dashboard_enabled', '1') === '1') {
			$context->registerDashboardWidget(GithubWidget::class);
		}

		$context->registerSearchProvider(GithubSearchIssuesProvider::class);
		$context->registerSearchProvider(GithubSearchReposProvider::class);

		$context->registerReferenceProvider(GithubIssuePrReferenceProvider::class);
		$context->registerReferenceProvider(GithubCodeReferenceProvider::class);
		$context->registerEventListener(RenderReferenceEvent::class, GithubReferenceListener::class);
		$context->registerEventListener(AddContentSecurityPolicyEvent::class, ContentSecurityPolicyListener::class);
	}

	public function boot(IBootContext $context): void {
		$context->injectFn(\Closure::fromCallable([$this, 'registerNavigation']));
	}

	public function registerNavigation(IUserSession $userSession): void {
		$user = $userSession->getUser();
		if ($user !== null) {
			$userId = $user->getUID();
			$container = $this->container;

			if ($this->config->getUserValue($userId, self::APP_ID, 'navigation_enabled', '0') === '1') {
				$container->get(INavigationManager::class)->add(static function () use ($container) {
					$urlGenerator = $container->get(IURLGenerator::class);
					$l10n = $container->get(IL10N::class);
					return [
						'id' => self::APP_ID,
						'order' => 10,
						'href' => 'https://github.com',
						'target' => '_blank',
						'icon' => $urlGenerator->imagePath(self::APP_ID, 'app.svg'),
						'name' => $l10n->t('GitHub'),
					];
				});
			}
		}
	}
}
