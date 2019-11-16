const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
      { test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}]}) },
      { test: /\.scss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'sass-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}]}) },
      { test: /\.less$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'less-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}]}) },
      { test: /\.(jpg|png|gif|bmp|jpeg|ttf|eot|svg|woff|woff2)$/, use: [{loader: "url-loader", options: {limit:10240, name: 'assets/[name]-[hash:8].[ext]'}}] },
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader?configFileName=tsconfig.dev.json'], exclude: /node_modules/ }
    ]
  },

  resolve:{
    extensions: [".js", ".jsx", ".ts", ".tsx", "json", "*"]
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
    ignored: /node_modules/
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].[md5:contenthash:hex:8].css',
      allChunks: false
    }),
    new htmlWebpackPlugin({
      template: 'example/index.html',
      hash: false
    })
  ]
}