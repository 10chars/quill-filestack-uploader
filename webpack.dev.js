const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
    filename: 'quill.filestackUploader.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules', 'src'],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    overlay: {
      errors: true
    },
    open: true,
    inline: true,
    host: 'localhost',
    publicPath: `/`,
    stats: 'errors-only'
  },
  externals: {
    quill: 'Quill',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.ejs'),
      title: process.env.npm_package_name,
      inject: 'head',
      filestackApiKey: process.env.FILESTACK_API_KEY
    }),
    new ErrorOverlayPlugin()
  ],
};
