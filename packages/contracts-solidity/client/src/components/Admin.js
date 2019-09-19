import React from "react"
import PropTypes from "prop-types"
import { Flex } from "rimble-ui"

import Accounts from "@components/Accounts"
import Contracts from "@components/Contracts"
import Balances from "@components/Balances"
import Deposit from "@components/Deposit"

class DApp extends React.Component {
  render() {
    const dAppProps = {
      drizzle: this.context.drizzle,
      drizzleState: this.props.state,
    }

    return (
      <Flex pt={2} justifyContent="center" flexWrap="wrap">
        <Flex flexDirection="column">
          <Accounts {...dAppProps} />
          <Contracts {...dAppProps} />
        </Flex>
        <Flex flexDirection="column">
          <Balances {...dAppProps} />
        </Flex>
        <Flex flexDirection="column">
          <Deposit {...dAppProps} />
        </Flex>
      </Flex>
    )
  }
}

DApp.contextTypes = {
  drizzle: PropTypes.object,
}

export default DApp
