import React from "react"

import Layout from "@components/layout"
import SEO from "@components/seo"
import AdminContainer from "@containers/AdminContainer"

const SecondPage = () => (
  <Layout>
    <SEO title="Manager" />
    <AdminContainer />
  </Layout>
)

export default SecondPage
