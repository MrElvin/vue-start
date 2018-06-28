const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.conf')
const generateLoader = require('./generateLoader')
const pkg = require('../package.json')

const ENV = 'production'

const prodConfig = {
  mode: 'production',
  // devtool: 'source-map',
  module: {
    rules: [
      ...generateLoader.generateScriptLoader(ENV),
      ...generateLoader.generateStyleLoader(ENV),
      ...generateLoader.generateFileLoader(ENV),
      ...generateLoader.generateTemplateLoader()
    ]
  },
  optimization: {
    splitChunks: {
      minChunks: 2,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial'
        },
        async: {
          name: 'async',
          chunks: 'async'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve('./dist')], {
      root: path.resolve('./')
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css'
    }),
    new HtmlWebpackPlugin({
      title: pkg.name,
      filename: 'index.html',
      template: path.resolve('index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BundleAnalyzerPlugin()
  ]
}

module.exports = merge(prodConfig, baseConfig)
