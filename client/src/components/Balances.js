import React from "react"
import { Box, Flex, Card, Heading, Text } from "rimble-ui"
import { newContextComponents } from "@drizzle/react-components"

const { ContractData } = newContextComponents

const Balances = props => {
  const { accounts } = props.drizzleState
  const player = accounts[0]
  const owner = accounts[1]
  const bankroll = props.drizzle.contracts.Bankroll.address

  return (
    <Box p={2} minWidth="350px" maxWidth="350px">
      <Card flexDirection="column">
        <Box>
          <Heading.h3>Balances</Heading.h3>
          <ChipBalance
            accountName="Player"
            accountAddress={player}
            {...props}
          />
          <ChipBalance accountName="Owner" accountAddress={owner} {...props} />
          <ChipBalance
            accountName="Bankroll"
            accountAddress={bankroll}
            {...props}
          />
        </Box>
        <Box mt={4}>
          <Heading.h3>Allowances</Heading.h3>
          <ChipAllowance
            accountAddress={player}
            spenderName="Bankroll"
            spenderAddress={bankroll}
            {...props}
          />
        </Box>
        <Box mt={4}>
          <Heading.h3>Game Balances</Heading.h3>
          <GameBalance gameName="Dice" accountAddress={player} {...props} />
        </Box>
      </Card>
    </Box>
  )
}

const ChipBalance = ({
  accountName,
  accountAddress,
  drizzle,
  drizzleState,
}) => (
  <Flex pt={2} justifyContent="space-between" alignItems="center">
    <Box>
      <Heading.h5>
        {accountName}
        {": "}
      </Heading.h5>
    </Box>
    <Text>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Chip"
        method="balanceOf"
        methodArgs={[accountAddress]}
        render={data => {
          const balance = drizzle.web3.utils.fromWei(data, "ether")
          return <span>{balance}</span>
        }}
      />{" "}
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Chip"
        method="symbol"
        hideIndicator
      />
    </Text>
  </Flex>
)

const ChipAllowance = ({
  accountAddress,
  spenderName,
  spenderAddress,
  drizzle,
  drizzleState,
}) => (
  <Flex pt={2} justifyContent="space-between" alignItems="center">
    <Box>
      <Heading.h5>
        {spenderName}
        {": "}
      </Heading.h5>
    </Box>
    <Text>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Chip"
        method="allowance"
        methodArgs={[accountAddress, spenderAddress]}
        render={data => {
          const balance = drizzle.web3.utils.fromWei(data, "ether")
          return <span>{balance}</span>
        }}
      />{" "}
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Chip"
        method="symbol"
        hideIndicator
      />
    </Text>
  </Flex>
)

const GameBalance = ({ gameName, accountAddress, drizzle, drizzleState }) => (
  <Flex pt={2} justifyContent="space-between" alignItems="center">
    <Box>
      <Heading.h5>
        {gameName}
        {": "}
      </Heading.h5>
    </Box>
    <Text>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={gameName}
        method="balanceOf"
        methodArgs={[accountAddress]}
        render={data => {
          const balance = drizzle.web3.utils.fromWei(data, "ether")
          return <span>{balance}</span>
        }}
      />{" "}
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Chip"
        method="symbol"
        hideIndicator
      />
    </Text>
  </Flex>
)

export default Balances
