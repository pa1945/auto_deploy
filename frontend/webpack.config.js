var webpack = require('webpack');
var path = require('path');
const Dotenv = require('dotenv-webpack');
require('dotenv').config();

// variables
var isProduction =
  process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
  context: sourcePath,
  entry: {
    app: './main.tsx',
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js',
    publicPath: process.env.FRONTEND_URL || '/',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
      assets: path.resolve(__dirname, 'src/assets/'),
    },
  },
  cache: false,  // PA 20-07-12
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: {
              plugins: ['react-hot-loader/babel'],
            },
          },
          'ts-loader',
        ].filter(Boolean),
      },
      // locale css
      {
        test: /\.local.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
            // query: {
            //   modules: true,
            //   sourceMap: !isProduction,
            //   importLoaders: 1,
            //   localIdentName: isProduction ?
            //     "[hash:base64:5]" : "[local]__[hash:base64:5]"
            // }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-import')({
                  addDependencyTo: webpack,
                }),
                require('postcss-url')(),
                require('postcss-preset-env')({
                  /* use stage 2 features (defaults) */
                  stage: 2,
                }),
                require('postcss-reporter')(),
                require('postcss-browser-reporter')({
                  disabled: isProduction,
                }),
              ],
            },
          },
        ],
      },
      //global css
      {
        test: /^((?!\.local).)*css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: false,
              sourceMap: !isProduction,
              importLoaders: 1,
            },
          },
        ],
      },
      // static assets
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(a?png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20000,
              name: 'images/[hash]-[name].[ext]',
              useRelativePath: process.env.NODE_ENV !== 'local',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new Dotenv(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: true,		// false,
      API_URL: process.env.API_URL,
      WP_HELP_EMAIL: 'palves1945@gmail.com',	//  'info@acklenavenue.com',
    }),
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
      disable: !isProduction,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: 'assets/index.ejs',
      LOGGLY_TOKEN: process.env.LOGGLY_TOKEN,
      TITLE: process.env.TITLE || 'Welcome',
      API_URL: process.env.API_URL,
      WP_HELP_EMAIL: process.env.WP_HELP_EMAIL,
    }),
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    // host: '192.168.199.152', // Only works for this IP -- don't show DB entries-employees?
                             //  Or try to fetch from the Redhat instance
    host: '0.0.0.0',            // PA <<== to work with public IP and all IPs. Show employess when set http://localhost:3060/
    // host: 'localhost',       // PA <<== to work with 'localhost' and show employees.
    disableHostCheck: true,     // PA <<== to work with public IP
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: {
      disableDotRule: true,
    },
    port: 3000,
    // 3000: OK, 3060: OK-sometimes, 3050: NOT, 3040: NOT, 3020: NOT
    stats: 'minimal',
    clientLogLevel: 'warning',
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: isProduction ? 'hidden-source-map' : 'inline-source-map',
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty',
  },
};
