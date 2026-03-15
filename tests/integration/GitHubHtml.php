<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

use DOMDocument;
use DOMElement;
use DOMXPath;

final class GitHubHtml {

	public static function loadXPath(string $body): DOMXPath {
		$doc = new DOMDocument();
		libxml_use_internal_errors(true);
		$doc->loadHTML($body);

		return new DOMXPath($doc);
	}

	public static function getPageTitle(DOMXPath $selector): string {
		$title = $selector->query('//title')?->item(0)?->textContent;
		return $title === null ? 'no title' : trim($title);
	}

	public static function findForm(DOMXPath $selector, array $formSelectors): ?DOMElement {
		foreach ($formSelectors as $formSelector) {
			$result = $selector->query($formSelector);
			$form = $result?->item(0);
			if ($form instanceof DOMElement) {
				return $form;
			}
		}

		return null;
	}

	public static function findAuthorizeForm(DOMXPath $selector): ?DOMElement {
		return self::findForm($selector, [
			'//form[contains(@class, "js-oauth-authorize-form")]',
			'//form[contains(@class, "js-oath-authorize-form")]',
			'//form[@action="/login/oauth/authorize"]',
			'//form[contains(@action, "authorize")]',
		]);
	}

	public static function findTwoFactorForm(DOMXPath $selector): ?DOMElement {
		return self::findForm($selector, [
			'//form[contains(@action, "two-factor") and .//input[@name="app_otp" or @name="otp"]]',
			'//form[.//input[@name="app_otp" or @name="otp"]]',
		]);
	}

	public static function resolveUrl(string $url, string $fallbackUrl): string {
		if ($url === '') {
			return $fallbackUrl;
		}
		if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
			return $url;
		}
		if (str_starts_with($url, '/')) {
			return 'https://github.com' . $url;
		}

		$baseUrl = preg_replace('/[^\/]+$/', '', $fallbackUrl);
		return $baseUrl . $url;
	}

	public static function extractFormInputs(DOMXPath $selector, DOMElement $form): array {
		$formParams = [];
		$inputs = $selector->query('.//input[@name] | .//button[@name]', $form);
		foreach ($inputs as $input) {
			$name = $input->getAttribute('name');
			$value = $input->getAttribute('value');
			$type = $input->getAttribute('type');
			if ($type === 'checkbox' && !$input->hasAttribute('checked')) {
				continue;
			}
			$formParams[$name] = $value;
		}
		libxml_clear_errors();

		return $formParams;
	}
}
