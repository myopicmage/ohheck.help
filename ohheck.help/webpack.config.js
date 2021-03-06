const { CheckerPlugin } = require('awesome-typescript-loader');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = env => {
    const isDev = !(env && env.production);

    console.log(`Executing ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} build`);

    const shared = () => ({
        entry: {
            main: ['./src/index.tsx']
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: {
                actions: path.resolve(__dirname, 'src/actions/'),
                components: path.resolve(__dirname, 'src/components/'),
                constants: path.resolve(__dirname, 'src/constants/'),
                epics: path.resolve(__dirname, 'src/epics/'),
                reducers: path.resolve(__dirname, 'src/reducers/'),
                store: path.resolve(__dirname, 'src/store/'),
                types: path.resolve(__dirname, 'src/types/')
            }
        },
        output: {
            path: `${__dirname}/wwwroot/js`,
            publicPath: '/js/',
            filename: 'bundle.js'
        },
        module: {
            rules: [
                { 
                    test: /\.ts(x?)?$/, 
                    include: /src/, 
                    use: 'awesome-typescript-loader?silent=true' 
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                    use: 'file-loader'
                }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/js/vendor-manifest.json')
            })
        ],
        stats: { modules: false }
    });

    const dev = () => ({
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]
        }
    });

    const prod = () => ({
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                }
            ]
        },
        plugins: [
            new UglifyJSPlugin(),
            new ExtractTextPlugin('../styles/styles.css'),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/js/vendor-manifest.json')
            })
        ]
    });

    return isDev ? merge(shared(), dev()) : merge(shared(), prod());
};
