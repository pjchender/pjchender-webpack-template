const path = require('path')
const webpack = require('webpack')



// 放入 package.json 中所有 dependency 的 module
const VENDOR_LIBS = ['lodash']


const config = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS            // 產生 vendor.js
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',           // [name] 會被 entry 中的 key 換調
    publicPath: 'dist/'
  },
  module: {
    rules: [
      // babel-loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      // css-loader
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
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
    })
  ]
}

module.exports = config
