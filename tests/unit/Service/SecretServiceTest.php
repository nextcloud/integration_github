<?php

/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Unit\Service;

use Exception;
use OCA\Github\AppInfo\Application;
use OCA\Github\Service\SecretService;
use OCP\IConfig;
use OCP\IUserManager;
use OCP\Security\ICrypto;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

class SecretServiceTest extends TestCase {

	private IConfig|MockObject $config;
	private IUserManager|MockObject $userManager;
	private ICrypto|MockObject $crypto;
	private LoggerInterface|MockObject $logger;
	private SecretService $secretService;

	protected function setUp(): void {
		parent::setUp();
		$this->config = $this->createMock(IConfig::class);
		$this->userManager = $this->createMock(IUserManager::class);
		$this->crypto = $this->createMock(ICrypto::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->secretService = new SecretService(
			$this->config, $this->userManager, $this->crypto, $this->logger
		);
	}

	public function testUserValueIsDecrypted(): void {
		$this->config->method('getUserValue')->willReturn('ciphertext');
		$this->crypto->expects($this->once())->method('decrypt')->with('ciphertext')->willReturn('plain');

		$this->assertSame('plain', $this->secretService->getEncryptedUserValue('alice', 'token'));
	}

	public function testAppValueIsDecrypted(): void {
		$this->config->method('getAppValue')->willReturn('ciphertext');
		$this->crypto->expects($this->once())->method('decrypt')->with('ciphertext')->willReturn('plain');

		$this->assertSame('plain', $this->secretService->getEncryptedAppValue('client_id'));
	}

	public function testUnsetValuesAreNotDecrypted(): void {
		$this->config->method('getUserValue')->willReturn('');
		$this->config->method('getAppValue')->willReturn('');
		$this->crypto->expects($this->never())->method('decrypt');

		$this->assertSame('', $this->secretService->getEncryptedUserValue('alice', 'token'));
		$this->assertSame('', $this->secretService->getEncryptedAppValue('client_id'));
	}

	/**
	 * A stored value that is not valid ciphertext must not escape as an exception.
	 * Both settings classes read secrets in getForm(), and the settings controller
	 * renders every app's section, so throwing here returns 500 for the entire
	 * "Connected accounts" page rather than just this app's part of it.
	 */
	public function testUndecryptableUserValueIsTreatedAsUnset(): void {
		$this->config->method('getUserValue')->willReturn('not-actually-ciphertext');
		$this->crypto->method('decrypt')
			->willThrowException(new Exception('Authenticated ciphertext could not be decoded.'));
		$this->logger->expects($this->once())->method('warning');

		$this->assertSame('', $this->secretService->getEncryptedUserValue('alice', 'token'));
	}

	public function testUndecryptableAppValueIsTreatedAsUnset(): void {
		$this->config->method('getAppValue')->willReturn('not-actually-ciphertext');
		$this->crypto->method('decrypt')
			->willThrowException(new Exception('Authenticated ciphertext could not be decoded.'));
		$this->logger->expects($this->once())->method('warning');

		$this->assertSame('', $this->secretService->getEncryptedAppValue('client_id'));
	}

	/**
	 * getAccessToken() builds on both getters, so an undecryptable token must leave
	 * callers with "no token" rather than an exception surfacing in a controller.
	 */
	public function testAccessTokenIsEmptyWhenTheStoredTokenCannotBeDecrypted(): void {
		$this->config->method('getUserValue')->willReturn('not-actually-ciphertext');
		$this->config->method('getAppValue')->willReturn('');
		$this->crypto->method('decrypt')
			->willThrowException(new Exception('Authenticated ciphertext could not be decoded.'));

		$this->assertSame('', $this->secretService->getAccessToken('alice'));
	}

	public function testSettingAnEmptyValueDoesNotEncrypt(): void {
		$this->crypto->expects($this->never())->method('encrypt');
		$this->config->expects($this->once())->method('setUserValue')
			->with('alice', Application::APP_ID, 'token', '');

		$this->secretService->setEncryptedUserValue('alice', 'token', '');
	}
}
