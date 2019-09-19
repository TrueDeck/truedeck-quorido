import React from "react"

import Layout from "@components/layout"
import SEO from "@components/seo"
import AdminContainer from "@containers/AdminContainer"

const SecondPage = () => (
  <Layout>
    <SEO title="Admin" />
    <AdminContainer />
  </Layout>
)

export default SecondPage
