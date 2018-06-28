const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.conf')
const generateLoader = require('./generateLoader')
const pkg = require('../package.json')

const ENV = 'development'

const devConfig = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      ...generateLoader.generateScriptLoader(ENV),
      ...generateLoader.generateStyleLoader(ENV),
      ...generateLoader.generateFileLoader(ENV),
      ...generateLoader.generateTemplateLoader()
    ]
  },
  devServer: {
    contentBase: path.resolve('static'),
    publicPath: '/',
    compress: true,
    hot: true,
    open: true,
    overlay: true,
    port: 9999,
    clientLogLevel: 'warning',
    proxy: {}
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      filename: 'index.html',
      template: path.resolve('index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

module.exports = merge(baseConfig, devConfig)
