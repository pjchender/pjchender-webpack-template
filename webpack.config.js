const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV !== "production";
const paths = {
  src: path.join(__dirname, "src"),
  dist: path.join(__dirname, "dist")
};

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: './dist'
  },
  devtool: 'inline-source-map',
  entry: {
    app: './src/index.js'
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
      },
      {
        // use babel
        test: /\.js$/i,
        exclude: /node_modules/i,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/i,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(paths.dist), // 清除 dist 的內容
    new HtmlWebpackPlugin({             // 幫我們把 dist 中的 js 檔注入 html 當中
      template: path.join(paths.src, "index.html"),
      filename: path.join(paths.dist, "index.html"),
      inject: true,
      hash: false,
      minify: {
        removeComments: devMode ? false : true,
        collapseWhitespace: devMode ? false : true,
        minifyJS: devMode ? false : true,
        minifyCSS: devMode ? false : true
      }
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
