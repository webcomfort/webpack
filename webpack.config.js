const Project = 'iacis30';
const Output = `public/${Project}`;
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => `${Project}.${ext}`;
const optimization = () => {
    const configObj = {};
    if(isProd){
        configObj.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }
    return configObj;
};

const plugins = () => {
    
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: true,
            filename: './index.html',
            minify: {
                preserveLineBreaks: true,
                collapseWhitespace: false
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `${Output}/css/${filename('css')}`,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `src/json`),
                    to: path.resolve(__dirname, `app/${Output}/json`),
                },
            ]
        })
    ];
    return basePlugins;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/app.js',
    output: {
        filename: `${Output}/js/${filename('js')}`,
        path: path.resolve(__dirname, `./app`),
        publicPath: '/',
        assetModuleFilename: `${Output}/images/[name][ext][query]`
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, `./app`),
        },
        open: true,
        compress: true,
        hot: true,
        port: 3000
    },
    performance: {
        hints: false,
        maxEntrypointSize: 1000024,
        maxAssetSize: 1000024
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader:'html-loader',
                    options: {
                        minimize: false,
                    },
                }],
            },
            {
                test: /\.css$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                    },
                }, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    }, 
                    'css-loader', 'sass-loader'
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|webp|svg)$/,
                include: [
                    path.resolve(__dirname, "src/img"),
                ],
                exclude: [
                    path.resolve(__dirname, "src/fonts"),
                ],
            },
            {
                test: /\.(otf|ttf|eot|woff|woff2|svg)$/,
                include: [
                    path.resolve(__dirname, "src/fonts"),
                ],
                exclude: [
                    path.resolve(__dirname, "src/img"),
                ],
                generator: {
                    filename: `${Output}/fonts/[name][ext][query]`
                }
            },
        ],
    }
};