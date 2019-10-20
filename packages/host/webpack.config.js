const webpack = require("webpack")
const slsw = require("serverless-webpack")

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId()
  return {
    entry: slsw.lib.entries,
    target: "node",
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      ],
    },
  }
})()
