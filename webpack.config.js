const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");

const outputDirectory = "dist";
module.exports = {
  entry:{
    bundle: "./src/server/bin/www.js"
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "[name].js",
    publicPath: "/"
  },
  module: {
    rules:[
      {
        test:/\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new ClenaWebpackPlugin([outputDirectory])
  ]
}
