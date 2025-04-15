<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 3.2.0 - 2025-04-17

Maintenance update

### Added

- Added default access token user info in Admin settings
- Added notifications for new unread GitHub notifications (admin/user option to enable/disable)


## 3.1.1 – 2024-11-06

### Changed

- Better logs during oauth flow @julien-nc #122

## 3.1.0 – 2024-11-05

### Changed

- Encrypt secrets @julien-nc #114
- Ask password confirmation for sensitive admin settings @julien-nc #115
- Add more logs and more details in logs @julien-nc #120
- Allow to set a personal token even if oauth is possible @julien-nc #119

## 3.0.0 – 2024-09-28

### Changed

- Switch from Webpack to Vite
- Update npm pkgs
- Support NC 30
- Add SPDX headers

### Fixed

- fix crash when connecting to an account without display name

## 2.0.7 – 2024-03-06

### Changed

- Upgrade to NcDashboardWidget (#89) @MB-Finski
- Update node packages (mainly vue 8) @kyteinsky
- Bumped support to NC 29 @kyteinsky

### Added

- Test the assistant notification event @julien-nc
- Php unit tests for all API controller methods @MB-Finski

## 2.0.6 – 2023-07-21

### Fixed

- handle missing information in link preview rich objects @julien-nc

## 2.0.5 – 2023-07-20

### Changed

- Make the picker work even if the search provider is disabled @julien-nc
- Add information in the link preview rich object for future clients implementation of the smart picker @julien-nc
- do not use OC functions/vars anymore @julien-nc

### Fixed

- Remove warning in Application.php @julien-nc

## 2.0.4 – 2023-04-26

### Fixed

- wrong exclusion of vendor when building the appstore archive

## 2.0.3 – 2023-04-26
### Changed
- get rid of the `@nextcloud/vue-richtext` dependency as the build bug has been fixed in the nextcloud webpack config @julien-nc
- update all npm pkgs @julien-nc

## 2.0.2 – 2023-04-13
### Fixed
- in GithubIssuePrReferenceWidget, do not display the comment if the issue/pr is not found

## 2.0.1 – 2023-03-10
### Changed
- allow loading images from https://user-images.githubusercontent.com in global CSP (for markdown content in widgets)

### Fixed
- many style issues in the issue/pr/comment widget

## 2.0.0 – 2023-03-03
### Added
- implement discoverable/searchable reference provider

### Changed
- lazy load dashboard widget and reference widgets

## 1.0.15 – 2023-01-29
### Changed
- show more notifications (team_mention, author, manual)

### Fixed
- speedup issue and repo search (by a lot)
- fix pagination in GitHub API requests
- reaction button width

## 1.0.14 – 2022-12-13
### Changed
- use @nextcloud/vue 7.2.0
- optionally avoid using the default access token for guests and anonymous users

### Fixed
- handle refs with slashes in permalink reference provider

## 1.0.13 – 2022-11-22
### Added
- new reference widget for code permalink (https://github.com/namespace/repo/blob/691cbe/src/main.js#L12-L15)

### Fixed
- Don't spam warnings when the repo is 404
  [#58](https://github.com/nextcloud/integration_github/pull/58) @nickvergessen

## 1.0.12 – 2022-10-14
### Fixed
- reference widget: width of first line in chromium based browsers
  [#55](https://github.com/nextcloud/integration_github/issues/55) @st3iny
- widget url in dashboard client api

## 1.0.11 – 2022-10-13
### Changed
- use @nextcloud/vue v7.0.0
- improve reference widget wrapping

### Fixed
- Avatar in search provider results
- remove html special characters in reference widget title

## 1.0.9 – 2022-10-07
### Added
- Set fallback link information to render reference without the widget

### Fixed
- Replace frontend markdown stripping for title by a server-side one using league/commonmark
- make reference link match case insensitive
  [#51](https://github.com/nextcloud/integration_github/issues/51) @SystemKeeper
- wrapping with narrow widget

## 1.0.8 – 2022-09-27
### Changed
- adjust to new reference class

## 1.0.6 – 2022-09-23
### Added
- admin default access token for search and reference stuff

### Fixed
- remove markdown marks from reference widget title
- style issues to make the reference widget work in Text

## 1.0.5 – 2022-09-21
### Added
- reference widget for issues, prs and comments
- implement new dashboard apis for clients

## 1.0.4 – 2022-08-26
### Added
- optionally authenticate with a pop-up (OAuth only)
- allow connection directly from the dashboard (with or without a pop-up)

### Changed
- use material icons
- use node 16, bump js libs, adjust to new eslint config
- get ready for NC 25

## 1.0.1 – 2021-06-28
### Changed
- stop polling widget content when document is hidden
- bump js libs
- get rid of all deprecated stuff
- bump min NC version to 22
- cleanup backend code

## 1.0.0 – 2021-03-19
### Changed
- bump js libs (fix widget item menu placement)

## 0.0.20 – 2021-02-16
### Changed
- app certificate

## 0.0.18 – 2021-02-08
### Changed
- bump max NC version

### Fixed
- add missing css import for dialogs

## 0.0.17 – 2021-01-18
### Fixed
- Popover scrolling issue

## 0.0.16 – 2020-12-30
### Fixed
- widget crash with 'Discussion' notifications

## 0.0.14 – 2020-12-10
### Fixed
- missing settings icon

## 0.0.13 – 2020-12-10
### Changed
- bump js libs

### Fixed
- safer use of OCA.Accessibility when this app is disabled

## 0.0.12 – 2020-11-23
### Changed
- add link to personal tokens settings in hint
[#15](https://github.com/nextcloud/integration_github/issues/15) @JOduMonT
- bump js libs

## 0.0.11 – 2020-11-08
### Changed
- bump js libs

### Fixed
- links to releases
- no more eslint warnings

## 0.0.10 – 2020-10-24
### Added
- optional navigation link

### Changed
- improve release gh action
- bump js libs

## 0.0.8 – 2020-10-22
### Added
- automate releases

### Fixed
- always use redirect URI generated on browser side

## 0.0.7 – 2020-10-19
### Added
- display new releases in widget
[#7](https://github.com/nextcloud/integration_github/issues/7) @Proximus888

### Changed
- use webpack 5 and style lint

## 0.0.6 – 2020-10-12
### Changed
- fix avatar proxied requests, just pass user name to controller
[#12](https://github.com/nextcloud/integration_github/issues/12) @tilosp

### Fixed
- various small fix

## 0.0.5 – 2020-10-02
### Fixed
- make menu actions work with latest vue-dashboard

## 0.0.4 – 2020-10-02
### Added
- lots of translations

### Changed
- split options to toggle search providers
- cleaner Php code

## 0.0.3 – 2020-09-21
### Changed
* improve authentication design
* bump nc-vue and nc-vue-dashboard
* improve widget empty content
* split search in 2 providers: issues/PRs and repos
* improve search results (icons, names...)
* warn about privacy when enabling search

### Fixed
* fix paginated search results

## 0.0.2 – 2020-09-02
### Fixed
* Change display name to "GitHub"
* image loading with new webpack config

## 0.0.1 – 2020-09-02
### Added
* the app
