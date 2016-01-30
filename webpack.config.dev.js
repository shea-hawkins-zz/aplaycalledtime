var path = require('path');
var webpack = require('webpack');

var babelConfig = {
  stage: 0,
  env: {
    development: {
      plugins: ["react-transform", './build/babelRelayPlugin'],
      extra: {
        "react-transform": {
          transforms: [{
            transform: "react-transform-hmr",
            imports: ["react"],
            locals: ["module"]
          }, {
            transform: "react-transform-catch-errors",
            imports: ["react", "redbox-react"]
          }]
        }
      }
    },
    production: {
      plugins: ["react-transform", './build/babelRelayPlugin'],
      extra: {
        "react-transform": {
          transforms: [{
            transform: "react-transform-hmr",
            imports: ["react"],
            locals: ["module"]
          }, {
            transform: "react-transform-catch-errors",
            imports: ["react", "redbox-react"]
          }]
        }
      }
    },
  }
};

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'data')],
      query: babelConfig
    }]
  }
};
