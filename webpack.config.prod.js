const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  mode: 'production', 
  
  entry: {
    index: './src/index.jsx'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "lib"),
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=5000' },
      { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=5000' },
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },

  externals: [nodeExternals()],

  plugins: [
    
  ]
}