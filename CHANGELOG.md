<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Changed

- Stop loading most of the app's settings on every request

## 3.3.0 - 2026-10-02

### Added

- Added support for Nextcloud 36

### Changed

- Update @nextcloud/eslint-config to 9 and sync the lint workflows
- Update dependencies & translations

### Fixed

- Show the message of the dashboard widget again, `NcEmptyContent` no longer has the `title` prop it was passed in
- Ask users who did not connect a GitHub account to connect one in the dashboard widget, instead of reporting an error and requesting the GitHub API without a token
- Name the link under a full dashboard widget after the widget again, it read *More items …*
- Name the loading spinner of a comment author's popover for screen readers, it carried an empty `aria-label`
- Stop the error that `focus-trap` threw whenever the popover of a comment author opened, `NcPopover` reads `no-focus-trap` and the `focus-trap` it was given was ignored

### Security

- Update `league/commonmark` to 2.10.0, closing four high-severity denial-of-service advisories and an `AttributesExtension` unsafe-link filter bypass on the converter used to render issue and pull request bodies
- Update bundled JavaScript dependencies to close the remaining high-severity advisories (dompurify, js-yaml, nanoid)

## 3.2.7 - 2026-08-18

### Changed

- Use the outline style for the key icons
- Update dependencies & translations

### Fixed

- Keep the settings pages working when a stored secret cannot be decrypted
- Update bundled JavaScript dependencies (vite, js-yaml, brace-expansion, `@babel/core`, esbuild, fast-xml-parser, webdav) to close several security advisories

## 3.2.6 - 2026-05-22

### Fixed

- Fix `ValueError` from `vsprintf()` that broke notifications for non-English users

## 3.2.5 - 2026-05-16

### Added

- Added support for Nextcloud 35

### Fixed

- Stop spamming the log with `\InvalidArgumentException` deprecation warnings from the notifier; throw `OCP\Notification\UnknownNotificationException` instead for unknown notifications

## 3.2.4 - 2026-04-24

### Fixed

- Sync the appstore-build-publish workflow to the current Nextcloud template so the signing step runs on a PHP version that matches the app's minimum (the hardcoded PHP 8.1 was blocking 3.2.3 from publishing on Nextcloud 33+)

## 3.2.3 - 2026-04-21

### Added

- Added support for Nextcloud 34

### Changed

- Update dependencies & translations

### Removed

- Nextcloud 32 support

## 3.2.2 - 2025-11-10

### Added

- Added support for Nextcloud 33

### Changed

- Update dependencies & translations

### Removed

- Nextcloud 29 to 31 support

## 3.2.1 - 2025-05-20

### Fixed

- Fix the incorrect config key for the notifications toggle in the personal settings

## 3.2.0 - 2025-05-19

### Added

- Added support for Nextcloud 32
- Add the default access token user info in the admin settings
- Add notifications for new unread GitHub notifications (admin/user option to enable/disable)

### Changed

- Update dependencies

### Removed

- Nextcloud 27 and 28 support

## 3.1.1 - 2024-11-06

### Changed

- Better logs during the OAuth flow

## 3.1.0 - 2024-11-05

### Changed

- Encrypt secrets
- Ask for password confirmation for sensitive admin settings
- Add more logs and more details in the logs
- Allow setting a personal token even if OAuth is possible

### Removed

- Nextcloud 26 support

## 3.0.0 - 2024-09-28

### Added

- Added support for Nextcloud 30 and 31

### Changed

- Switch from Webpack to Vite
- Add SPDX headers
- Update dependencies

### Fixed

- Fix a crash when connecting to an account without a display name

## 2.0.7 - 2024-03-06

### Added

- Added support for Nextcloud 29
- Test the assistant notification event
- PHP unit tests for all API controller methods

### Changed

- Upgrade to NcDashboardWidget
- Use @nextcloud/vue 8
- Update dependencies

## 2.0.6 - 2023-07-21

### Fixed

- Handle missing information in link preview rich objects

## 2.0.5 - 2023-07-20

### Added

- Added support for Nextcloud 28

### Changed

- Make the picker work even if the search provider is disabled
- Add information in the link preview rich object for future client implementations of the smart picker
- Do not use OC functions/vars anymore

### Fixed

- Remove a warning in Application.php

## 2.0.4 - 2023-04-26

### Fixed

- Wrong exclusion of vendor when building the appstore archive

## 2.0.3 - 2023-04-26

### Changed

- Get rid of the `@nextcloud/vue-richtext` dependency as the build bug has been fixed in the Nextcloud webpack config
- Update dependencies

## 2.0.2 - 2023-04-13

### Fixed

- In GithubIssuePrReferenceWidget, do not display the comment if the issue/PR is not found

## 2.0.1 - 2023-03-10

### Added

- Added support for Nextcloud 27

### Changed

- Allow loading images from https://user-images.githubusercontent.com in the global CSP (for Markdown content in widgets)

### Fixed

- Many style issues in the issue/PR/comment widget

## 2.0.0 - 2023-03-03

### Added

- Implement a discoverable/searchable reference provider

### Changed

- Lazy load the dashboard widget and the reference widgets

### Removed

- Nextcloud 25 support

## 1.0.15 - 2023-01-29

### Changed

- Show more notifications (team_mention, author, manual)

### Fixed

- Speed up the issue and repo search (by a lot)
- Fix the pagination in GitHub API requests
- Reaction button width

## 1.0.14 - 2022-12-13

### Changed

- Use @nextcloud/vue 7.2.0
- Optionally avoid using the default access token for guests and anonymous users

### Fixed

- Handle refs with slashes in the permalink reference provider

## 1.0.13 - 2022-11-22

### Added

- New reference widget for code permalinks (https://github.com/namespace/repo/blob/691cbe/src/main.js#L12-L15)

### Fixed

- Don't spam warnings when the repo is 404

## 1.0.12 - 2022-10-14

### Fixed

- Reference widget: width of the first line in Chromium-based browsers
- Widget URL in the dashboard client API

## 1.0.11 - 2022-10-13

### Changed

- Use @nextcloud/vue v7.0.0
- Improve the reference widget wrapping

### Fixed

- Avatar in search provider results
- Remove HTML special characters in the reference widget title

## 1.0.9 - 2022-10-07

### Added

- Set fallback link information to render the reference without the widget

### Fixed

- Replace the frontend Markdown stripping for the title by a server-side one using league/commonmark
- Make the reference link match case-insensitive
- Wrapping with a narrow widget

## 1.0.8 - 2022-09-27

### Changed

- Adjust to the new reference class

## 1.0.6 - 2022-09-23

### Added

- Added support for Nextcloud 26
- Admin default access token for search and reference stuff

### Fixed

- Remove Markdown marks from the reference widget title
- Style issues to make the reference widget work in Text

## 1.0.5 - 2022-09-21

### Added

- Reference widget for issues, PRs and comments
- Implement the new dashboard APIs for clients

### Removed

- Nextcloud 22 to 24 support

## 1.0.4 - 2022-08-26

### Added

- Added support for Nextcloud 24 and 25
- Optionally authenticate with a pop-up (OAuth only)
- Allow connection directly from the dashboard (with or without a pop-up)

### Changed

- Use material icons
- Use Node 16 and adjust to the new ESLint config
- Update dependencies

## 1.0.1 - 2021-06-28

### Added

- Added support for Nextcloud 23

### Changed

- Stop polling the widget content when the document is hidden
- Get rid of all deprecated stuff
- Clean up the backend code
- Update dependencies

### Removed

- Nextcloud 20 and 21 support

## 1.0.0 - 2021-03-19

### Changed

- Update dependencies to fix the widget item menu placement

## 0.0.20 - 2021-02-16

### Changed

- Republish to use the new app certificate

## 0.0.18 - 2021-02-08

### Added

- Added support for Nextcloud 22

### Fixed

- Add the missing CSS import for dialogs

## 0.0.17 - 2021-01-18

### Fixed

- Popover scrolling issue

## 0.0.16 - 2020-12-30

### Fixed

- Widget crash with "Discussion" notifications

## 0.0.14 - 2020-12-10

### Fixed

- Missing settings icon

## 0.0.13 - 2020-12-10

### Changed

- Update dependencies

### Fixed

- Safer use of OCA.Accessibility when this app is disabled

## 0.0.12 - 2020-11-23

### Changed

- Add a link to the personal tokens settings in the hint
- Update dependencies

## 0.0.11 - 2020-11-08

### Changed

- Update dependencies

### Fixed

- Links to releases
- No more ESLint warnings

## 0.0.10 - 2020-10-24

### Added

- Optional navigation link

### Changed

- Improve the release GitHub action
- Update dependencies

## 0.0.8 - 2020-10-22

### Added

- Automate releases

### Fixed

- Always use the redirect URI generated on the browser side

## 0.0.7 - 2020-10-19

### Added

- Display new releases in the widget

### Changed

- Use webpack 5 and stylelint

## 0.0.6 - 2020-10-12

### Changed

- Fix avatar proxied requests, just pass the user name to the controller

### Fixed

- Various small fixes

## 0.0.5 - 2020-10-02

### Fixed

- Make menu actions work with the latest vue-dashboard

## 0.0.4 - 2020-10-02

### Added

- Lots of translations

### Changed

- Split the options to toggle search providers
- Cleaner PHP code

## 0.0.3 - 2020-09-21

### Changed

- Improve the authentication design
- Improve the widget empty content
- Split the search into 2 providers: issues/PRs and repos
- Improve the search results (icons, names...)
- Warn about privacy when enabling search
- Update @nextcloud/vue and @nextcloud/vue-dashboard

### Fixed

- Fix paginated search results

## 0.0.2 - 2020-09-02

### Fixed

- Change the display name to "GitHub"
- Image loading with the new webpack config

## 0.0.1 - 2020-09-02

### Added

- Initial release for Nextcloud 20 and 21
