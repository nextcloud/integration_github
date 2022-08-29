# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## 1.0.4 – 2022-08-26
### Added
- optionally authenticate with a popup (OAuth only)
- allow connection directly from the dashboard (with or without a popup)

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
