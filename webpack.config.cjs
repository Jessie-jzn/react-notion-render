const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  experiments: {
    outputModule: true
  },
  entry: "./src/index.ts",
  watchOptions: {
    ignored: /src\/examples/,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    clean: true,
    library: {
      type: "module",
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    usedExports: true,
    sideEffects: false,
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    katex: "katex",
    prismjs: "Prism",
    "@matejmazur/react-katex": "@matejmazur/react-katex",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: [/node_modules/, /src\/examples/],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { modules: false }],
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
