import React from 'react';
import { Box, Flex, Heading, Pill, Icon, Text, EthAddress } from 'rimble-ui';

const ContractInfo = ({ drizzle, drizzleState, contractName }) => {

  const deployed = drizzleState.contracts[contractName] !== undefined;
  const initialized = deployed && drizzleState.contracts[contractName].initialized;
  const synced = deployed && drizzleState.contracts[contractName].synced;
  const address = deployed && drizzle.contracts[contractName].address;

  return (
    <Box pt={3}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box><Heading.h5>{contractName}</Heading.h5></Box>
        <Flex>
          {deployed ? (
            <>
              <Pill ml={2} color={initialized ? "green" : "red"}>
                <Icon name={initialized ? "CheckCircle" : "Error"} mr={1} />
                <Text fontSize={1} caps>{initialized ? "Initialized" : "Not Initialized"}</Text>
              </Pill>
              <Pill ml={2} color={synced ? "green" : "red"}>
                <Icon name={synced ? "CheckCircle" : "Error"} mr={1} />
                <Text fontSize={1} caps>{synced ? "Synced" : "Not Synced"}</Text>
              </Pill>
            </>
          ) : (
            <Pill ml={2} color="red">
              <Icon name="Error" mr={1} />
              <Text fontSize={1} caps>{"Not Deployed"}</Text>
            </Pill>
          )}
        </Flex>
      </Flex>
      {deployed && (
        <div>
          <EthAddress address={address} />
        </div>
      )}
    </Box>
)};

export default ContractInfo;