var path = require('path');
var webpack = require('webpack');

var babelConfig = {
  stage: 0,
  env: {
    development: {
      plugins: ['./build/babelRelayPlugin'],
    },
    production: {
      plugins: ['./build/babelRelayPlugin'],
    }
  }
};

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'data')],
      query: babelConfig
    },{
      test: /\.(glsl|frag|vert)$/,
      loaders: ['raw', 'glslify'],
      include: [path.join(__dirname, 'src')]
    }]
  }
};
