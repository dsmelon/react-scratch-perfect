const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
module.exports = {
  mode: 'production', 
  
  entry: {
    index: './example/index.jsx'
  },

  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      { test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}]}) },
      { test: /\.scss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'sass-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}]}) },
      { test: /\.less$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'less-loader', {loader: 'postcss-loader', options: { plugins: [autoprefixer()]}}]}) },
      { test: /\.(jpg|png|gif|bmp|jpeg|ttf|eot|svg|woff|woff2)$/, use: [{loader: 'url-loader', options: {limit:1024, name:'assets/[name]-[hash:8].[ext]'}}] },
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader?configFileName=tsconfig.example.json'], exclude: /node_modules/ }
    ]
  },
  devtool: false,

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '.',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },

  resolve:{
    extensions: [".js", ".jsx", ".ts", ".tsx", "json", "*"]
  },

  plugins: [
    new CleanWebpackPlugin(),
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