const path = require('path')
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 放入 package.json 中所有 dependency 的 module
const VENDOR_LIBS = ['lodash']


const config = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS            // 產生 vendor.js
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'           // [name] 會被 entry 中的 key 換調
    // publicPath: 'dist/'
  },
  module: {
    rules: [
      // babel-loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      // scss loader
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
        // use: [
        //   'style-loader',
        //   'css-loader',
        //   'sass-loader'
        // ]
      },

      // url loader (for image)
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 40000          /* 小於 40kB 的圖片轉成 base64 */
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 避免 vendor 內的程式碼同時出現在 vendor.js 和 bundle.js 中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),

    // 幫我們把 dist 中的 js 檔注入 html 當中
    new HtmlWebpackPlugin({
      template: './index.html'          // 以 index.html 這支檔案當作模版注入 html
    }),

    // 將檔案輸出成 css 檔
    new ExtractTextPlugin('[name].css')
  ]
}

module.exports = config
