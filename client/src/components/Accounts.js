import React from "react"
import { Box, Card, Heading } from "rimble-ui"

import AccountInfo from "@components/AccountInfo"

const Accounts = props => (
  <Box p={2}>
    <Card flexDirection="column">
      <Heading.h3>Accounts</Heading.h3>
      <AccountInfo accountName="Player" accountIndex={0} {...props} />
      <AccountInfo accountName="Owner / Manager" accountIndex={1} {...props} />
      <AccountInfo accountName="Signer" accountIndex={2} {...props} />
    </Card>
  </Box>
)

export default Accounts
