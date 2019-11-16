const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
module.exports = {
  mode: 'production', 
  
  entry: {
    index: './src/index.tsx'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "lib"),
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}] },
      { test: /\.(jpg|png|gif|bmp|jpeg|ttf|eot|svg|woff|woff2)$/, use: [{loader: 'url-loader', options: {limit:1024, name:'assets/[name]-[hash:8].[ext]'}}] },
      { test: /\.(j|t)sx?$/, use: 'awesome-typescript-loader?configFileName=tsconfig.prod.json', exclude: /node_modules/ }
    ]
  },

  externals: [nodeExternals()],

  resolve:{
    extensions: [".js", ".jsx", ".ts", ".tsx", "json", "*"]
  },

  plugins: [
    new CleanWebpackPlugin()
  ]
}