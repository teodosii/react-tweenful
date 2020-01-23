const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: './site/index.js',

  devtool: 'cheap-module-source-map',

  output: {
    publicPath: "/",
    path: path.resolve(__dirname, 'dist'),
    filename: 'site-bundle.js'
  },

  devServer: {
    open: true,
    compress: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist')
  },

  resolve: {
    alias: {
      'react-tweenful': path.resolve(__dirname, 'src'),
      'site': path.resolve(__dirname, 'site')
    },
    extensions: ['.js', '.css', '.scss']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: ['eslint-loader'],
        include: /samples/
      },
      {
        test: /\.(css|scss)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
      watch: true,
      beforeEmit: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './site/html/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.NamedModulesPlugin()
  ]
};