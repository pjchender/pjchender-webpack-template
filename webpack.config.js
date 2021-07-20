const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
};

// eslint-disable-next-line no-console
console.log(`Building for ${devMode ? 'development' : 'production'}...`);

module.exports = {
  mode: devMode ? 'development' : 'production',
  devtool: devMode ? 'inline-source-map' : 'source-map',
  entry: {
    app: './src/index.js',
  },
  output: {
    // [name] 會被 entry 中的 key 換調
    filename: devMode ? 'js/[name].bundle.js' : 'js/[name].[hash].bundle.js',
    path: path.dist,
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      // 處理 SASS 檔案
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          // 如果希望開發環境就打包出 CSS 檔案，
          // 可以直接使用 MiniCssExtractPlugin.loader，但可能會沒有 HMR
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          'postcss-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      // 處理 JS 檔案
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      // 處理圖檔
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|tiff)$/i,
        type: 'asset',
      },
      // 處理文字檔
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
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
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ids.HashedModuleIdsPlugin(), // 避免所有的檔案 hash 都改變
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // 幫我們把 dist 中的 js 檔注入 html 當中
      template: path.join(paths.src, 'index.html'),
      filename: path.join(paths.dist, 'index.html'),
      inject: true,
      hash: false,
      minify: {
        removeComments: !devMode,
        collapseWhitespace: !devMode,
        minifyJS: !devMode,
        minifyCSS: !devMode,
      },
    }),
    // 把所有的 SCSS 打包成一支單檔
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].css?[hash]',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/vendor'),
          to: path.resolve(__dirname, 'dist/vendor'),
        },
      ],
    }),
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
