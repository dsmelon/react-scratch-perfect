const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  
  entry: {
    index: './example/index.jsx'
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "dist")
  },

  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.(jpg|png|gif|bmp|jpeg|ttf|eot|svg|woff|woff2)$/, use: [{loader: "url-loader", options: {limit:1024, name:'[name]-[hash].[ext]'}}] },
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },

  devServer: {
    port: 8000,
    open: true,
    hot: true,
    host: "localhost",
    stats: "errors-only"
  },

  devtool: 'inline-source-map',

  watchOptions: {
    ignored: /node_modules/,
    poll: false
  },

  plugins: [
    new htmlWebpackPlugin({
      template: 'example/index.html',
      hash: true
    })
  ]
}