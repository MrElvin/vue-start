const path = require('path')
const fs = require('fs')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const log = require('./log')
const generateLoader = require('./generateLoader')
const VENDOR = require('./vendor')

const generateConfig = ({ dist, src, file, env, root, port, type, domain }) => {
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
      const value = webpackEntryList.length === 1 ? [`${path.resolve(filePath)}`] : [`${path.resolve(filePath, cur)}`]
      if (type === 'hot') {
        value.unshift(`webpack/hot/dev-server`)
        value.unshift(`webpack-dev-server/client?http://${domain}:${port}/`)
      } else if (type === 'live') {
        value.unshift(`webpack-dev-server/client?http://${domain}:${port}/`)
      }
      return Object.assign({ [path.basename(cur, '.js')]: value }, total)
    }, {})
  const config = {
    context: root,
    mode: env,
    devtool: 'cheap-eval-source-map',
    entry: { vendor: VENDOR, ...webpackEntryConfig },
    output: {
      path: dist,
      filename: `js/[name].${env.substr(0, 3)}.[hash:5].bundle.js`,
      chunkFilename: `js/[name].${env.substr(0, 3)}.[chunkhash:5].js`,
      publicPath: '/'
    },
    module: {
      rules: [
        ...generateLoader.generateScriptLoader(env),
        ...generateLoader.generateStyleLoader(env),
        ...generateLoader.generateFileLoader(env),
        ...generateLoader.generateTemplateLoader()
      ]
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
    plugins: [
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([{ from: path.resolve('static/'), to: path.resolve('dist/') }]),
      new HtmlWebpackPlugin({ filename: 'index.html', template: path.resolve('index.html') }),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env), 'process.env.WEBPACK_HOTRELOAD': JSON.stringify(type) })
    ]
  }

  if (type === 'hot') config.plugins.push(new webpack.HotModuleReplacementPlugin())

  const devServerConfig = {
    contentBase: path.resolve('static'),
    publicPath: '/',
    compress: true,
    hot: type === 'hot',
    open: true,
    overlay: true,
    stats: { chunks: false, children: false, colors: true, modules: false, publicPath: false },
    port,
    watchOptions: {
      aggregateTimeout: 300,
      poll: undefined,
      ignored: /node_modules/
    },
    clientLogLevel: 'warning',
    proxy: {}
  }

  log.info('配置入口', webpackEntryList)
  log.info('项目根目录：', root)
  log.info('环境模式：', env)
  log.info('publicPath：', config.output.publicPath)
  log.info('公共库：', VENDOR)
  log.info('热加载模式：', type === 'hot' ? '已开启' : '未开启')

  return { config, devServerConfig }
}

exports.hot = (params) => {
  const { config, devServerConfig } = generateConfig(params)
  const origin = `http://${params.domain}:${params.port}`
  const compiler = webpack(config)
  log.info('starting webpack-dev-server...')
  const webpackDevServer = new WebpackDevServer(compiler, devServerConfig)
  webpackDevServer.listen(params.port, params.domain, () => {
    log.success(`webpack-dev-server is listening at ${origin}`)
  })
}

exports.live = (params) => {
  const { config, devServerConfig } = generateConfig(params)
  const origin = `http://${params.domain}:${params.port}`
  const compiler = webpack(config)
  const webpackDevServer = new WebpackDevServer(compiler, devServerConfig)
  webpackDevServer.listen(params.port, params.domain, () => {
    log.info(`webpack-dev-server is listening at ${origin}`)
  })
}
