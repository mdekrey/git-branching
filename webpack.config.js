const path = require("path");

module.exports = {
  devtool: "cheap-source-map",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/"
  },
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: [".webpack.js", ".web.js", ".ts", ".js"]
  },
  module: {
    loaders: [{ test: /\.ts$/, loader: "ts-loader" }]
  }
};
