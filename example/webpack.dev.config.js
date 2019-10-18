const path = require('path');
const {smart} = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = env => (smart(base(env), {
    mode: 'development',
    devServer: {
        port: 3210,
        progress: true,
        contentBase: './build',
        compress: true,
        open: true,
        historyApiFallback: true,
    },
    devtool: 'source-map',
    watch:true,
    watchOptions:{
        ignored:/node_modules/
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ]
    }
}));
