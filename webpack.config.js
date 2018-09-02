const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = () => {
  // Setup paths
  const baseDir = __dirname;
  const nodeModulesPath = path.join(baseDir, 'node_modules');
  const srcPath = path.join(baseDir, 'js');
  const destPath = path.join(baseDir, 'build');

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  };

  return {
    context: __dirname,
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    entry: {
      main: [
        'babel-polyfill',
        path.join(srcPath, 'main.tsx'),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        title:  "CSS",
        template: path.join('./', 'index.html'),
        filename: 'index.html',
      }),
      new ForkTsCheckerWebpackPlugin({
        workers: Math.max(1, Math.floor(ForkTsCheckerWebpackPlugin.ALL_CPUS / 2 - 1)),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
      })
    ],
    resolve: {
      extensions: ['.js', '.tsx'],
      modules: [srcPath, nodeModulesPath, 'js'],
    },
    resolveLoader: {
      modules: [nodeModulesPath],
    },
    output: {
      path: destPath,
      publicPath: './',
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: [
            babelLoader,
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            babelLoader,
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: /(node_modules)/,
        },
        {
          // Process source maps included in transpiled ts-files
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
        {
          test: /^((?!\.module).)*css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader'},
          ],
        },
        {
          test: /^((?!\.module).)*less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader'},
            {loader: 'less-loader'},
          ],
        },
        {
          test: /\.module\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', options: {modules: true, importLoaders: 0, localIdentName: "[name]__[local]__[hash:base64:5]"}},
          ],
        },
        {
          test: /\.module\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', options: {modules: true, importLoaders: 1, localIdentName: "[name]__[local]__[hash:base64:5]"}},
            {loader: 'less-loader'},
          ],
        },
        {
          test: /\.woff(2)?$/,
          use: {
            loader: 'url-loader',
            query: {limit: 10000, mimetype: "application/font-woff"},
          },
        },
        {
          test: /\.(ttf|eot|svg)$/,
          use: 'file-loader',
        },
        {
          test: /\.(png|jpg)$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 128, // inline base64 URLs for <=128byte images, direct URLs for the rest
            },
          },
        },
      ],
    },
  };
};
