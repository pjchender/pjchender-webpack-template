# Webpack 起步走（Webpack Basic）

## 最陽春的 webpack 設定檔

### 安裝
```shell
npm install --save-dev webpack
```

### webpack 設定檔

在 webpack 的設定檔中，有兩個最基本的必填屬性，分別是 `entry` 和 `output`。
- 在 `entry` 中，我們可以直接放相對路徑。
- 在 `output` 的
-- `path` 中，我們則是要放絕對路徑，在這裡我們可以使用 Node 提供的 path module 來取得當前資料夾的絕對路徑，慣例上會使用 `build` 或 `dist`。
--- `[name]` ，它會被 entry 中的 key 換掉
--- `[chunkhash]` 則可讓瀏覽器知道是否需要重新載入檔案
-- `filename` 在慣例上則是會使用 `bundle.js`

```js
// webpack.config.js
const path = require('path')

const config = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'build'), 
    filename: 'bundle.js' 
  }
}

module.exports = config
```

## LOADER: Babel

在 webpack 中可以套用許多不同的 `modules`，最常用的 modules 是各種 `loaders`， `loader` 的功用就是告訴 webpack 該如何處理匯入的檔案，通常是 Javascript 但 webpack 不限於處理 Javascript，其他資源檔像是 Sass，圖片等也都可以處理，只要提供對應的 loader。

同時 loader 也可以串連使用，概念上類似於 Linux 中的 pipe，A Loader 處理完之後把結果交給 B Loader 繼續轉換，以此類推。

在這裡我們要先來學習使用 `Babel`，它可以用來幫我們將 ES6 或更之後的語法轉譯成 ES5 或其他版本的 JS 語法，其中包含了三個主要模組：
- babel-loader：用來告訴 babel 如何和 webpack 合作。
- babel-core：知道如何載入程式碼、解析和輸出檔案（但不包含編譯）。
- babel-preset-env：讓 babel 知道如何將不同版本的 ES 語法進行轉譯。

### 安裝 babel
```shell
npm install --save-dev babel-core babel-loader babel-preset-es2015
```

```jsx
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

```yml
# .babelrc
{
  "presets": [
    [
      "es2015", 
      { "modules": false, "loose": false }
    ]
  ]
}
```

## LOADER: CSS (SCSS/SASS)

### 安裝

```shell
npm install --save-dev css-loader style-loader sass-loader node-sass
```

### 設定

```jsx
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

### 使用

```jsx
// ./src/index.js

import './styles/style.scss'
```

## LOADER: 處理圖片

### 安裝

```shell
npm install --save-dev file-loader url-loader
```

### 設定

```jsx
// webpack.config.js
module:{
  rules:[
    // url lodaer (for image)
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

### 使用

```jsx
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

## 拆檔載入：System.import

為了要達到 `codesplitting` 的效果，我們要用到 ES6 中的 `System.import('module')` 這個方法，當滑鼠點擊的時候，它會以非同步的方式載入特定的 module（在這裡是 image-viewer.js）以及和這個 module 相依的其他 modules。

透過 `System.import` 它會回給我們一個 `Promise`：

```jsx
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


## 拆檔載入：通用程式碼

使用 webpack 內建的 `webpack.optimize.CommonsChunkPlugin`

### 設定

```jsx
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

### 使用

使用時一定要記得把 `vendor` 放在 `bundle` 之前，不然會出錯
```htmlmixed
<!--  index.html -->
<script src="./dist/vendor.js"></script>
<script src="./dist/bundle.js"></script>
```

## 外掛：自動注入 HTML

### 安裝

```shell
npm install --save-dev html-webpack-plugin
```

### 設定

因為現在在 `dist` 中也會輸出一支 `index.html` 檔，也就是說 `index.html` 和 `bundle.js` 是在同一個資料夾中，所以把原本設定 的 `publicPath` 拿掉

```jsx
//  webpack.config.js
output: {
  path: path.join(__dirname, 'dist'),
  filename: '[name].js'           // [name] 會被 entry 中的 key 換調
  // publicPath: 'dist/'
},
//  ... 
plugins: [
  // 幫我們把 dist 中的 js 檔注入 html 當中
  new HtmlWebpackPlugin({
    template: './index.html'          // 以 index.html 這支檔案當作模版注入 html
  })
]
```

## 外掛：獨立的 CSS 檔

### 安裝
```shell
npm install --save-dev extract-text-webpack-plugin
```

### 設定
```jsx
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

## webpack-dev-server

### 安裝

```shell
npm install --save-dev webpack-dev-server
```

### 設定
```json
// package.json

"scripts": {
  "build": "webpack",
  "dev": "webpack-dev-server --inline --hot",
}
```

## 處理 cache

### 安裝

```shell
npm install --save-dev rimraf
```

### 設定

在 filename 中加上 `[hash]`

```jsx
//  webpack.config.js

output: {
  path: path.join(__dirname, 'dist'),
  filename: '[name].[hash].js'           // [name] 會被 entry 中的 key 換調
  // publicPath: 'dist/'
}

```

在 package.json 中加上 `clean` 指令，在每次執行前都清空資料夾：

```jsx
// package.json

"scripts": {
  "clean": "rimraf dist",
  "build": "npm run clean && webpack",
  "dev": "npm run clean && webpack-dev-server --inline --hot"
}
```

## 發佈

### 設定

`webpack -p` 時，webpack 會把所有的 js 檔壓縮。

```jsx
// package.json

"scripts": {
  "clean": "rimraf dist",
  "build": "npm run clean && webpack",
  "dev": "npm run clean && webpack-dev-server --inline --hot",
  "deploy": "npm run clean && webpack -p"
}
```


## 參考資料
- [[譯 + 補充] Webpack 2 入門](https://segmentfault.com/a/1190000008390333#articleHeader1) by Andyyou @ segmentfault
- [Webpack 2: The Complete Developer's Guide](https://www.udemy.com/webpack-2-the-complete-developers-guide/learn/v4/overview) @ Udemy