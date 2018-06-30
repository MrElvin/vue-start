const path = require('path')
const fs = require('fs')
const ora = require('ora')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpack = require('webpack')
const log = require('./log')
const generateLoader = require('./generateLoader')
const VENDOR = require('./vendor')

const spinner = ora('webpack 构建中...')

const generateConfig = ({ dist, src, file, env, root }) => {
  const filePath = path.join(src, file)
  let webpackEntryList = []
  if (!fs.existsSync(filePath)) return log.error(`文件指定错误，${filePath} 文件不存在`)
  const stat = fs.statSync(filePath)

  if (stat.isDirectory()) {
    const dirContents = fs.readdirSync(filePath)
    webpackEntryList = dirContents.filter((fileItem) => /\.js$/.test(path.join(filePath, fileItem)) && fs.statSync(path.join(filePath, fileItem)))
  } else if (stat.isFile() && /\.js$/.test(file)) {
    webpackEntryList = [file]
  }

  if (webpackEntryList.length === 0) return log.error(`指定文件目录为空或不包含 .js 文件`)
  const webpackEntryConfig = webpackEntryList
    .reduce((total, cur) => {
      if (webpackEntryList.length === 1) return Object.assign({ [path.basename(cur, '.js')]: `${path.resolve(filePath)}` }, total)
      return Object.assign({ [path.basename(cur, '.js')]: `${path.resolve(filePath, cur)}` }, total)
    }, {})

  const config = {
    context: root,
    mode: env,
    entry: { vendor: VENDOR, ...webpackEntryConfig },
    output: {
      path: dist,
      filename: `js/[name].${env.substr(0, 3)}.[hash:5].bundle.js`,
      chunkFilename: `js/[name].${env.substr(0, 3)}.[chunkhash:5].js`,
      publicPath: '/'
    },
    resolve: {
      modules: [
        path.resolve('./src'),
        'node_modules'
      ],
      alias: {
        '@': path.resolve('./src'),
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['.js', '.vue', '.json']
    },
    devtool: 'none',
    module: {
      rules: [
        ...generateLoader.generateScriptLoader(env),
        ...generateLoader.generateStyleLoader(env),
        ...generateLoader.generateFileLoader(env),
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
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([{ from: path.resolve('static/'), to: path.resolve('dist/') }]),
      new CleanWebpackPlugin([path.resolve('./dist')], { root }),
      new UglifyJsPlugin({ sourceMap: true, parallel: true }),
      new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:5].css' }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve('index.html'),
        minify: { removeComments: true, collapseWhitespace: true }
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
      new BundleAnalyzerPlugin()
    ]
  }

  log.info('命令行参数路径：', filePath)
  log.info('配置入口：', webpackEntryList)
  log.info('项目根目录：', root)
  log.info('环境模式：', env)
  log.info('publicPath：', config.output.publicPath)
  log.info('公共库：', VENDOR)

  return config
}

const errHandler = (err, stats) => {
  if (err) {
    log.error('webpack 出错')
    log.error(err.stack || err)
    if (err.details) log.error(err.details)
    spinner.fail('webpack 出错')
    return
  }
  const info = stats.toJson()
  if (stats.hasErrors()) {
    log.error('webpack 编译出错')
    log.error(info.errors)
    spinner.fail('webpack 构建出错')
  }
  if (stats.hasWarnings()) {
    log.error('webpack 编译警告')
    log.warn(info.warnings)
    spinner.succeed('webpack 构建成功')
  }
  spinner.stopAndPersist({ text: ` webpack 构建成功`, symbol: '🦄' })
  log.info(stats.toString({ chunks: false, children: false, colors: true, modules: false, publicPath: false }))
}

exports.build = (params) => {
  const config = generateConfig(params)
  if (config === null) return log.error('配置文件生成错误')
  const compiler = webpack(config)
  compiler.run(errHandler)
  spinner.start()
}

exports.watch = (params) => {
  const config = generateConfig(params)
  if (config === null) return log.error('配置文件生成错误')
  const compiler = webpack(config)
  compiler.watch({
    aggregateTimeout: 800,
    poll: undefined,
    ignored: /node_modules/
  }, errHandler)
  spinner.start()
}
