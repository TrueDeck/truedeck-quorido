import React from "react"
import { Box, Card, Heading, Form, Input, Button } from "rimble-ui"
import { newContextComponents } from "@drizzle/react-components"

const { ContractForm } = newContextComponents

const Deposit = props => {
  const { drizzle, drizzleState } = props
  const { accounts } = drizzleState
  const player = accounts[0]
  const owner = accounts[1]

  return (
    <Box p={2} minWidth="350px" maxWidth="350px">
      <Card flexDirection="column">
        <Heading.h3>Deposit</Heading.h3>
        <Box mt={2}>
          <Heading.h5>Transfer</Heading.h5>
          <ContractForm
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="Chip"
            method="transfer"
            sendArgs={{ from: owner, gas: 4465030 }}
            render={({
              inputs,
              inputTypes,
              state,
              handleInputChange,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                {inputs.map((input, index) => (
                  <Input
                    p={2}
                    height="2rem"
                    fontSize="0.85rem"
                    key={input.name}
                    type={inputTypes[index]}
                    name={input.name}
                    value={state[input.name]}
                    placeholder={input.name}
                    onChange={handleInputChange}
                    required={true}
                  />
                ))}
                <Button
                  key="submit"
                  type="button"
                  size="small"
                  onClick={handleSubmit}
                >
                  Transfer CHIP
                </Button>
              </Form>
            )}
          />
        </Box>
        <Box mt={4}>
          <Heading.h5>Approve</Heading.h5>
          <ContractForm
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="Chip"
            method="approve"
            sendArgs={{ gas: 4465030 }}
            render={({
              inputs,
              inputTypes,
              state,
              handleInputChange,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                {inputs.map((input, index) => (
                  <Input
                    p={2}
                    height="2rem"
                    fontSize="0.85rem"
                    key={input.name}
                    type={inputTypes[index]}
                    name={input.name}
                    value={state[input.name]}
                    placeholder={input.name}
                    onChange={handleInputChange}
                    required={true}
                  />
                ))}
                <Button
                  key="submit"
                  type="button"
                  size="small"
                  onClick={handleSubmit}
                >
                  Approve CHIP
                </Button>
              </Form>
            )}
          />
        </Box>
        <Box mt={4}>
          <Heading.h5>Initiate</Heading.h5>
          <ContractForm
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="Dice"
            method="deposit"
            sendArgs={{ from: player, gas: 4465030 }}
            render={({
              inputs,
              inputTypes,
              state,
              handleInputChange,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                {inputs.map((input, index) => (
                  <Input
                    p={2}
                    height="2rem"
                    fontSize="0.85rem"
                    key={input.name}
                    type={inputTypes[index]}
                    name={input.name}
                    value={state[input.name]}
                    placeholder={input.name}
                    onChange={handleInputChange}
                    required={true}
                  />
                ))}
                <Button
                  key="submit"
                  type="button"
                  size="small"
                  onClick={handleSubmit}
                >
                  Deposit CHIP
                </Button>
              </Form>
            )}
          />
        </Box>
      </Card>
    </Box>
  )
}

export default Deposit
