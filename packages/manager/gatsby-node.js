const path = require("path")

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@contracts": path.resolve(__dirname, "../build/contracts"),
        "@components": path.resolve(__dirname, "src/components"),
        "@containers": path.resolve(__dirname, "src/containers"),
      },
    },
  })
}
