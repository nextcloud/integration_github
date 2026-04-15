<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# GitHub integration in Nextcloud

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud/integration_github)](https://api.reuse.software/info/github.com/nextcloud/integration_github)

🐙 Put an octopus in your engine!

This app adds:
* A dashboard widget to see your most important GitHub notifications
* A search provider for repositories, issues and pull requests
* A link reference provider to render links to issues, pull requests and comments in Talk and Text

## 🔧 Configuration

### User settings

The account configuration happens in the "Connected accounts" user settings section. It requires to create a personal access token in your GitHub settings.

A link to the "Connected accounts" user settings section will be displayed in the widget for users who didn't configure a GitHub account.

### Admin settings

There also is a "Connected accounts" **admin** settings section if you want to allow your Nextcloud users to use OAuth to authenticate to GitHub.

## 🚧 Development setup

1. Simply clone this repository into the `apps` folder of your Nextcloud development instance.
2. Run `make composer` to install the dependencies.
3. Run `make npm` for a production build or `make npm-dev` for a watch/dev build.
4. Then activate it through the apps management.
5. Make sure to configure it in "Connected accounts" in personal/administration settings.