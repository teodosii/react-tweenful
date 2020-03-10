const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/react-tweenful.js',
    library: 'Tweenful',
    libraryTarget: 'commonjs2'
  },

  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
  },

  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      samples: path.resolve(__dirname, 'site')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: /src/
      },
      {
        test: /\.(js|jsx)$/,
        use: ['eslint-loader'],
        include: /src/
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
      watch: true,
      beforeEmit: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
  }
};
