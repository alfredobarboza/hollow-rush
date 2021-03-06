const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'build/assets', to: 'assets' }
      ]
    }),
    new HTMLWebpackPlugin({
      template: 'build/index.html',
      filename: 'index.html',
      hash: true,
      minify: false
    }),
    new webpack.DefinePlugin({
      "APP_VERSION": JSON.stringify(process.env.npm_package_version)
    })
  ]
};
