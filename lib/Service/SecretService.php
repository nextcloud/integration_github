<?php

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Service;

use Exception;
use OCA\Github\AppInfo\Application;
use OCP\IConfig;
use OCP\IUserManager;
use OCP\PreConditionNotMetException;
use OCP\Security\ICrypto;
use Psr\Log\LoggerInterface;

/**
 * Service to make requests to GitHub v3 (JSON) API
 */
class SecretService {

	public function __construct(
		private IConfig $config,
		private IUserManager $userManager,
		private ICrypto $crypto,
		private LoggerInterface $logger,
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
	 * @return string the decrypted value, or an empty string if it cannot be decrypted
	 */
	public function getEncryptedUserValue(string $userId, string $key): string {
		$storedValue = $this->config->getUserValue($userId, Application::APP_ID, $key);
		return $this->decryptOrDiscard($storedValue, $key, $userId);
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
	 * @return string the decrypted value, or an empty string if it cannot be decrypted
	 */
	public function getEncryptedAppValue(string $key): string {
		$storedValue = $this->config->getAppValue(Application::APP_ID, $key);
		return $this->decryptOrDiscard($storedValue, $key, null);
	}

	/**
	 * Decrypt a stored secret, treating one that cannot be decrypted as unset.
	 *
	 * A value that is not valid ciphertext — stored as plaintext, or encrypted under
	 * a secret that has since changed — makes ICrypto::decrypt() throw. Both settings
	 * classes read secrets in getForm(), and the settings controller renders every
	 * app's section, so letting that escape returns 500 for the whole "Connected
	 * accounts" page: not just ours, but every installed integration's.
	 */
	private function decryptOrDiscard(string $storedValue, string $key, ?string $userId): string {
		if ($storedValue === '') {
			return '';
		}

		try {
			return $this->crypto->decrypt($storedValue);
		} catch (Exception $e) {
			$this->logger->warning('Could not decrypt the stored "' . $key . '" value, treating it as unset', [
				'exception' => $e,
				'userId' => $userId,
				'app' => Application::APP_ID,
			]);
			return '';
		}
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
	 * @return string the access token, or an empty string if there is none usable
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
