const path = require('path')
const webpack = require('webpack')

const config = {
  entry: {
    bundle: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}

module.exports = config
