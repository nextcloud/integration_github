const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('@nextcloud/webpack-vue-config')

const config = {
    entry: {
		personalSettings: path.join(__dirname, 'src', 'personalSettings.js'),
		adminSettings: path.join(__dirname, 'src', 'adminSettings.js'),
		dashboard: path.join(__dirname, 'src', 'dashboard.js'),
    },
	module: {
		rules: [
			{
				test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
				loader: 'url-loader',
			},
		],
	},
}

module.exports = merge(config, webpackConfig)