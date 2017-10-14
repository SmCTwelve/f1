const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // change to 'inline-source-map' for better error tracing
  devtool: 'cheap-module-source-map',
  // server
  devServer: {
    hot: true,
    publicPath: '/',
    contentBase: './public'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]

});
