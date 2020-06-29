"use strict";

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
let config = {
  entry: {
    main: ["./app/resources/index.js", "./app/resources/sass/app.scss"],
    landing: ["./app/resources/landing.js"],
  },
  output: {
    path: path.resolve(__dirname, "app", "assets", "bundle"),
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              "@babel/plugin-syntax-dynamic-import",
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
            },
            "postcss-loader",
            "sass-loader",
          ],
        }),
      },
      {
        test: /.(png|woff(2)?|eot|ttf|svg|gif)(\?[a-z0-9=\.]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "../css/[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  externals: {
    myApp: "myApp",
  },
  plugins: [
    new ExtractTextPlugin(path.join("..", "css", "app.css")),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
      __API_HOST__: JSON.stringify("http://localhost"),
      __API_APP_NAME__: JSON.stringify("testing"),
    }),
    new webpack.ProvidePlugin({
      "window.Quill": "quill/dist/quill.js",
      Quill: "quill/dist/quill.js",
    }),
  ],
  optimization: {
    minimizer: [],
  },
};

if (process.env.NODE_ENV === "production") {
  config.optimization.minimizer.push(
    new UglifyJsPlugin({
      sourceMap: false,
      compress: {
        sequences: true,
        conditionals: true,
        booleans: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
      },
    })
  );
}

module.exports = config;
