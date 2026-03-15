<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Github\Tests\Integration;

final class Totp {

	private const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

	public static function generate(string $secret): string {
		return self::generateAt($secret, time());
	}

	public static function generateAt(string $secret, int $timestamp): string {
		$decodedSecret = self::decodeBase32Secret($secret);
		$counter = intdiv($timestamp, 30);
		$binaryCounter = pack('N2', ($counter >> 32) & 0xFFFFFFFF, $counter & 0xFFFFFFFF);
		$hash = hash_hmac('sha1', $binaryCounter, $decodedSecret, true);
		$offset = ord(substr($hash, -1)) & 0x0F;
		$truncatedHash = unpack('N', substr($hash, $offset, 4))[1] & 0x7FFFFFFF;

		return str_pad((string)($truncatedHash % 1000000), 6, '0', STR_PAD_LEFT);
	}

	public static function generateCandidates(string $secret): array {
		$timestamp = time();

		return array_values(array_unique([
			self::generateAt($secret, $timestamp),
			self::generateAt($secret, $timestamp - 30),
			self::generateAt($secret, $timestamp + 30),
		]));
	}

	private static function decodeBase32Secret(string $secret): string {
		$normalizedSecret = strtoupper(str_replace([' ', '-'], '', $secret));
		$buffer = 0;
		$bitsLeft = 0;
		$result = '';

		foreach (str_split($normalizedSecret) as $char) {
			if ($char === '=') {
				continue;
			}
			$position = strpos(self::BASE32_ALPHABET, $char);
			if ($position === false) {
				throw new \InvalidArgumentException('The TOTP secret is not a valid base32 string');
			}

			$buffer = ($buffer << 5) | $position;
			$bitsLeft += 5;

			while ($bitsLeft >= 8) {
				$bitsLeft -= 8;
				$result .= chr(($buffer >> $bitsLeft) & 0xFF);
			}
		}

		return $result;
	}
}
