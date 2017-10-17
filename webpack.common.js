const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});

const compressSass = process.env.NODE_ENV === 'production' ? 'compressed' : 'nested';

module.exports = {
  entry: {
    app: './src/index.js'
  },

  // loaders
  module: {
    rules: [
      // babel
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            cacheDirectory: true
          }
        }
      },
      // sass
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/styles'),
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
            },
            {
                loader: "sass-loader",
                options: {
                  outputStyle: compressSass
                }
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
    }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    extractSass
  ],

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

};
