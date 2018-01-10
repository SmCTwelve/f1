const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  disable: process.env.NODE_ENV !== "production"
});

if (process.env.NODE_ENV !== "production") {
  console.log("DEVELOPMENT MODE");
}
else {
  console.log("PRODUCTION MODE");
}

module.exports = {
  entry: {
    app: './src/index.js'
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    extractSass
  ],

  // loaders
  module: {
    rules: [
      // babel
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      // sass
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/styles'),
        use: extractSass.extract({
            use: ["css-loader", "postcss-loader", "sass-loader"],
            // use style-loader in development
            fallback: "style-loader"
        })
      },
      // images
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'src/images'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      }
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: process.env.NODE_ENV === "production" ? 'dist/' : '/'
  }

};
