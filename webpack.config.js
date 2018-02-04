const webpack = require("webpack");
const fs = require('fs');
const path = require('path');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    entry: {
        options: path.join(__dirname, 'app', 'js', 'options.js'),
        background: path.join(__dirname, 'app', 'js', 'background.js'),
        notification: path.join(__dirname, 'app', 'js', 'notification.js'),
        download: path.join(__dirname, 'app', 'js', 'download.js'),
        progress: path.join(__dirname, 'app', 'js', 'progress.js'),
        // consts: path.join(__dirname, 'app', 'js', 'consts.js'),
        // utils: path.join(__dirname, 'app', 'js', 'utils.js'),
        shared: ['consts.js', 'utils.js'].map(name => path.join(__dirname, 'app', 'js', name)),

    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    // devServer: {
    //     contentBase: path.join(__dirname, "dist"),
    //     port: 9000
    // },
    // resolve: {
    //     extensions: ['.js', '.vue']
    // },
    plugins: [
        new ExtractTextPlugin('app.bundle.css'),
        new CommonsChunkPlugin({
            name: 'shared',
            chunks: ['shared'],
            minChunks: 2 // The module must be found in at-least two other files/modules before
        }),
        //  Using webpack-html-plugin to create index.html 
        // with inject <script src=to the *.bundle.js>
        new HtmlWebpackPlugin({
            hash: true, // Add an unique hash to the src of the embedded <script> tag.
            inject: true,
            chunks: ['options', 'shared'], // Insert <script> chunks : options.bundle.js
            filename: 'options.html',
            template: path.join(__dirname, 'app', 'frontend', 'options.html')
        }),
        // copy extension manifest and icons
        new CopyWebpackPlugin([
            { from: path.join(__dirname, 'app', 'manifest.json') },
            // { context: './app/assets', from: 'icon-**', to: 'assets' }
            {
                from: path.join(__dirname, 'app', 'assets'),
                to: 'assets'
            }
        ])
    ],

    // stats: { // what bundle information gets displayed
    //     children: false,
    //     chunks: false,
    //     chunkModules: false,
    //     chunkOrigins: false,
    //     modules: false
    // },

    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, './app'),
                    /pretty-bytes/ // <- ES6 module
                ],
                use: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    extractCSS: true
                }
            },
            {
                test: /\.(s*)css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                use: 'file-loader?limit=100000'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 9000, // Convert images < 9kb to base64 strings
                        name: 'img/[name].[ext]?[hash]'
                    }
                }]
            },
        ]
    }



};