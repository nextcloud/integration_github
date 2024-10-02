<?php
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Service;

use DateInterval;
use DateTime;
use Exception;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use OCA\Github\AppInfo\Application;
use OCP\Dashboard\Model\WidgetItem;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUserManager;
use OCP\PreConditionNotMetException;
use OCP\Security\ICrypto;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Service to make requests to GitHub v3 (JSON) API
 */
class SecretService {

	public function __construct(
		private IConfig $config,
		private IUserManager $userManager,
		private ICrypto $crypto,
	) {
	}

	/**
	 * @param string $userId
	 * @param string $key
	 * @param string $value
	 * @return void
	 * @throws PreConditionNotMetException
	 */
	public function setEncryptedUserValue(string $userId, string $key, string $value): void {
		if ($value === '') {
			$this->config->setUserValue($userId, Application::APP_ID, $key, '');
			return;
		}
		$encryptedValue = $this->crypto->encrypt($value);
		$this->config->setUserValue($userId, Application::APP_ID, $key, $encryptedValue);
	}

	/**
	 * @param string $userId
	 * @param string $key
	 * @return string
	 * @throws Exception
	 */
	public function getEncryptedUserValue(string $userId, string $key): string {
		$storedValue = $this->config->getUserValue($userId, Application::APP_ID, $key);
		if ($storedValue === '') {
			return '';
		}
		return $this->crypto->decrypt($storedValue);
	}

	/**
	 * @param string $key
	 * @param string $value
	 * @return void
	 */
	public function setEncryptedAppValue(string $key, string $value): void {
		if ($value === '') {
			$this->config->setAppValue(Application::APP_ID, $key, '');
			return;
		}
		$encryptedValue = $this->crypto->encrypt($value);
		$this->config->setAppValue(Application::APP_ID, $key, $encryptedValue);
	}

	/**
	 * @param string $key
	 * @return string
	 * @throws Exception
	 */
	public function getEncryptedAppValue(string $key): string {
		$storedValue = $this->config->getAppValue(Application::APP_ID, $key);
		if ($storedValue === '') {
			return '';
		}
		return $this->crypto->decrypt($storedValue);
	}

	/**
	 * Get the user access token
	 * If there is none, get the default one, check:
	 * - if we use it for this endpoint
	 * - if user is anonymous
	 * - if user is a guest
	 *
	 * @param string|null $userId
	 * @param bool $endpointUsesDefaultToken
	 * @return string
	 * @throws Exception
	 */
	public function getAccessToken(?string $userId, bool $endpointUsesDefaultToken = false): string {
		// use user access token in priority
		$accessToken = '';
		// for logged in users
		if ($userId !== null) {
			$accessToken = $this->getEncryptedUserValue($userId, 'token');
			// fallback to admin default token if $useDefaultToken
			if ($accessToken === '' && $endpointUsesDefaultToken) {
				$user = $this->userManager->get($userId);
				$isGuestUser = $user->getBackendClassName() === 'Guests';
				$allowDefaultTokenToGuests = $this->config->getAppValue(Application::APP_ID, 'allow_default_link_token_to_guests', '0') === '1';

				if ((!$isGuestUser) || $allowDefaultTokenToGuests) {
					$accessToken = $this->getEncryptedAppValue('default_link_token');
				}
			}
		} elseif ($endpointUsesDefaultToken) {
			// anonymous users
			$allowDefaultTokenToAnonymous = $this->config->getAppValue(Application::APP_ID, 'allow_default_link_token_to_anonymous', '0') === '1';
			if ($allowDefaultTokenToAnonymous) {
				$accessToken = $this->getEncryptedAppValue('default_link_token');
			}
		}

		return $accessToken;
	}
}
