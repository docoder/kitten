const {smart} = require('webpack-merge');
const base = require('./webpack.base.config');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = smart(base, {
    mode: 'production',
    optimization:{
    minimizer:[
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true 
      }),
      new OptimizeCss()
    ]
  },
});
