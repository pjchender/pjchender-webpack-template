const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
};

module.exports = {
  mode: devMode ? 'development' : 'production',
  devtool: 'inline-source-map',
  entry: {
    app: './src/index.js',
  },
  output: {
    // [name] 會被 entry 中的 key 換調
    filename: devMode ? 'js/[name].bundle.js' : 'js/[name].[hash].bundle.js',
    path: path.dist,
    publicPath: '/',
  },
  module: {
    rules: [
      // 處理 SASS 檔案
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // 如果希望開發環境就打包出 CSS 檔案，
          // 可以直接使用 MiniCssExtractPlugin.loader，但可能會沒有 HMR
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'sass-loader',
        ],
      },
      // 使用 Babel
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      }, // End of 使用 Babel
      // 處理檔案
      {
        test: /\.(jpg|jpeg|png|gif|tiff|ico|svg|eot|otf|ttf|woff|woff2)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: path.resolve(__dirname, 'src'),
              name: '[path][name].[ext]?[hash]',
            },
          },
        ],
      }, // End of file loader
    ],
  },
  optimization: {
    // 在這裡使用 SplitChunksPlugin
    splitChunks: {
      cacheGroups: {
        // 把所有 node_modules 內的程式碼打包成一支 vendors.bundle.js
        vendors: {
          test: /[\\/]node_modules[\\/]/i,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    // 把 webpack runtime 也打包成一支 runtime.bundle.js
    runtimeChunk: {
      name: 'runtime',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HashedModuleIdsPlugin(), // 避免所有的檔案 hash 都改變
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(), // 清除 dist 的內容
    new HtmlWebpackPlugin({
      // 幫我們把 dist 中的 js 檔注入 html 當中
      template: path.join(paths.src, 'index.html'),
      filename: path.join(paths.dist, 'index.html'),
      inject: true,
      hash: false,
      minify: {
        removeComments: devMode ? false : true,
        collapseWhitespace: devMode ? false : true,
        minifyJS: devMode ? false : true,
        minifyCSS: devMode ? false : true,
      },
    }),
    // 把所有的 SCSS 打包成一支單檔
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].css?[hash]',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/vendor'),
        to: path.resolve(__dirname, 'dist/vendor'),
      },
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 8080,
    index: 'index.html',
    hot: true,
    host: '0.0.0.0', // 預設是 localhost，設定則可讓外網存取
    // open: true      // 打開瀏覽器
  },
};
