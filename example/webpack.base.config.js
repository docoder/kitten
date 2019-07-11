const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const Package = require('./package.json');

module.exports = {
    entry: './src/index.tsx',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    priority: 1,
                    test: /node_modules/,
                    chunks: 'initial',
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.resolve('src'),
                loader: 'awesome-typescript-loader',
                options: {
                    getCustomTransformers: path.join(__dirname, './webpack.ts-transformers.js')
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin(`
@license Kitten v${Package.version}

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
        `)
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
};
