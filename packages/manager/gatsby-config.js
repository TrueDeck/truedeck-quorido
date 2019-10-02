module.exports = {
  siteMetadata: {
    title: `TrueDeck Quorido`,
    description: `Multi-Blockchain Provably Fair Casino Platform by TrueDeck.`,
    author: `@truedeckdev`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `truedeck-quorido`,
        short_name: `truedeck-quorido`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/truedeck-icon-64x64.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
