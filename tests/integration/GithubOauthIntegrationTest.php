<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

require_once __DIR__ . '/GitHubHtml.php';
require_once __DIR__ . '/Totp.php';

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\RequestOptions;
use OCA\Github\AppInfo\Application;
use OCA\Github\Controller\ConfigController;
use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\App\IAppManager;
use OCP\AppFramework\Http;
use OCP\IConfig;
use OCP\IURLGenerator;
use OCP\IUserManager;
use OCP\IUserSession;
use OCP\Server;
use PHPUnit\Framework\Attributes\Group;
use Test\TestCase;

#[Group('DB')]
class GithubOauthIntegrationTest extends TestCase {
	private const TEST_USER_ID = 'github_test_user';
	private const OAUTH_SCOPE = 'read:user user:email repo notifications';
	private const MAX_GITHUB_REDIRECTS = 10;

	private ConfigController $configController;
	private ?string $githubClientId;
	private ?string $githubClientSecret;
	private ?string $githubLogin;
	private ?string $githubPassword;
	private ?string $githubTotpSecret;
	private Client $client;
	private CookieJar $cookieJar;
	private IConfig $config;
	private GithubAPIService $githubAPIService;
	private SecretService $secretService;
	private ?string $userId;
	private IURLGenerator $urlGenerator;

	private function resetUserConfig(string $userId): void {
		foreach ([
			'token',
			'token_type',
			'user_id',
			'user_name',
			'user_displayname',
			'oauth_state',
			'redirect_uri',
			'oauth_origin',
			'navigation_enabled',
			'search_issues_enabled',
			'search_repos_enabled',
			'link_preview_enabled',
		] as $key) {
			$this->config->deleteUserValue($userId, Application::APP_ID, $key);
		}
	}

	protected function setUp(): void {
		parent::setUp();

		$appManager = Server::get(IAppManager::class);
		$appManager->enableApp(Application::APP_ID);

		$this->githubClientId = getenv('CI_CLIENT_ID') ?: null;
		$this->githubClientSecret = getenv('CI_CLIENT_SECRET') ?: null;
		$this->githubLogin = getenv('CI_USER_LOGIN') ?: null;
		$this->githubPassword = getenv('CI_USER_PASSWORD') ?: null;
		$this->githubTotpSecret = getenv('CI_TOTP_SECRET') ?: null;

		$userManager = Server::get(IUserManager::class);
		$user = $userManager->get(self::TEST_USER_ID)
			?? $userManager->createUser(self::TEST_USER_ID, 'test-password');
		self::loginAsUser($user->getUID());

		$this->config = Server::get(IConfig::class);
		$this->resetUserConfig($user->getUID());

		$this->configController = Server::get(ConfigController::class);
		$this->githubAPIService = Server::get(GithubAPIService::class);
		$this->secretService = Server::get(SecretService::class);
		$this->urlGenerator = Server::get(IURLGenerator::class);
		$this->userId = Server::get(IUserSession::class)->getUser()?->getUID();
		$this->newClient();
	}

	private function newClient(): void {
		$this->cookieJar = new CookieJar();
		$this->client = new Client([
			'allow_redirects' => [
				'track_redirects' => true,
				'max' => self::MAX_GITHUB_REDIRECTS,
			],
			'cookies' => $this->cookieJar,
			'http_errors' => false,
			'headers' => [
				'User-Agent' => 'Nextcloud-GitHub-Integration-Test',
			],
		]);
	}

	private function requireCredentials(): void {
		if ($this->githubClientId === null || $this->githubClientSecret === null) {
			$this->markTestSkipped('CI_CLIENT_ID and/or CI_CLIENT_SECRET not set');
		}
		if ($this->githubLogin === null || $this->githubPassword === null) {
			$this->markTestSkipped('CI_USER_LOGIN and/or CI_USER_PASSWORD not set');
		}
		if ($this->githubTotpSecret === null) {
			$this->markTestSkipped('CI_TOTP_SECRET not set');
		}
		if ($this->userId === null || $this->userId === '') {
			$this->markTestSkipped('No Nextcloud user is available for the OAuth integration test');
		}
	}

	private function makeOAuthState(): string {
		return bin2hex(random_bytes(16));
	}

	private function getOAuthAuthorizeUrl(string $oauthState): string {
		$redirectUri = $this->urlGenerator->linkToRouteAbsolute('integration_github.config.oauthRedirect');

		$query = http_build_query([
			'client_id' => $this->githubClientId,
			'redirect_uri' => $redirectUri,
			'state' => $oauthState,
			'scope' => self::OAUTH_SCOPE,
		], arg_separator: '&', encoding_type: PHP_QUERY_RFC3986);

		return 'https://github.com/login/oauth/authorize?' . $query;
	}

	private function getPageContext(string $body): array {
		$selector = GitHubHtml::loadXPath($body);
		return [
			'selector' => $selector,
			'title' => GitHubHtml::getPageTitle($selector),
		];
	}

	private function assertOkStatus(int $statusCode, string $message): void {
		if ($statusCode !== Http::STATUS_OK) {
			$this->fail($message . ' Status: ' . $statusCode);
		}
	}

	private function setOtpCode(array $formParams, string $totpCode): array {
		if (array_key_exists('otp', $formParams)) {
			$formParams['otp'] = $totpCode;
		} else {
			$formParams['app_otp'] = $totpCode;
		}

		return $formParams;
	}

	private function isInvalidTotpResponse(string $responseBody): bool {
		return str_contains($responseBody, 'Incorrect code')
			|| str_contains($responseBody, 'Invalid two-factor authentication code');
	}

	private function requestFollowingGitHubRedirects(string $method, string $url, array $options = []): array {
		$currentMethod = $method;
		$currentUrl = $url;
		$currentOptions = $options;

		for ($i = 0; $i < self::MAX_GITHUB_REDIRECTS; $i++) {
			$currentOptions[RequestOptions::ALLOW_REDIRECTS] = false;
			$currentOptions[RequestOptions::HTTP_ERRORS] = false;

			$response = $this->client->request($currentMethod, $currentUrl, $currentOptions);
			$statusCode = $response->getStatusCode();
			$body = $response->getBody()->getContents();
			$location = $response->getHeaderLine('Location');

			if ($statusCode < 300 || $statusCode >= 400 || $location === '') {
				return [
					'response' => $response,
					'body' => $body,
					'final_url' => $currentUrl,
				];
			}

			$redirectUrl = GitHubHtml::resolveUrl($location, $currentUrl);
			$redirectHost = parse_url($redirectUrl, PHP_URL_HOST);
			if ($redirectHost !== 'github.com') {
				return [
					'response' => $response,
					'body' => $body,
					'final_url' => $redirectUrl,
					'stopped_before_external_redirect' => true,
				];
			}

			if (in_array($statusCode, [Http::STATUS_MOVED_PERMANENTLY, Http::STATUS_FOUND, Http::STATUS_SEE_OTHER], true)) {
				$currentMethod = 'GET';
				$currentUrl = $redirectUrl;
				$currentOptions = [];
				continue;
			}

			if (in_array($statusCode, [Http::STATUS_TEMPORARY_REDIRECT, 308], true)) {
				$currentUrl = $redirectUrl;
				continue;
			}

			$this->fail('Unexpected GitHub redirect status ' . $statusCode . ' while requesting ' . $currentUrl . '. Redirect URL: ' . $redirectUrl);
		}

		$this->fail('Too many GitHub redirects while requesting ' . $url);
	}

	private function interpretAuthenticatedResponse(string $body, string $finalUrl, string $step): array {
		if (str_contains($finalUrl, 'sessions/verified-device')) {
			$this->fail('GitHub redirected to device verification after the ' . $step . ' step. CI runners look like new devices, so the test account must use app-based 2FA instead of email-based device verification. Final URL: ' . $finalUrl);
		}

		if (str_contains($finalUrl, 'code=')) {
			return [
				'status' => 'redirect_with_code',
				'redirect_url' => $finalUrl,
				'body' => $body,
			];
		}

		['selector' => $selector, 'title' => $title] = $this->getPageContext($body);

		// GitHub periodically interrupts authenticated navigation with a "Verify your
		// two-factor authentication (2FA) settings" checkup page. It is not a real 2FA
		// challenge, just a reminder; POSTing the delay form dismisses it.
		if (GitHubHtml::findTwoFactorCheckupDelayForm($selector) !== null) {
			return [
				'status' => 'two_factor_checkup',
				'checkup_url' => $finalUrl,
				'body' => $body,
			];
		}

		$isTwoFactorPage = GitHubHtml::findTwoFactorForm($selector) !== null
			|| str_contains($finalUrl, 'two-factor')
			|| str_contains($title, 'Two-factor authentication');
		if ($isTwoFactorPage) {
			return [
				'status' => 'two_factor_required',
				'two_factor_url' => $finalUrl,
				'body' => $body,
			];
		}

		if (GitHubHtml::findAuthorizeForm($selector) !== null) {
			return [
				'status' => 'authorize_page',
				'authorize_url' => $finalUrl,
				'body' => $body,
			];
		}

		if (str_contains($title, 'Sign in to GitHub')) {
			$this->fail('GitHub returned the sign-in page after the ' . $step . ' step. This usually means the authenticated session was not established or cookies were not kept. Final URL: ' . $finalUrl);
		}

		$this->fail(
			'GitHub completed the ' . $step . ' step but neither a 2FA form, an authorize form, nor a callback redirect with code was found. '
			. 'Final URL: ' . $finalUrl . '. Page title: ' . $title . '. '
			. 'Page: ' . GitHubHtml::describePage($selector)
		);
	}

	private function loginToGitHub(string $authorizeUrl): array {
		$response = $this->client->get($authorizeUrl);
		$statusCode = $response->getStatusCode();
		$body = $response->getBody()->getContents();

		$this->assertOkStatus($statusCode, 'Initial OAuth authorize request failed for URL ' . $authorizeUrl . '.');

		['selector' => $selector, 'title' => $title] = $this->getPageContext($body);

		$loginForm = GitHubHtml::findForm($selector, [
			'//form[@action="/session"]',
			'//form[contains(@class, "session-authentication")]',
			'//form[@id="login_form"]',
		]);
		if ($loginForm === null) {
			$this->fail('Could not find the GitHub login form on the authorize page. Page title: ' . $title . '. URL: ' . $authorizeUrl);
		}

		$formParams = GitHubHtml::extractFormInputs($selector, $loginForm);
		$formParams['login'] = $this->githubLogin;
		$formParams['password'] = $this->githubPassword;
		$loginActionUrl = GitHubHtml::resolveUrl($loginForm->getAttribute('action'), 'https://github.com/session');

		$loginResult = $this->requestFollowingGitHubRedirects('POST', $loginActionUrl, [
			RequestOptions::FORM_PARAMS => $formParams,
		]);

		$loginResponse = $loginResult['response'];
		$loginStatus = $loginResponse->getStatusCode();
		$loginBody = $loginResult['body'];
		$finalUrl = $loginResult['final_url'];

		if (($loginResult['stopped_before_external_redirect'] ?? false) === true) {
			return $this->interpretAuthenticatedResponse($loginBody, $finalUrl, 'login');
		}

		$this->assertOkStatus($loginStatus, 'GitHub login request failed after posting to ' . $loginActionUrl . '. Final URL: ' . $finalUrl . '.');

		if (str_contains($loginBody, 'Incorrect username or password')) {
			return [
				'status' => 'invalid_credentials',
				'body' => $loginBody,
			];
		}

		return $this->interpretAuthenticatedResponse($loginBody, $finalUrl, 'login');
	}

	private function navigateToTotpPage(string $currentUrl, string $currentBody): array {
		['selector' => $selector] = $this->getPageContext($currentBody);

		$totpUrl = GitHubHtml::findTotpAlternativeUrl($selector);
		if ($totpUrl === null) {
			// Fallback: try the common GitHub TOTP URL directly
			$totpUrl = 'https://github.com/sessions/two-factor/app';
		}

		$response = $this->client->get($totpUrl, [
			RequestOptions::HTTP_ERRORS => false,
		]);
		$body = $response->getBody()->getContents();
		$statusCode = $response->getStatusCode();

		$this->assertOkStatus(
			$statusCode,
			'Failed to navigate to TOTP page from page without a recognized 2FA form. '
			. 'Source URL: ' . $currentUrl . '. Attempted TOTP URL: ' . $totpUrl . '. '
			. 'Source page: ' . GitHubHtml::describePage($selector) . '.'
		);

		return [
			'url' => $totpUrl,
			'body' => $body,
		];
	}

	private function dismissTwoFactorCheckup(string $body, string $checkupUrl): array {
		['selector' => $selector] = $this->getPageContext($body);
		$delayForm = GitHubHtml::findTwoFactorCheckupDelayForm($selector);
		if ($delayForm === null) {
			$this->fail('Expected a 2FA checkup delay form on ' . $checkupUrl . ' but none was found. Page: ' . GitHubHtml::describePage($selector));
		}

		$formParams = GitHubHtml::extractFormInputs($selector, $delayForm);
		$actionUrl = GitHubHtml::resolveUrl($delayForm->getAttribute('action'), $checkupUrl);

		$result = $this->requestFollowingGitHubRedirects('POST', $actionUrl, [
			RequestOptions::FORM_PARAMS => $formParams,
		]);
		$statusCode = $result['response']->getStatusCode();
		if (($result['stopped_before_external_redirect'] ?? false) !== true && $statusCode >= 400) {
			$this->fail('Dismissing the 2FA checkup via ' . $actionUrl . ' returned status ' . $statusCode . '.');
		}

		return $this->interpretAuthenticatedResponse($result['body'], $result['final_url'], 'checkup dismissal');
	}

	private function handleTwoFactorPage(string $twoFactorUrl, string $body): array {
		try {
			$totpCodes = Totp::generateCandidates($this->githubTotpSecret);
		} catch (\InvalidArgumentException $exception) {
			$this->fail('CI_TOTP_SECRET is invalid: ' . $exception->getMessage());
		}

		$currentBody = $body;
		$currentUrl = $twoFactorUrl;
		$lastStatusCode = null;
		$lastFinalUrl = $twoFactorUrl;

		foreach ($totpCodes as $totpCode) {
			['selector' => $selector, 'title' => $title] = $this->getPageContext($currentBody);

			$twoFactorForm = GitHubHtml::findTwoFactorForm($selector);
			if ($twoFactorForm === null) {
				// WebAuthn/passkey page may be shown instead of TOTP, navigate to TOTP alternative
				$totpPage = $this->navigateToTotpPage($currentUrl, $currentBody);
				$currentUrl = $totpPage['url'];
				$currentBody = $totpPage['body'];

				['selector' => $selector, 'title' => $title] = $this->getPageContext($currentBody);
				$twoFactorForm = GitHubHtml::findTwoFactorForm($selector);
				if ($twoFactorForm === null) {
					$this->fail('Could not find the GitHub 2FA form after navigating away from WebAuthn page. Page title: ' . $title . '. URL: ' . $currentUrl);
				}
			}

			$formParams = GitHubHtml::extractFormInputs($selector, $twoFactorForm);
			$twoFactorActionUrl = GitHubHtml::resolveUrl($twoFactorForm->getAttribute('action'), $currentUrl);
			$attemptFormParams = $this->setOtpCode($formParams, $totpCode);

			$twoFactorResult = $this->requestFollowingGitHubRedirects('POST', $twoFactorActionUrl, [
				RequestOptions::FORM_PARAMS => $attemptFormParams,
			]);

			$twoFactorResponse = $twoFactorResult['response'];
			$statusCode = $twoFactorResponse->getStatusCode();
			$responseBody = $twoFactorResult['body'];
			$finalUrl = $twoFactorResult['final_url'];
			$lastStatusCode = $statusCode;
			$lastFinalUrl = $finalUrl;

			if (($twoFactorResult['stopped_before_external_redirect'] ?? false) === true) {
				return $this->interpretAuthenticatedResponse($responseBody, $finalUrl, 'two-factor authentication');
			}

			$this->assertOkStatus($statusCode, 'GitHub 2FA request failed after posting to ' . $twoFactorActionUrl . '. Final URL: ' . $finalUrl . '.');

			if (!$this->isInvalidTotpResponse($responseBody)) {
				return $this->interpretAuthenticatedResponse($responseBody, $finalUrl, 'two-factor authentication');
			}

			$currentBody = $responseBody;
			$currentUrl = $finalUrl;
		}

		$this->fail('GitHub rejected all generated TOTP codes. Check CI_TOTP_SECRET or clock skew. Final URL: ' . $lastFinalUrl . '. Last status: ' . $lastStatusCode);
	}

	private function handleAuthorizePage(string $authorizeUrl, string $body): string {
		['selector' => $selector, 'title' => $title] = $this->getPageContext($body);

		$authorizeForm = GitHubHtml::findAuthorizeForm($selector);
		if ($authorizeForm === null) {
			$this->fail('Could not find OAuth authorize form on page. The authorize page HTML may have changed or login did not succeed. Page title: ' . $title . '. URL: ' . $authorizeUrl);
		}

		$formParams = GitHubHtml::extractFormInputs($selector, $authorizeForm);
		$authorizeActionUrl = GitHubHtml::resolveUrl($authorizeForm->getAttribute('action'), $authorizeUrl);

		$authorizeResponse = $this->client->post($authorizeActionUrl, [
			RequestOptions::FORM_PARAMS => $formParams,
			RequestOptions::ALLOW_REDIRECTS => false,
			RequestOptions::HTTP_ERRORS => false,
		]);

		$statusCode = $authorizeResponse->getStatusCode();
		$responseBody = $authorizeResponse->getBody()->getContents();
		$location = $authorizeResponse->getHeaderLine('Location');
		if ($statusCode >= 300 && $statusCode < 400 && $location !== '') {
			$redirectUrl = GitHubHtml::resolveUrl($location, $authorizeActionUrl);
			if (str_contains($redirectUrl, 'code=')) {
				return $redirectUrl;
			}

			$this->fail('OAuth authorize form redirected without a code parameter. Redirect URL: ' . $redirectUrl);
		}

		$this->fail('OAuth authorize form was submitted but GitHub did not return the expected redirect response. Status: ' . $statusCode . '. Location header: ' . ($location === '' ? 'empty' : $location));
	}

	private function extractCodeFromRedirectUrl(string $redirectUrl): string {
		$query = parse_url($redirectUrl, PHP_URL_QUERY);
		if ($query === null) {
			$this->fail('Could not parse query string from redirect URL: ' . $redirectUrl);
		}

		parse_str($query, $params);
		if (!isset($params['code'])) {
			$this->fail('No code parameter found in redirect URL: ' . $redirectUrl);
		}
		return $params['code'];
	}

	/**
	 * @return array{userId: string, login: string} User ID and GitHub login for dependent tests
	 */
	public function testOAuthLogin(): array {
		$this->requireCredentials();

		$this->secretService->setEncryptedAppValue('client_id', $this->githubClientId);
		$this->secretService->setEncryptedAppValue('client_secret', $this->githubClientSecret);

		$oauthState = $this->makeOAuthState();
		$this->config->setUserValue($this->userId, Application::APP_ID, 'oauth_state', $oauthState);

		$authorizeUrl = $this->getOAuthAuthorizeUrl($oauthState);

		$loginResult = $this->loginToGitHub($authorizeUrl);

		if ($loginResult['status'] === 'two_factor_required') {
			$loginResult = $this->handleTwoFactorPage($loginResult['two_factor_url'] ?? $authorizeUrl, $loginResult['body']);
		}

		if ($loginResult['status'] === 'two_factor_checkup') {
			$loginResult = $this->dismissTwoFactorCheckup($loginResult['body'], $loginResult['checkup_url'] ?? $authorizeUrl);
		}

		if ($loginResult['status'] === 'invalid_credentials') {
			$this->fail('Invalid GitHub credentials');
		}

		if ($loginResult['status'] === 'redirect_with_code') {
			$redirectUrl = $loginResult['redirect_url'];
		} elseif ($loginResult['status'] === 'authorize_page') {
			$redirectUrl = $this->handleAuthorizePage($loginResult['authorize_url'] ?? $authorizeUrl, $loginResult['body']);
		} else {
			$this->fail('Unexpected login status: ' . $loginResult['status']);
		}

		$code = $this->extractCodeFromRedirectUrl($redirectUrl);

		$parsedUrl = parse_url($redirectUrl);
		$query = $parsedUrl['query'] ?? '';
		parse_str($query, $params);
		$returnedState = $params['state'] ?? '';

		$oauthRedirectResponse = $this->configController->oauthRedirect($code, $returnedState);

		$this->assertStringContainsString('githubToken=success', $oauthRedirectResponse->getRedirectURL(),
			'OAuth redirect did not return success');

		$storedToken = $this->secretService->getEncryptedUserValue($this->userId, 'token');
		$this->assertNotSame('', $storedToken, 'Token was not stored');

		$tokenType = $this->config->getUserValue($this->userId, Application::APP_ID, 'token_type');
		$this->assertSame('oauth', $tokenType, 'Token type should be oauth');

		$userName = $this->config->getUserValue($this->userId, Application::APP_ID, 'user_name');
		$this->assertNotSame('', $userName, 'User name should be stored');

		$userInfo = $this->githubAPIService->request($this->userId, 'user');
		$this->assertArrayNotHasKey('error', $userInfo, 'API request returned error: ' . json_encode($userInfo));
		$this->assertArrayHasKey('login', $userInfo);
		$this->assertSame($this->githubLogin, $userInfo['login']);

		return [
			'userId' => $this->userId,
			'login' => $this->githubLogin,
		];
	}
}
