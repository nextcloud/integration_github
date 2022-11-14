const path = require('path')
const webpackConfig = require('@nextcloud/webpack-vue-config')
const ESLintPlugin = require('eslint-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'
webpackConfig.devtool = isDev ? 'cheap-source-map' : 'source-map'
// webpackConfig.bail = false

webpackConfig.stats = {
	colors: true,
	modules: false,
}

const appId = 'integration_github'
webpackConfig.entry = {
	personalSettings: { import: path.join(__dirname, 'src', 'personalSettings.js'), filename: appId + '-personalSettings.js' },
	adminSettings: { import: path.join(__dirname, 'src', 'adminSettings.js'), filename: appId + '-adminSettings.js' },
	dashboard: { import: path.join(__dirname, 'src', 'dashboard.js'), filename: appId + '-dashboard.js' },
	popupSuccess: { import: path.join(__dirname, 'src', 'popupSuccess.js'), filename: appId + '-popupSuccess.js' },
	referenceIssuePr: { import: path.join(__dirname, 'src', 'referenceIssuePr.js'), filename: appId + '-referenceIssuePr.js' },
	referenceCodePermalink: { import: path.join(__dirname, 'src', 'referenceCodePermalink.js'), filename: appId + '-referenceCodePermalink.js' },
}

webpackConfig.plugins.push(
	new ESLintPlugin({
		extensions: ['js', 'vue'],
		files: 'src',
		failOnError: !isDev,
	})
)
webpackConfig.plugins.push(
	new StyleLintPlugin({
		files: 'src/**/*.{css,scss,vue}',
		failOnError: !isDev,
	}),
)

module.exports = webpackConfig
