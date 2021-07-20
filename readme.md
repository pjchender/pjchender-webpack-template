# PJCHENder Webpack Template

## TODO

- [x] integrate conventional commit
- [x] migrate to webpack5
- [x] integrate React
- [ ] modify eslint config
- [ ] check lint with husky

## 說明

此專案為 Webpack 起手的專案架構，在此架構中可以編譯 SCSS、與 ES6+ 的 JavaScript 檔案。

## 使用方式

### 開發環境

```bash
$ npm run start         # 開發環境 localhost:8080
```

接著進到 [localhost:8080](http://localhost:8080) 即可。

### 打包專案

若要啟動打包好的專案，需要啟用測試伺服器：

```bash
$ npm run build:prod    # 打包專案
$ cd dist
$ python -m SimpleHTTPServer
```

接著進到 [localhost:8000](http://localhost:8000) 即可。

## Webpack 相關設定

Webpack 相關設定說明可參考 [Webpack 學習筆記（Webpack Note）](https://pjchender.dev/webpack/note-webpack/)
