<?php

namespace OCA\Github\Tests;

use OCA\Github\AppInfo\Application;
use OCA\Github\Service\GithubAPIService;
use Test\TestCase;

class GithubAPIServiceTest extends TestCase {

	public function testDummy() {
		$app = new Application();
		$this->assertEquals('integration_github', $app::APP_ID);
	}

	public function testPaginationConversion() {
		$expecteds = [
			// offset, limit => perPage, page, leftPadding
			[[0, 5], [5, 1, 0]],
			[[0, 10], [10, 1, 0]],
			[[2, 5], [7, 1, 2]],
			[[2, 10], [12, 1, 2]],

			[[12, 2], [2, 7, 0]],
			[[12, 3], [3, 5, 0]],
			[[12, 4], [4, 4, 0]],
			[[12, 5], [6, 3, 0]],
			[[12, 6], [6, 3, 0]],
			[[12, 7], [10, 2, 2]],
		];

		foreach ($expecteds as $expected) {
			$params = $expected[0];
			$offset = $params[0];
			$limit = $params[1];

			$expectedResults = $expected[1];
			$results = GithubAPIService::getGitHubPaginationValues($offset, $limit);
			$this->assertEquals($expectedResults, $results);
		}

		foreach (range(0, 100) as $offset) {
			foreach (range(1, 100) as $limit) {
				[$perPage, $page, $leftPadding] = GithubAPIService::getGitHubPaginationValues($offset, $limit);
				// what do we want?
				$firstRequestedIndex = $offset;
				$lastRequestedIndex = $offset + $limit - 1;

				// what do we get?
				// page number start at 1
				$firstObtainedIndex = ($page - 1) * $perPage;
				$lastObtainedIndex = $firstObtainedIndex + ($perPage - 1);

				// check requested indexes are in the obtained page
				$this->assertTrue($firstRequestedIndex >= $firstObtainedIndex);
				$this->assertTrue($lastRequestedIndex <= $lastObtainedIndex);

				// page size can't be smaller than the number of elements we want
				$this->assertTrue($perPage >= $limit);
				// no negative padding
				$this->assertTrue($leftPadding >= 0);
				// padding can't be bigger than the number of extra elements we got
				$this->assertTrue($leftPadding <= $perPage - $limit);
			}
		}
	}
}
