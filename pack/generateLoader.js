const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkg = require('../package.json')

const ISVUE = Object.keys(pkg.dependencies).includes('vue')

exports.generateScriptLoader = (env) => {
  return [
    ...[{
      test: /\.js$/,
      include: [path.resolve('./src')],
      loader: 'babel-loader'
    }],
    ...(!ISVUE ? [] : [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }]),
    ...env === 'production' ? [] : [{
      test: /\.js$/,
      include: [path.resolve('./src')],
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter'),
        emitError: true
      }
    }]
  ]
}

exports.generateStyleLoader = (env) => {
  const styleLoader = []

  if (env === 'production') {
    styleLoader
      .push({
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          { loader: 'postcss-loader' }
        ]
      }, {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' }
        ]
      }, {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          { loader: 'postcss-loader' },
          { loader: 'stylus-loader' }
        ]
      })
  } else {
    styleLoader
      .push({
        test: /\.css$/,
        use: [
          {
            loader: ISVUE ? 'vue-style-loader' : 'style-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          }
        ]
      }, {
        test: /\.less$/,
        use: [
          {
            loader: ISVUE ? 'vue-style-loader' : 'style-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 2 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'less-loader',
            options: { sourceMap: true }
          }
        ]
      }, {
        test: /\.styl(us)?$/,
        use: [
          {
            loader: ISVUE ? 'vue-style-loader' : 'style-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 2 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'stylus-loader',
            options: { sourceMap: true }
          }
        ]
      })
  }

  return styleLoader
}

exports.generateFileLoader = (env) => {
  const fontRule = env === 'production'
    ? {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: 'fonts/[name].[hash:5].[ext]'
      }
    }
    : {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'file-loader',
      options: { name: 'fonts/[name]-[hash:5].ext' }
    }
  const picRule = env === 'production'
    ? {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'images/[name].[hash:5].[ext]'
      }
    }
    : {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'file-loader',
      options: { name: 'images/[name].[hash:5].[ext]' }
    }
  return [fontRule, picRule]
}

exports.generateTemplateLoader = () => {
  return [{
    test: /\.pug$/,
    loader: 'pug-plain-loader'
  }]
}
