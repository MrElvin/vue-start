const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const VENDOR = ['vue']

module.exports = {
  context: path.resolve(__dirname, '../'),
  target: 'web',
  entry: {
    app: './src/main.js',
    vendor: VENDOR
  },
  output: {
    filename: 'js/[name].[hash:5].bundle.js',
    chunkFilename: 'js/[name].[chunkhash:5].js',
    path: path.resolve('./dist'),
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
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve('static/'),
      to: path.resolve('dist/')
    }])
  ]
}
