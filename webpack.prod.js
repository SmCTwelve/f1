const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin(),
  ],
  module: {
    rules: [
      {
        // Compress images
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'src/images'),
        use: [
        {
          loader: 'image-webpack-loader',
          options: {
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            mozjpeg: {
              progressive: true,
              quality: 65
            }
          }
        }
      ]},
      // next rule
    ]
  }
});
