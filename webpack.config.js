const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: './dist'
  },
  devtool: 'inline-source-map',
  entry: {
    bundle: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js' // [name] 會被 entry 中的 key 換調
  },
  module: {
    rules: [
      {
        // process .scss files
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), // 清除 dist 的內容
    new HtmlWebpackPlugin({
      template: './src/index.html' // 幫我們把 dist 中的 js 檔注入 html 當中
    }),
    new webpack.optimize.SplitChunksPlugin(),
    new CopyWebpackPlugin([
      {
        from: './src/vendor',
        to: './vendor'
      }
    ])
  ]
};
