const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  return {
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 3000
    },
    devtool: 'inline-source-map',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'build/assets', to: 'assets' },
          { from: 'build/styles', to: 'styles' }
        ]
      }),
      new HTMLWebpackPlugin({
        template: 'build/index.html',
        filename: 'index.html'
      }),
      new webpack.DefinePlugin({
        "APP_VERSION": JSON.stringify(process.env.npm_package_version),
        "DEBUG_MODE": !!env.debugMode
      })
    ]
  }
};
