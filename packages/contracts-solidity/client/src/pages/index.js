import React from "react"
import { Heading } from "rimble-ui"

import Layout from "@components/layout"
import SEO from "@components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Heading.h1>Player Page</Heading.h1>
  </Layout>
)

export default IndexPage
