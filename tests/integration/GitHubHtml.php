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

		libxml_clear_errors();

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

	public static function findTwoFactorCheckupDelayForm(DOMXPath $selector): ?DOMElement {
		return self::findForm($selector, [
			'//form[@action="/settings/two_factor_checkup/delay"]',
			'//form[contains(@action, "two_factor_checkup/delay")]',
		]);
	}

	public static function findTotpAlternativeUrl(DOMXPath $selector): ?string {
		$linkSelectors = [
			'//a[contains(@href, "two-factor/app")]',
			'//a[contains(@href, "totp")]',
			'//a[contains(text(), "authenticator")]',
			'//a[contains(text(), "authentication app")]',
			'//a[contains(text(), "Use your authenticator")]',
		];
		foreach ($linkSelectors as $linkSelector) {
			$result = $selector->query($linkSelector);
			$link = $result?->item(0);
			if ($link instanceof DOMElement && $link->hasAttribute('href')) {
				return self::resolveUrl($link->getAttribute('href'), 'https://github.com/sessions/two-factor/app');
			}
		}

		return null;
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

		return $formParams;
	}

	/**
	 * Summarize the forms and headings on a page for failure diagnostics.
	 * Emits form actions and input names (never values) plus h1/h2 text,
	 * so CI logs show what GitHub actually returned without leaking tokens.
	 */
	public static function describePage(DOMXPath $selector): string {
		$parts = [];

		$forms = $selector->query('//form');
		if ($forms !== false) {
			foreach ($forms as $form) {
				if (!$form instanceof DOMElement) {
					continue;
				}
				$action = $form->getAttribute('action');
				$inputNodes = $selector->query('.//input[@name] | .//button[@name]', $form);
				$names = [];
				if ($inputNodes !== false) {
					foreach ($inputNodes as $input) {
						if ($input instanceof DOMElement) {
							$names[] = $input->getAttribute('name');
						}
					}
				}
				$parts[] = 'form(action=' . ($action === '' ? '<empty>' : $action) . ', inputs=[' . implode(',', $names) . '])';
			}
		}

		$headings = $selector->query('//h1 | //h2');
		if ($headings !== false) {
			foreach ($headings as $heading) {
				$text = trim($heading->textContent);
				if ($text !== '') {
					$parts[] = $heading->nodeName . '=' . mb_substr($text, 0, 120);
				}
			}
		}

		return $parts === [] ? '<no forms or headings found>' : implode(' | ', $parts);
	}
}
