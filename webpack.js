const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('@nextcloud/webpack-vue-config')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'
webpackConfig.devtool = isDev ? 'cheap-source-map' : 'source-map'

if (webpackConfig.entry && webpackConfig.entry.main) {
	delete webpackConfig.entry.main
}

const config = {
	entry: {
		personalSettings: path.join(__dirname, 'src', 'personalSettings.js'),
		adminSettings: path.join(__dirname, 'src', 'adminSettings.js'),
		dashboard: path.join(__dirname, 'src', 'dashboard.js'),
	},
}

module.exports = merge(config, webpackConfig)
