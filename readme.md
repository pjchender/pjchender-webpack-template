---
title: "Webpack 學習筆記（Webpack Note）"
date: 2018-05-17 10:10:10
banner: undefined
categories:
- Webpack
tags:
- javascript
- webpack
- udemy
- Webpack2 The Complete Developers Guide
---

# Webpack 學習筆記（Webpack Note）

@(Javascript)[webpack]

```bash
$ npx webpack
$ npx webpack --config webpack.config.js  # default is webpack.config.js
$ npx webpack -p              # build in production
$ npx webpack-dev-server --open        # run in dev-server
$ npm run build -- --mode production --display-used-exports  # 顯示有用到的 exports
```

> [[檔案] PJCHENder-webpack-template](https://github.com/PJCHENder/pjchender-webpack-template) @ github

## 目錄

[TOC]

## 常用

> [Webpack 4 常用設定](https://gist.github.com/PJCHENder/246327a40dea63c5adf50eaba32c9db4) @ PJCHENder gist

## 概念（Concept）

過去我們會將套件直接從 `<head></head>` 中透過 `<script src="">` 載入，這種做法稱作「隱式依賴關係（implicit dependency）」，因為在 `index.js` 中沒有宣告它需要使用什麼套件，而是預期它會在全域載入。但這麼做有幾個缺點：

- 沒辦法清楚看到程式碼依賴外部的函式庫。
- 如果依賴不存在，或者引入順序錯誤，應用程序將無法正常運行。
- 如果依賴被引入但是並沒有使用，瀏覽器將被迫下載無用代碼。

因此，我們可以用 webpack 來管理我們的程式碼。

Webpack 包含 4 個核心部分：

- Entry
- Output
- Loaders
- Plugins
- (Mode)

> [Concepts](https://webpack.js.org/concepts/) @ Webpack Concept

> 注意：在 Webpack 4 中有部分 API 有變動，若下面文章有無法使用的，可以參考 [webpack 4 announcement](https://goo.gl/FQjBc7) @ GitHub issues 查看更新項目。

## 最陽春的 webpack 設定檔（Entry & Output）

Webpack 的設定檔（configuration file）就是一個匯出為物件的 JS 檔案。

> [Configuration](https://webpack.js.org/concepts/configuration/) @ Webpack Concept

### 安裝

```shell
npm install --save-dev webpack webpack-cli
```

**package.json**

```javascript
// package.json
"scripts": {
  "start": "webpack --config webpack.config.js"
}
```

### Entry and Output

在 webpack 的設定檔中，有兩個最基本的必填屬性，分別是 `entry` 和 `output`。
- 在 `entry` 中，我們**可以放相對路徑**。
- 在 `output` 的
-- `path` 中，我們則是**一點要放絕對路徑**，在這裡我們可以使用 Node 提供的 path module 來取得當前資料夾的絕對路徑，慣例上會使用 `build` 或 `dist`。
--- `[name]` ，它會被 entry 中的 key 換掉
--- `[chunkhash]` 則可讓瀏覽器知道是否需要重新載入檔案
-- `filename` 在慣例上則是會使用 `bundle.js`

```javascript
// webpack.config.js
const path = require('path')

const config = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
}

module.exports = config
```

> - [Entry Points](https://webpack.js.org/concepts/entry-points/) @ Webpack Concept
> - [Output](https://webpack.js.org/concepts/output/) @ Webpack Concept

#### 打包成多支 output

設定兩個 entry，會根據 entry 的 Key 產生兩隻檔案：`app.bundle.js` 和 `print.bundle.js`

```javascript
// webpack.config.js

const path = require('path')

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```



### 打包

```bash
# 使用 npm
$ npm run start

# 使用 npx
$ npx webpack
```

## Loader

在 webpack 中可以套用許多不同的 `modules`，最常用的 modules 是各種 `loaders`， `loader` 的功用就是告訴 webpack 該**如何**處理匯入的檔案，通常是 Javascript 但 webpack 不限於處理 Javascript，其他資源檔像是 Sass，圖片等也都可以處理，只要提供對應的 loader。

同時 loader 也可以串連使用，概念上類似於 Linux 中的 pipe，A Loader 處理完之後把結果交給 B Loader 繼續轉換，以此類推，串連的時候則是**以反方向執行（由右至左）**。

> [Loader](https://webpack.js.org/concepts/loaders/) @ Webpack Concept

### Loader - CSS (SCSS/SASS)

##### keywords: `style-loader`, `css-loader`, `sass-loader`, `node-sass`

- 不需要使用 SASS：只時要打包 CSS 檔案的話，只需透過 `style-loader` 和 `css-loader`，做法可參考 [Asset Management - Loading CSS](https://webpack.js.org/guides/asset-management/#loading-css) @ Webpack Guide，如此 webpack 會在該頁面將特定的 CSS 灌入 `<head></head>` 內。
- 需要使用 SASS ：則須再透過 `sass-loader` 和 `node-sass`。

> - 需要安裝 **file-loader** 並進行相關設定後才能處理圖片資源。
> - 若希望抽成 css 檔，須透過 **extract-text-webpack-plugin** ，但目前 webpack 4 仍不支援。

#### 安裝

```shell
npm install --save-dev style-loader css-loader sass-loader node-sass
```

#### 設定

```javascript
// webpack.config.js

module: {
  rules: [
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
}
```

#### 使用

```javascript
// ./src/index.js

import './styles/style.scss'
```

#### Issues

- [使用 `url(…)` 需注意的問題](https://webpack.js.org/loaders/sass-loader/#problems-with-url) @ sass-loader。



### Loader - 處理圖片

##### keywords: `file-loader`, `url-loader`

#### 相關 loader

- [file-loader](https://webpack.js.org/loaders/file-loader/)：將圖片打包到 `output` 中，並處理檔名。
- [url-loader](https://webpack.js.org/loaders/url-loader/)：做的事情和 file-loader 很接近，但是當圖片檔案大小，小於設定值時，可以轉換成 DataURL。

#### 安裝

```shell
npm install --save-dev url-loader
```

#### 設定

```javascript
// webpack.config.js
module:{
  rules:[
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
}
```

#### 使用

```javascript
// ./src/image-viewer.js
import midImgUrl from './../assets/mid.jpeg'
import minImgUrl from './../assets/min.jpeg'

// midImg 會是被壓縮過的檔案名稱
const midImg = document.createElement('img')
midImg.src = midImgUrl
document.body.appendChild(midImg)

// minImg 是被注入在 bundle.js 中，可以直接使用
const minImg = document.createElement('img')
minImg.src = minImgUrl
document.body.appendChild(minImg)

export {midImg, minImg}
```

### Loader - 處理字型

##### keywords: `file-loader`

要處理字型可以使用 `file-loader`。

#### 設定

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
}
```

#### 使用

```css
/* main.scss */

@font-face {
  font-family: 'Roboto';
  src: url('./../fonts/Roboto-Regular.ttf') format('ttf');
  font-weight: normal;
  font-style: normal;
}

.hello {
  color: tomato;
  font-family: 'Roboto';
}
```

### Loader - 處理資料（JSON, CSV, XML）

##### keywords: `csv-loader`, `xml-loader`

#### 安裝

```bash
npm install --save-dev csv-loader xml-loader
```

> Webpack 內建就可以處理 JSON 格式，可以不用安裝額外的 loader。

### Loader - Babel

在這裡我們要先來學習使用 `Babel`，它可以用來幫我們將 ES6 或更之後的語法轉譯成 ES5 或其他版本的 JS 語法，其中包含了三個主要模組：
- babel-loader：用來告訴 babel 如何和 webpack 合作。
- babel-core：知道如何載入程式碼、解析和輸出檔案（但不包含編譯）。
- babel-preset-env：讓 babel 知道如何將不同版本的 ES 語法進行轉譯。

#### 安裝 babel

```shell
npm install --save-dev babel-core babel-loader babel-preset-es2015
```

```javascript
// webpack.config.js
module: {
  rules: [
    // babel-loader
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }
  ]
}
```

在 `babel-loader` 中 `presets` 的部分，
- `loose`: 該模式啟動下 Babel 會盡可能產生較精簡的 ES5 程式碼，預設 false 會盡可能產出接近 ES2015 規範的程式碼。
- `modules`: 轉換 ES2015 module 的語法（import）為其它類型，預設為 true 轉換為 commonjs。
- Tree Shaking 的特性 - 移除沒有使用到的 exports 來縮小編譯的檔案大小。

```javascript
// .babelrc
{
  "presets": [
    [
      "es2015",
      { "modules": false, "loose": false }
    ]
  ]
}
```



## Plugin（外掛）

由於**插件**可以傳入參數/選項，你必須在 webpack 配置中，向 `plugins` 屬性傳入 `new` 實例。

> [Plugin](https://webpack.js.org/concepts/plugins/) @ Webpack Concept

### Plugin - 清除 dist 資料夾

##### keywords: `clean-webpack-plugin`

透過 `clean-webpack-plugin` 可以讓 webpack 每次打包前都清除特定資料夾。

```bash
$ npm install clean-webpack-plugin --save-dev
```

**webpack.config.js**

```javascript
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // ...
  ]
}
```

### Plugin - 操作與注入 HTML

##### keywords: `html-webpack-plugin`

> - [Setting up html-webpack-plugin](https://webpack.js.org/guides/output-management/#setting-up-htmlwebpackplugin) @ Webpack Guide - Output Management
> - [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) @ GitHub

#### 安裝

```shell
npm install --save-dev html-webpack-plugin
```

#### 設定

因為現在在 `dist` 中也會輸出一支 `index.html` 檔，也就是說 `index.html` 和 `bundle.js` 是在同一個資料夾中，所以把原本設定 的 `publicPath` 拿掉

```javascript
// webpack.config.js
// html-webpack-plugin 可以幫我們把 dist 中的 js 檔注入 html 當中
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack 4 - Output Management with HtmlWebpackPlugin',
      template: './index.html'          // 以 index.html 這支檔案當作模版注入 html
    })
  ]
}
```

### Plugin - 獨立的 CSS 檔

> 目前 extract-text-webpack-plugin 仍不支援 webpack 4（2018.05.06）。

#### 安裝

```shell
npm install --save-dev extract-text-webpack-plugin
```

#### 設定

```javascript
// webpack.config.js
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// ...

module: {
  rules:[
    // scss loader
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      // use: [
      //   'style-loader',
      //   'css-loader',
      //   'sass-loader'
      // ]
    }
  ]
}
// ...
plugins: [
  // 將樣式輸出成 css 檔
  new ExtractTextPlugin('[name].css'),
]
```

## 開發環境（Development）

這部分的內容建議**只使用在開發環境下，避免在上線模式使用**。

> [Development](https://webpack.js.org/guides/development/) @ Webpack Guides

### 使用 Source map

透過 source map 可以在程式碼出錯時，方便我們找到錯誤的程式碼在哪一隻檔案：

```javascript
// webpack.config.js

module.exports = {
  devtool: 'inline-source-map',
  // ...
}
```

### 使用觀察模式（Using Watch Mode）

透過 `watch` 指令可以讓 webpack 監控所有依賴圖（dependency graph）下的檔案有無變更，如果其中有檔案變更了，程式碼就會被重新編譯，因此不需要手動執行 build 指令。唯一的缺點是，為了看到修改後的實際效果，**你需要刷新瀏覽器**。

> 透過 watch mode 仍需要手動重新整理瀏覽器。

```javascript
// package.json
{
  "name": "development",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "watch": "webpack --watch",
    "build": "webpack"
  }
}
```

### Using webpack-dev-server

透過 webpack-dev-server 可以幫助我們不用每更改一次檔案就執行一次 `npm run build` 去打包檔案，而且它**會自動幫我們重新整理瀏覽器**。

#### 安裝

```shell
npm install --save-dev webpack-dev-server
```

#### 設定

**webpack.config.js**

告訴 webpack-dev-server 從 `./dist` 資料夾提供檔案到 `localhost:8080`：

```javascript
module.exports = {
  devServer: {
    contentBase: './dist'
  },
  // ...
}
```

**package.json**

```javascript
/**
 * --open 於瀏覽器打開 webpack-dev-server
 * --inline: 瀏覽器自動重新整理（live reload）
 * --hot: 啟動 HotModuleReplacement
{
  "scripts": {
    // ...
  "start": "webpack-dev-server --open",
    // "dev": "webpack-dev-server --inline --hot",
  }
}
```

> [DevServer](https://webpack.js.org/configuration/dev-server/#devserver) @ Webpack Configuration

### Hot Module Replacement (HMR)

**模組熱替換（Hot Module Replacement, HMR）**的功能可以讓 APP 在開發的過程中，不需要全部重新載入就可以改變、新增或移除模組。**HMR 不適用於上線環境，這意味著它應當只在開發環境使用**。

> - [Hot Module Replacement](https://webpack.js.org/guides/hot-module-replacement/) @ Webpack -guide
> - [Hot Module Replacement](https://webpack.js.org/api/hot-module-replacement/) @ Webpack -API
> - [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) @ Webpack - concept

**webpack.config.js**

```javascript
// webpack.config.js
const webpack = require('webpack')

module.exports = {
  // ...
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

要注意的是這個做**會更新有修改的檔案，但若該檔案內容已經被其他檔案快取起來，則需要該內容也需要被重新更新**，舉例來說，可以透過 `module.hot.accept()` 來定義幫某檔案被更新時，要連動更新的內容：

```javascript
import printMe from './print.js'

function component () {
  ...
}

if (module.hot) {
  module.hot.accept('./print.js', function () {
    // 當 print.js 改變時，在這裡做些什麼...
  })
}
```

###HMR with stylesheet

直接在 config 中使用 `style-loader` 和 `css-loader` ，並把樣式載入到 `index.js` 中，HMR 即會在 CSS 檔案有變更時，重 build 和重新整理瀏覽器。

**webpack.config.js**

```javascript
// webpack.config.js

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

**index.js**

```javascript
// ./src/index.js
import './style.css'
```

## 正式環境（Production Mode）

### 拆檔

由於開發環境和正式環境的目的不同，因此一般會建議針對不同的環境撰寫不同的 webpack 設定檔（`webpack.dev.js`, `webpack.prod.js`）。對於兩個環境通用的設定檔，我們會額外建立一支 `webpack.common.js` ，並且透過 **webpack-merge** 這個套件來將這些 webpack 設定檔合併。

```bash
$ npm install --save-dev webpack-merge
```

```javascript
// webpack.dev.js

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
})
```

> 參考 [Production Setup](https://webpack.js.org/guides/production/#setup) @ Webpack -Guide

### 使用 source map

即使在正式環境仍建議放入 source-map，它可以方便我們除錯和進行測試。但在正式環境應**避免**使用 `inline-***` 和 `eval-***` 這種，因為它們會增加打包後檔案的大小。

```javascript
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
});
```

> [source mapping](https://webpack.js.org/guides/production/#source-mapping) @ Webpack Guide - Production

### 定義環境（Specify Environment）

許多套件都會根據 `process.env.NODE_ENV` 來對打包的結果進行調整（例如添加或移除註解），透過 `webpack.DefinePlugin()` 我們可以定義環境變數：

```javascript
// webpack.prod.js
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
```

特別需要留意的是在設定檔中（webpack.config.js），`process.env.NODE_ENV` 還不會被設定成 `production` ，因此如果再設定檔中使用 `process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js'` 這樣的設定是**無效**的。

> [Specify the environment](https://webpack.js.org/guides/production/#specify-the-environment) @ Webpack Guide - Production

### 使用指令

除了在設定檔中設定 `mode: production` 以及上面所說的設定外，也可以用指令的方式，但還是建議放在設定檔比較清楚：

```bash
$ npx webpack -p        # 等同於 --optimize-minimize --define

$ npx webpack --optimize-minimize               # 會自動套用 UglifyJSPlugin
$ npx webpack --define process.env.NODE_ENV="'production'"  # 等同於使用 DefinePlugin
```

## 代碼分離（Code Splitting）

有三個通用可以達到代碼分離的效果：

- Entry Points: 手動在 [`entry`](https://webpack.js.org/configuration/entry-context) 中設定。
- Prevent Duplication: 使用 [`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/) 移除重複的代碼並切塊（split chunks）。
- Dynamic Imports: 透過在模組中呼叫 inline function 來分離代碼。

> [Code Splitting](https://webpack.js.org/guides/code-splitting/) @ Webpack Guide

### Entry Points

這麼做可能會重複載入相同的模組，需進一步使用 `SplitChunksPlugin`：

```javascript
// webpack.config.js
const path = require('path');

// 如果 index.js 和 another_module.js 有 import 相同的模組時，會重複載入
module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another_module.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

### Prevent Duplication

使用 [`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/)  移除重複的代碼並切塊（split chunks）：

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another_module.js'
  },
  plugins: [
    new webpack.optimize.SplitChunksPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

> 在 Webpack 4 以前使用的是  CommonsChunkPlugin，使用方式可參考 [Prevent Duplication](https://webpack.js.org/guides/code-splitting/#prevent-duplication) @ Webpack Guide - Code Splitting。

> 延伸閱讀：[webpack4—SplitChunksPlugin使用指南](https://blog.csdn.net/qq_26733915/article/details/79458533) @ xhsdnn 的博客

### 動態載入（Dynamic Import）

使用 `import()` 可以動態載入模組，import( ) 背後是透過 Promise 運作：

```javascript
// index.js
function getComponent() {
  return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
      return element;
    })
    .catch(error => console.log('An error occurred while loading component.', error))
}

getComponent().then(component => {
  document.body.appendChild(component);
})
```
因此也可以用 `async await`：
```javascript
async function getComponent() {
  var element = document.createElement('div');
  const {default: _} = await import(/* webpackChunkName: "lodash" */ 'lodash');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}

getComponent().then(component => {
  document.body.appendChild(component);
})
```
> - [Dynamic Import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) @ Webpack Guide - Code Splitting
> - [Update code-splitting.md](https://github.com/webpack/webpack.js.org/pull/2153) @ Github Issues

### 提前請求（prefetch）或載入（preload）模組

在 webpack 4.6.0+ 支援：

- prefetch: 資源可能在稍後的瀏覽（navigation）中會用到
- preload: 資源可能會在當前的瀏覽（navigation）中用到

> [prefetching/preloading modules](https://webpack.js.org/guides/code-splitting/#prefetching-preloading-modules) @ Wepback Guide - Splitting Code

## 其他

### Tree Shaking

*Tree shaking* 這個術語，通常用於描述移除 JavaScript 上下文中的未使用到的程式碼（dead-code）。在 Webpack 4 中透過 `package.json` 的 **`sideEffects`** 屬性作為標記，向 compiler 提供提示，說明哪些檔案是 **pure** 的，因此可以安全地刪除這些未使用的部分。

> 這個部分官方文件寫的不是非常清楚。大概是在 production mode 的時候，webpack 會自動移除沒用到的 dead code。

### 拆檔載入 - System.import

為了要達到 `codesplitting` 的效果，我們要用到 ES6 中的 `System.import('module')` 這個方法，當滑鼠點擊的時候，它會以非同步的方式載入特定的 module（在這裡是 image-viewer.js）以及和這個 module 相依的其他 modules。

透過 `System.import` 它會回給我們一個 `Promise`：

```javascript
// ./src/index.js

const button = document.createElement('button')
button.innerText = 'Click Me'
button.onclick = () => {
  // 點擊時才載入 image-viewer.js
  // System.import 會回傳一個 Promise 物件
  System.import('./image-viewer')
  .then(module => {
    console.log('module', module)
  })
}
```

### 拆檔載入 - 通用程式碼

使用 webpack 內建的 `webpack.optimize.CommonsChunkPlugin`

#### 設定

```javascript
// webpack.config.js

// 放入 package.json 中所有 dependency 的 module
const VENDOR_LIBS = ['lodash']

entry: {
  bundle: './src/index.js',
  vendor: VENDOR_LIBS            // 產生 vendor.js
},
output: {
  path: path.join(__dirname, 'dist'),
  filename: '[name].js',           // [name] 會被 entry 中的 key 換調
  publicPath: 'dist/'
}

// ...

plugins: [
    // 避免 vendor 內的程式碼同時出現在 vendor.js 和 bundle.js 中
    new webpack.optimize.CommonsChunkPlugin(
      ['vendor', 'manifest']
    ),
]
```

#### 使用

使用時一定要記得把 `vendor` 放在 `bundle` 之前，不然會出錯
```html
<!--  index.html -->
<script src="./dist/vendor.js"></script>
<script src="./dist/bundle.js"></script>
```

### 發佈

#### 設定

`webpack -p` 時，webpack 會把所有的 js 檔壓縮。

```javascript
// package.json

"scripts": {
  "clean": "rimraf dist",
  "build": "npm run clean && webpack",
  "dev": "npm run clean && webpack-dev-server --inline --hot",
  "deploy": "npm run clean && webpack -p"
}
```

## TODO

- [Resolve Alias](https://webpack.js.org/configuration/resolve/#resolve-alias)
- [Getting started with CSS sourcemaps and in-browser Sass editing](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0) @ Medium
- 如何在 webpack 4 中就 sass 抽成單一 css 檔（[extract-text-webpack-plugin](https://webpack.js.org/plugins/extract-text-webpack-plugin/)）
- [Introduction to sourcemap](http://blog.teamtreehouse.com/introduction-source-maps) @ Treehouse


## 參考資料
- [Ｗebpack Guide](https://webpack.js.org/guides/getting-started/) @ Webpack
- [[譯 + 補充] Webpack 2 入門](https://segmentfault.com/a/1190000008390333#articleHeader1) by Andyyou @ segmentfault
- [Webpack 2: The Complete Developer's Guide](https://www.udemy.com/webpack-2-the-complete-developers-guide/learn/v4/overview) @ Udemy
