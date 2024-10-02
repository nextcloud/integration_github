<?php

namespace OCA\Github\Tests;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use OCA\Github\Service\SecretService;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUserManager;
use Test\TestCase;
use Test\Util\User\Dummy;

/**
 * @group DB
 */
class GithubAPIControllerTest extends TestCase {
	public const APP_NAME = 'integration_github';
	public const TEST_USER1 = 'testuser';
	public const API_TOKEN = 'testtoken';
	public const DEFAULT_HEADERS = ['User-Agent' => 'Nextcloud GitHub integration', 'Authorization' => 'token ' . self::API_TOKEN];

	private $githubApiController;
	private $githubApiService;
	private $iClient;

	public static function setUpBeforeClass(): void {
		parent::setUpBeforeClass();
		$backend = new Dummy();
		$backend->createUser(self::TEST_USER1, self::TEST_USER1);
		\OC::$server->get(IUserManager::class)->registerBackend($backend);
	}

	public static function tearDownAfterClass(): void {
		$backend = new Dummy();
		$backend->deleteUser(self::TEST_USER1);
		\OC::$server->get(IUserManager::class)->removeBackend($backend);
		parent::tearDownAfterClass();
	}

	protected function setUp(): void {
		parent::setUp();

		$this->loginAsUser(self::TEST_USER1);

		// We'll hijack the client service to return a mock client
		// so we can control the response
		$clientService = $this->createMock(IClientService::class);
		$this->iClient = $this->createMock(IClient::class);
		$clientService->method('newClient')->willReturn($this->iClient);

		$secretService = \OC::$server->get(SecretService::class);

		$this->githubApiService = new GithubAPIService(
			$secretService,
			\OC::$server->get(\Psr\Log\LoggerInterface::class),
			$this->createMock(IL10N::class),
			\OC::$server->get(IConfig::class),
			\OC::$server->get(IURLGenerator::class),
			\OC::$server->get(IUserManager::class),
			$clientService,
		);

		$this->githubApiController = new \OCA\Github\Controller\GithubAPIController(
			self::APP_NAME,
			$this->createMock(IRequest::class),
			$this->githubApiService,
			self::TEST_USER1
		);

		$secretService->setEncryptedUserValue(self::TEST_USER1, 'token', self::API_TOKEN);
	}

	public function testGetNotifications(): void {
		$since = '1800-01-01T00:00:00Z';

		// Read the file in ./data/notification.json and copy the contents into the variable below
		$response = file_get_contents(__DIR__ . '/data/notification.json');
		$url = 'https://api.github.com/notifications?' . http_build_query(['since' => $since, 'participating' => 'false']);
		$options = [
			'timeout' => 30,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getNotifications($since);

		// Only the first notification in the file should be returned
		// as the rest are of "uninteresting" types
		$correctResult = [json_decode($response, true)[0]];

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals($correctResult, $result->getData());
	}

	public function testUnsubscribeNotification(): void {
		$id = 12345;

		$response = '{
            "subscribed": true,
            "ignored": false,
            "reason": null,
            "created_at": "2012-10-06T21:34:12Z",
            "url": "https://api.github.com/notifications/threads/1/subscription",
            "thread_url": "https://api.github.com/notifications/threads/1"
          }';
		$url = 'https://api.github.com/notifications/threads/' . $id . '/subscription';
		$options = [
			'timeout' => 30,
			'headers' => self::DEFAULT_HEADERS,
			'body' => json_encode(['ignored' => true])
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('put')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->unsubscribeNotification($id);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testMarkNotificationAsRead(): void {
		$id = 12345;

		$response = '';
		$url = 'https://api.github.com/notifications/threads/' . $id;
		$options = [
			'timeout' => 30,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(205);
		$this->iClient->expects($this->once())
			->method('post')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->markNotificationAsRead($id);

		$this->assertEquals(200, $result->getStatus());
		// The response is empty so we expect an empty array
		$this->assertEquals([], $result->getData());
	}

	public function testGetAvatar(): void {
		$githubLogin = 'testuser';

		$firstResponse = file_get_contents(__DIR__ . '/data/users.json');
		$secondResponse = file_get_contents(__DIR__ . '/data/avatar.jpg');
		$firstUrl = 'https://api.github.com/users/' . $githubLogin;
		$secondUrl = 'https://avatars.githubusercontent.com/u/12345?v=4';

		$options = [
			'timeout' => 30,
			'headers' => self::DEFAULT_HEADERS
		];

		$firstIResponse = $this->createMock(IResponse::class);
		$firstIResponse->method('getBody')->willReturn($firstResponse);
		$firstIResponse->method('getStatusCode')->willReturn(200);

		$secondIResponse = $this->createMock(IResponse::class);
		$secondIResponse->method('getBody')->willReturn($secondResponse);
		$secondIResponse->method('getStatusCode')->willReturn(200);


		$this->iClient->expects($this->exactly(2))
			->method('get')
			->willReturnOnConsecutiveCalls($firstIResponse, $secondIResponse);

		$result = $this->githubApiController->getAvatar($githubLogin);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals($secondResponse, $result->getData());
	}

	public function testGetUserInfo(): void {
		$githubLogin = 'testuser';

		$response = file_get_contents(__DIR__ . '/data/users.json');
		$url = 'https://api.github.com/users/' . $githubLogin;
		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getUserInfo($githubLogin);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testGetContextualUserInfo(): void {
		$githubLogin = 'testuser';
		$subjectType = 'repository';
		$subjectId = 12345;

		$response = file_get_contents(__DIR__ . '/data/users_contextual.json');
		$url = 'https://api.github.com/users/' . $githubLogin . '/hovercard?' . http_build_query(['subject_type' => $subjectType, 'subject_id' => $subjectId]);

		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getContextualUserInfo($githubLogin, $subjectType, $subjectId);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testGetIssueInfo(): void {
		$owner = 'testuser';
		$repo = 'testrepo';
		$issueNumber = 12345;

		$response = file_get_contents(__DIR__ . '/data/issue.json');
		$url = 'https://api.github.com/repos/' . $owner . '/' . $repo . '/issues/' . $issueNumber;

		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getIssueInfo($owner, $repo, $issueNumber);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testGetIssueReactionsInfo(): void {
		$owner = 'testuser';
		$repo = 'testrepo';
		$issueNumber = 12345;

		$response = file_get_contents(__DIR__ . '/data/issue_reactions.json');
		$url = 'https://api.github.com/repos/' . $owner . '/' . $repo . '/issues/' . $issueNumber . '/reactions';

		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getIssueReactionsInfo($owner, $repo, $issueNumber);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testGetIssueCommentInfo(): void {
		$owner = 'testuser';
		$repo = 'testrepo';
		$commentId = 12345;

		$response = file_get_contents(__DIR__ . '/data/issue_comment.json');
		$url = 'https://api.github.com/repos/' . $owner . '/' . $repo . '/issues/comments/' . $commentId;

		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getIssueCommentInfo($owner, $repo, $commentId);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testGetIssueCommentReactionsInfo(): void {
		$owner = 'testuser';
		$repo = 'testrepo';
		$commentId = 12345;

		$response = file_get_contents(__DIR__ . '/data/issue_comment_reactions.json');
		$url = 'https://api.github.com/repos/' . $owner . '/' . $repo . '/issues/comments/' . $commentId . '/reactions';

		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getIssueCommentReactionsInfo($owner, $repo, $commentId);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}

	public function testGetPrInfo(): void {
		$owner = 'testuser';
		$repo = 'testrepo';
		$prNumber = 12345;

		$response = file_get_contents(__DIR__ . '/data/pr_info.json');
		$url = 'https://api.github.com/repos/' . $owner . '/' . $repo . '/pulls/' . $prNumber;

		$options = [
			'timeout' => 5,
			'headers' => self::DEFAULT_HEADERS
		];

		$iResponse = $this->createMock(IResponse::class);
		$iResponse->method('getBody')->willReturn($response);
		$iResponse->method('getStatusCode')->willReturn(200);
		$this->iClient->expects($this->once())
			->method('get')
			->with($url, $options)
			->willReturn($iResponse);

		$result = $this->githubApiController->getPrInfo($owner, $repo, $prNumber);

		$this->assertEquals(200, $result->getStatus());
		$this->assertEquals(json_decode($response, true), $result->getData());
	}
}
