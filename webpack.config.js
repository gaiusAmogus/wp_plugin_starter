const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = {
    entry: {
        "plugin-name-admin": "./admin/resources/app.js",
        "plugin-name-public": "./public/resources/app.js",
    },
    output: {
        path: path.resolve(__dirname, "./"), // Zmieniamy na root folder
        filename: (pathData) => {
            // Ścieżka do pliku JS, która zależy od punktu wejścia
            return pathData.chunk.name === 'plugin-name-admin' 
                ? 'admin/assets/js/[name].js' 
                : 'public/assets/js/[name].js';
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                            sourceMap: true,
                        },
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer()],
                                sourceMap: true,
                            },
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-object-rest-spread"],
                    },
                },
            },
            {
                test: /\.(jpe?g|png|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets/img/", // Poprawienie ścieżki do obrazków
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets/webfonts", // Poprawienie ścieżki do czcionek
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: (pathData) => {
                // Ścieżka do pliku CSS, która zależy od punktu wejścia
                return pathData.chunk.name === 'plugin-name-admin'
                    ? 'admin/assets/css/[name].css'
                    : 'public/assets/css/[name].css';
            },
        }),
        new BrowserSyncPlugin({
            host: "localhost",
            port: 3000,
            proxy: "http://localhost/",
            files: ["*.php"],
            injectChanges: true,
            notify: true,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
};