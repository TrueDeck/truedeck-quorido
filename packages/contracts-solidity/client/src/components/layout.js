/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { DrizzleProvider } from "@drizzle/react-plugin"
import { LoadingContainer } from "@drizzle/react-components"

import drizzleOptions from "../drizzleOptions"
import "./styles.css"

const Layout = ({ children }) => (
  <DrizzleProvider options={drizzleOptions}>
    <LoadingContainer>
      <main>{children}</main>
    </LoadingContainer>
  </DrizzleProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
