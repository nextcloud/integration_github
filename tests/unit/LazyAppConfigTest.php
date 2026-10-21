<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Unit;

use OC\Collaboration\Reference\ReferenceManager;
use OCA\Github\AppInfo\Application;
use OCA\Github\Controller\ConfigController;
use OCA\Github\Dashboard\GithubWidget;
use OCA\Github\Notification\GitHubNotifier;
use OCA\Github\Reference\GithubCodeReferenceProvider;
use OCA\Github\Reference\GithubIssuePrReferenceProvider;
use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCA\Github\Settings\Admin;
use OCA\Github\Settings\Personal;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http;
use OCP\AppFramework\Services\IAppConfig;
use OCP\AppFramework\Services\IInitialState;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\IUserManager;
use OCP\Notification\IManager;
use OCP\Security\ICrypto;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use ReflectionClass;
use ReflectionProperty;

/**
 * Pins the lazy flag of every app config read and write.
 *
 * A lazy key read without lazy: true returns the default, and a write without it makes
 * the key non-lazy again, so every call for a key has to pass the same flag. Only
 * dashboard_enabled and issue_notifications_enabled are read on every request, in
 * Application::register(), and stay non-lazy.
 */
class LazyAppConfigTest extends TestCase {

	/** The default every read of a key passes, as on main */
	private const DEFAULTS = [
		'client_id' => '',
		'client_secret' => '',
		'default_link_token' => '',
		'allow_default_link_token_to_anonymous' => '0',
		'allow_default_link_token_to_guests' => '0',
		'user_name' => '',
		'user_displayname' => '',
		'use_popup' => '0',
		'link_preview_enabled' => '1',
		'dashboard_enabled' => '1',
		'issue_notifications_enabled' => '1',
	];

	/** @var array<string, string> */
	private array $stored = [];
	/** @var array<string, list<bool>> the lazy flag of each read, by key */
	private array $reads = [];
	/** @var array<string, list<bool>> the lazy flag of each write, by key */
	private array $writes = [];
	/** @var list<string> */
	private array $deletes = [];
	/** @var list<array{string, string}> the key and the default of each read */
	private array $readDefaults = [];
	/** @var list<array{string, bool}> the key and the sensitive flag of each write */
	private array $writeSensitive = [];
	/** @var array<string, string> */
	private array $userValues = [];

	private IAppConfig&MockObject $appConfig;
	private IConfig&MockObject $config;
	private IUserManager&MockObject $userManager;
	private SecretService $secretService;

	protected function setUp(): void {
		parent::setUp();

		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->appConfig->method('getAppValueString')
			->willReturnCallback(function (string $key, string $default = '', bool $lazy = false): string {
				// asserted in assertPostConditions(), where no catch in the code under test can swallow it
				$this->readDefaults[] = [$key, $default];
				$this->reads[$key][] = $lazy;
				return $this->stored[$key] ?? $default;
			});
		$this->appConfig->method('setAppValueString')
			->willReturnCallback(function (string $key, string $value, bool $lazy = false, bool $sensitive = false): bool {
				$this->writeSensitive[] = [$key, $sensitive];
				$this->writes[$key][] = $lazy;
				$this->stored[$key] = $value;
				return true;
			});
		$this->appConfig->method('deleteAppValue')
			->willReturnCallback(function (string $key): void {
				$this->deletes[] = $key;
				unset($this->stored[$key]);
			});
		// the untyped methods always read and write non-lazy
		$this->appConfig->expects($this->never())->method('getAppValue');
		$this->appConfig->expects($this->never())->method('setAppValue');

		$this->config = $this->createMock(IConfig::class);
		$this->config->method('getUserValue')->willReturnCallback(
			fn (string $userId, string $appName, string $key, mixed $default = ''): mixed => $this->userValues[$key] ?? $default
		);
		// what the server returns for a lazy key read through the legacy API
		$this->config->method('getAppValue')->willReturnCallback(
			static fn (string $appName, string $key, mixed $default = ''): mixed => $default
		);
		// a legacy write makes the key non-lazy again
		$this->config->expects($this->never())->method('setAppValue');
		$this->config->expects($this->never())->method('deleteAppValue');
		$this->userManager = $this->createMock(IUserManager::class);

		$crypto = $this->createMock(ICrypto::class);
		$crypto->method('encrypt')->willReturnCallback(static fn (string $value): string => 'encrypted:' . $value);
		$crypto->method('decrypt')->willReturnCallback(static fn (string $value): string => substr($value, strlen('encrypted:')));

		$this->secretService = new SecretService(
			$this->config,
			$this->appConfig,
			$this->userManager,
			$crypto,
			$this->createMock(LoggerInterface::class),
		);
	}

	/**
	 * Every read passes the default main passed, and no write marks a value sensitive.
	 */
	protected function assertPostConditions(): void {
		foreach ($this->readDefaults as [$key, $default]) {
			$this->assertArrayHasKey($key, self::DEFAULTS);
			$this->assertSame(self::DEFAULTS[$key], $default, 'default of ' . $key);
		}
		foreach ($this->writeSensitive as [$key, $sensitive]) {
			$this->assertFalse($sensitive, 'sensitive flag of ' . $key);
		}
	}

	public function testRegisterReadsTheDashboardAndNotificationTogglesNonLazy(): void {
		$application = (new ReflectionClass(Application::class))->newInstanceWithoutConstructor();
		(new ReflectionProperty(Application::class, 'config'))->setValue($application, $this->config);
		(new ReflectionProperty(Application::class, 'appConfig'))->setValue($application, $this->appConfig);
		$context = $this->createMock(IRegistrationContext::class);
		$context->expects($this->once())->method('registerDashboardWidget')->with(GithubWidget::class);
		$context->expects($this->once())->method('registerNotifierService')->with(GitHubNotifier::class);

		$application->register($context);

		$this->assertEquals([
			'dashboard_enabled' => [false],
			'issue_notifications_enabled' => [false],
		], $this->reads);
	}

	public function testAdminTogglesAreStoredLazilyExceptTheOnesReadOnEveryRequest(): void {
		$controller = $this->createConfigController($this->createMock(GithubAPIService::class));

		$response = $controller->setAdminConfig([
			'use_popup' => '1',
			'link_preview_enabled' => '0',
			'allow_default_link_token_to_anonymous' => '1',
			'allow_default_link_token_to_guests' => '1',
			'dashboard_enabled' => '0',
			'issue_notifications_enabled' => '0',
		]);

		$this->assertEquals([
			'use_popup' => [true],
			'link_preview_enabled' => [true],
			'allow_default_link_token_to_anonymous' => [true],
			'allow_default_link_token_to_guests' => [true],
			'dashboard_enabled' => [false],
			'issue_notifications_enabled' => [false],
		], $this->writes);
		$this->assertSame('0', $this->stored['dashboard_enabled']);
		$this->assertSame(Http::STATUS_OK, $response->getStatus());
		$this->assertSame([], $response->getData());
	}

	public function testSensitiveAdminValuesAreStoredLazilyAndStillEncrypted(): void {
		$githubAPIService = $this->createMock(GithubAPIService::class);
		$githubAPIService->expects($this->once())->method('updateLinkTokenUserInfo')->with('token')
			->willReturn(['user_name' => 'octocat', 'user_displayname' => 'The Octocat']);
		$controller = $this->createConfigController($githubAPIService);

		$response = $controller->setSensitiveAdminConfig([
			'client_id' => 'id',
			'client_secret' => 'secret',
			'default_link_token' => 'token',
		]);

		$this->assertEquals([
			'client_id' => [true],
			'client_secret' => [true],
			'default_link_token' => [true],
		], $this->writes);
		$this->assertSame('encrypted:secret', $this->stored['client_secret']);
		$this->assertSame('encrypted:token', $this->stored['default_link_token']);
		$this->assertSame(Http::STATUS_OK, $response->getStatus());
		$this->assertSame(['user_name' => 'octocat', 'user_displayname' => 'The Octocat'], $response->getData());
	}

	/**
	 * A key the app does not own, such as the server's "enabled", must not reach the app config:
	 * stored lazily it would make the app look disabled.
	 */
	public function testAdminEndpointsRejectKeysTheyDoNotWriteAndWriteNothing(): void {
		$githubAPIService = $this->createMock(GithubAPIService::class);
		$githubAPIService->expects($this->never())->method('updateLinkTokenUserInfo');
		$controller = $this->createConfigController($githubAPIService);

		$responses = [
			$controller->setAdminConfig(['use_popup' => '1', 'enabled' => 'yes']),
			$controller->setAdminConfig(['installed_version' => '99.0.0']),
			$controller->setAdminConfig(['client_secret' => 'secret']),
			$controller->setSensitiveAdminConfig(['client_id' => 'id', 'enabled' => 'yes']),
			$controller->setSensitiveAdminConfig(['client_id' => 'id', 'use_popup' => '1']),
		];

		foreach ($responses as $response) {
			$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
		}
		$this->assertSame([], $this->writes);
		$this->assertSame([], $this->deletes);
	}

	public function testEachAdminEndpointAcceptsExactlyItsOwnKeys(): void {
		$controller = $this->createConfigController($this->createMock(GithubAPIService::class));
		$accepted = ['admin-config' => [], 'sensitive-admin-config' => []];

		foreach ([...array_keys(self::DEFAULTS), 'enabled', 'installed_version', 'types', 'not_an_app_key'] as $key) {
			if ($controller->setAdminConfig([$key => '1'])->getStatus() === Http::STATUS_OK) {
				$accepted['admin-config'][] = $key;
			}
			if ($controller->setSensitiveAdminConfig([$key => '1'])->getStatus() === Http::STATUS_OK) {
				$accepted['sensitive-admin-config'][] = $key;
			}
		}

		$this->assertEqualsCanonicalizing([
			'use_popup',
			'link_preview_enabled',
			'allow_default_link_token_to_anonymous',
			'allow_default_link_token_to_guests',
			'dashboard_enabled',
			'issue_notifications_enabled',
		], $accepted['admin-config']);
		$this->assertEqualsCanonicalizing(['client_id', 'client_secret', 'default_link_token'], $accepted['sensitive-admin-config']);
	}

	public function testAdminEndpointsRejectValuesThatAreNotStringsAndWriteNothing(): void {
		$controller = $this->createConfigController($this->createMock(GithubAPIService::class));

		$responses = [
			$controller->setAdminConfig(['use_popup' => '1', 'link_preview_enabled' => true]),
			$controller->setAdminConfig(['dashboard_enabled' => 0]),
			$controller->setSensitiveAdminConfig(['client_id' => 'id', 'client_secret' => ['secret']]),
			$controller->setSensitiveAdminConfig(['default_link_token' => null]),
		];

		foreach ($responses as $response) {
			$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
		}
		$this->assertSame([], $this->writes);
		$this->assertSame([], $this->deletes);
	}

	public function testOauthRedirectReadsTheClientAndThePopupSettingLazily(): void {
		$this->stored = [
			'client_id' => 'encrypted:id',
			'client_secret' => 'encrypted:secret',
			'use_popup' => '1',
		];
		$this->userValues['oauth_state'] = 'state';
		$githubAPIService = $this->createMock(GithubAPIService::class);
		$githubAPIService->expects($this->once())->method('requestOAuthAccessToken')
			->with(['client_id' => 'id', 'client_secret' => 'secret', 'code' => 'code', 'state' => 'state'], 'POST')
			->willReturn(['access_token' => 'access-token']);
		$githubAPIService->method('request')->willReturn(['login' => 'octocat', 'id' => 1, 'name' => 'The Octocat']);
		$urlGenerator = $this->createMock(IURLGenerator::class);
		$urlGenerator->method('linkToRoute')->willReturnArgument(0);
		$controller = $this->createConfigController($githubAPIService, $urlGenerator);

		$response = $controller->oauthRedirect('code', 'state');

		$this->assertSame('integration_github.config.popupSuccessPage', $response->getRedirectURL());
		$this->assertEquals([
			'client_id' => [true],
			'client_secret' => [true],
			'use_popup' => [true],
		], $this->reads);
	}

	/**
	 * @return array<string, array{array<string, string>, array<string, mixed>}>
	 */
	public static function adminFormProvider(): array {
		return [
			'every value stored, each differing from its default' => [
				[
					'client_id' => 'encrypted:id',
					'client_secret' => 'encrypted:secret',
					'use_popup' => '1',
					'dashboard_enabled' => '0',
					'link_preview_enabled' => '0',
					'default_link_token' => 'encrypted:token',
					'user_name' => 'octocat',
					'user_displayname' => 'The Octocat',
					'allow_default_link_token_to_anonymous' => '1',
					'allow_default_link_token_to_guests' => '1',
					'issue_notifications_enabled' => '0',
				],
				[
					'client_id' => 'id',
					'client_secret' => 'dummyClientSecret',
					'use_popup' => true,
					'dashboard_enabled' => false,
					'link_preview_enabled' => false,
					'default_link_token' => 'dummyToken',
					'allow_default_link_token_to_anonymous' => true,
					'allow_default_link_token_to_guests' => true,
					'user_name' => 'octocat',
					'user_displayname' => 'The Octocat',
					'issue_notifications_enabled' => false,
				],
			],
			'mixed values, some stored and some left to their default' => [
				[
					'client_id' => 'encrypted:other-id',
					'use_popup' => '1',
					'link_preview_enabled' => '1',
					'user_name' => 'hubot',
					'allow_default_link_token_to_anonymous' => '1',
					'allow_default_link_token_to_guests' => '0',
					'issue_notifications_enabled' => '0',
				],
				[
					'client_id' => 'other-id',
					'client_secret' => '',
					'use_popup' => true,
					'dashboard_enabled' => true,
					'link_preview_enabled' => true,
					'default_link_token' => '',
					'allow_default_link_token_to_anonymous' => true,
					'allow_default_link_token_to_guests' => false,
					'user_name' => 'hubot',
					'user_displayname' => '',
					'issue_notifications_enabled' => false,
				],
			],
			'other mixed values' => [
				[
					'client_secret' => 'encrypted:secret',
					'use_popup' => '1',
					'dashboard_enabled' => '1',
					'link_preview_enabled' => '0',
					'user_displayname' => 'Hubot',
					'allow_default_link_token_to_guests' => '1',
				],
				[
					'client_id' => '',
					'client_secret' => 'dummyClientSecret',
					'use_popup' => true,
					'dashboard_enabled' => true,
					'link_preview_enabled' => false,
					'default_link_token' => '',
					'allow_default_link_token_to_anonymous' => false,
					'allow_default_link_token_to_guests' => true,
					'user_name' => '',
					'user_displayname' => 'Hubot',
					'issue_notifications_enabled' => true,
				],
			],
			'nothing stored, so the defaults decide' => [
				[],
				[
					'client_id' => '',
					'client_secret' => '',
					'use_popup' => false,
					'dashboard_enabled' => true,
					'link_preview_enabled' => true,
					'default_link_token' => '',
					'allow_default_link_token_to_anonymous' => false,
					'allow_default_link_token_to_guests' => false,
					'user_name' => '',
					'user_displayname' => '',
					'issue_notifications_enabled' => true,
				],
			],
		];
	}

	/**
	 * @param array<string, string> $stored
	 * @param array<string, mixed> $expectedForm
	 */
	#[DataProvider('adminFormProvider')]
	public function testAdminSettingsReadEachKeyWithItsFlag(array $stored, array $expectedForm): void {
		$this->stored = $stored;
		$githubAPIService = $this->createMock(GithubAPIService::class);
		$githubAPIService->expects($this->never())->method('updateLinkTokenUserInfo');
		$initialState = $this->createMock(IInitialState::class);
		$initialState->expects($this->once())->method('provideInitialState')
			->with('admin-config', $this->identicalTo($expectedForm));
		$admin = new Admin($this->secretService, $this->appConfig, $initialState, $githubAPIService);

		$admin->getForm();

		$this->assertEquals([
			'client_id' => [true],
			'client_secret' => [true],
			'use_popup' => [true],
			'dashboard_enabled' => [false],
			'link_preview_enabled' => [true],
			'default_link_token' => [true],
			'user_name' => [true],
			'user_displayname' => [true],
			'allow_default_link_token_to_anonymous' => [true],
			'allow_default_link_token_to_guests' => [true],
			'issue_notifications_enabled' => [false],
		], $this->reads);
	}

	/**
	 * @return array<string, array{array<string, string>}>
	 */
	public static function missingAccountProvider(): array {
		// the default token switches are on here, a value pattern no other form data set has
		$switches = ['allow_default_link_token_to_anonymous' => '1', 'allow_default_link_token_to_guests' => '1'];
		return [
			'user name missing' => [['default_link_token' => 'encrypted:token', 'user_displayname' => 'Stale', ...$switches]],
			'display name missing' => [['default_link_token' => 'encrypted:token', 'user_name' => 'stale', ...$switches]],
		];
	}

	/**
	 * @param array<string, string> $stored
	 */
	#[DataProvider('missingAccountProvider')]
	public function testAdminSettingsFetchTheDefaultTokenAccountWhenItIsMissing(array $stored): void {
		$this->stored = $stored;
		$githubAPIService = $this->createMock(GithubAPIService::class);
		$githubAPIService->expects($this->once())->method('updateLinkTokenUserInfo')->with('token')
			->willReturn(['user_name' => 'octocat', 'user_displayname' => 'The Octocat']);
		$initialState = $this->createMock(IInitialState::class);
		$initialState->expects($this->once())->method('provideInitialState')
			->with('admin-config', $this->identicalTo([
				'client_id' => '',
				'client_secret' => '',
				'use_popup' => false,
				'dashboard_enabled' => true,
				'link_preview_enabled' => true,
				'default_link_token' => 'dummyToken',
				'allow_default_link_token_to_anonymous' => true,
				'allow_default_link_token_to_guests' => true,
				'user_name' => 'octocat',
				'user_displayname' => 'The Octocat',
				'issue_notifications_enabled' => true,
			]));

		(new Admin($this->secretService, $this->appConfig, $initialState, $githubAPIService))->getForm();

		$this->assertSame([true], $this->reads['user_name']);
		$this->assertSame([true], $this->reads['user_displayname']);
	}

	public function testPersonalSettingsReadEachKeyWithItsFlag(): void {
		$personal = new Personal($this->secretService, $this->config, $this->appConfig, $this->createMock(IInitialState::class), 'alice');

		$personal->getForm();

		$this->assertEquals([
			'issue_notifications_enabled' => [false],
			'client_id' => [true],
			'client_secret' => [true],
			'use_popup' => [true],
		], $this->reads);
	}

	public function testDashboardWidgetReadsTheClientAndThePopupSettingLazily(): void {
		$widget = new GithubWidget(
			$this->createMock(IL10N::class),
			$this->appConfig,
			$this->createMock(IURLGenerator::class),
			$this->createMock(IInitialState::class),
			$this->createMock(GithubAPIService::class),
			'alice',
		);

		$widget->load();

		$this->assertEquals([
			'client_id' => [true],
			'client_secret' => [true],
			'use_popup' => [true],
		], $this->reads);
	}

	public function testReferenceProvidersReadTheLinkPreviewSettingLazily(): void {
		$this->stored['link_preview_enabled'] = '0';
		$arguments = [
			$this->createMock(GithubAPIService::class),
			$this->config,
			$this->appConfig,
			$this->createMock(IL10N::class),
			$this->createMock(IURLGenerator::class),
			$this->createMock(ReferenceManager::class),
			null,
		];
		$issueProvider = new GithubIssuePrReferenceProvider(...$arguments);
		$codeProvider = new GithubCodeReferenceProvider(...$arguments);

		$this->assertFalse($issueProvider->matchReference('https://github.com/nextcloud/server/issues/1'));
		$this->assertFalse($codeProvider->matchReference('https://github.com/nextcloud/server/blob/0123abc/index.php#L1'));

		$this->assertEquals(['link_preview_enabled' => [true, true]], $this->reads);
	}

	public function testAccessTokenFallbackReadsItsSettingsLazily(): void {
		$this->stored = [
			'allow_default_link_token_to_anonymous' => '1',
			'allow_default_link_token_to_guests' => '1',
			'default_link_token' => 'encrypted:token',
		];
		$guest = $this->createMock(IUser::class);
		$guest->method('getBackendClassName')->willReturn('Guests');
		$this->userManager->method('get')->with('guest')->willReturn($guest);

		$this->assertSame('token', $this->secretService->getAccessToken(null, true));
		$this->assertSame('token', $this->secretService->getAccessToken('guest', true));

		$this->assertEquals([
			'allow_default_link_token_to_anonymous' => [true],
			'allow_default_link_token_to_guests' => [true],
			'default_link_token' => [true, true],
		], $this->reads);
	}

	public function testClearingASecretKeepsItLazy(): void {
		$this->secretService->setEncryptedAppValue('client_secret', '');

		$this->assertEquals(['client_secret' => [true]], $this->writes);
		$this->assertSame('', $this->stored['client_secret']);
	}

	public function testDefaultTokenUserInfoIsStoredLazilyAndDeletedThroughTheAppConfig(): void {
		$response = $this->createMock(IResponse::class);
		$response->method('getStatusCode')->willReturn(200);
		$response->method('getBody')->willReturnOnConsecutiveCalls('{"login":"octocat","name":"The Octocat"}', '{}');
		$client = $this->createMock(IClient::class);
		$client->method('get')->willReturn($response);
		$githubAPIService = $this->createGithubAPIService($client);

		$this->assertSame(
			['user_name' => 'octocat', 'user_displayname' => 'The Octocat'],
			$githubAPIService->updateLinkTokenUserInfo('token'),
		);
		$this->assertEquals([
			'user_name' => [true],
			'user_displayname' => [true],
		], $this->writes);
		$this->assertSame('octocat', $this->stored['user_name']);
		$this->assertSame('The Octocat', $this->stored['user_displayname']);

		$this->assertSame(
			['user_name' => '', 'user_displayname' => ''],
			$githubAPIService->updateLinkTokenUserInfo('token'),
		);
		$this->assertSame(['user_name', 'user_displayname'], $this->deletes);
	}

	public function testNotificationJobReadsTheAdminToggleNonLazy(): void {
		$this->stored['issue_notifications_enabled'] = '0';
		$this->userManager->expects($this->never())->method('callForAllUsers');

		$this->createGithubAPIService($this->createMock(IClient::class))->checkNewNotifications();

		$this->assertEquals(['issue_notifications_enabled' => [false]], $this->reads);
	}

	private function createConfigController(GithubAPIService $githubAPIService, ?IURLGenerator $urlGenerator = null): ConfigController {
		return new ConfigController(
			Application::APP_ID,
			$this->createMock(IRequest::class),
			$this->config,
			$this->appConfig,
			$urlGenerator ?? $this->createMock(IURLGenerator::class),
			$this->createMock(IL10N::class),
			$this->createMock(IInitialState::class),
			$this->createMock(LoggerInterface::class),
			$githubAPIService,
			$this->secretService,
			$this->createMock(GithubIssuePrReferenceProvider::class),
			'alice',
		);
	}

	private function createGithubAPIService(IClient $client): GithubAPIService {
		$clientService = $this->createMock(IClientService::class);
		$clientService->method('newClient')->willReturn($client);

		return new GithubAPIService(
			$this->secretService,
			$this->createMock(LoggerInterface::class),
			$this->createMock(IL10N::class),
			$this->config,
			$this->appConfig,
			$this->createMock(IURLGenerator::class),
			$this->userManager,
			$this->createMock(IManager::class),
			$clientService,
		);
	}
}
