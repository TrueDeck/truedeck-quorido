import React from 'react';
import { Box, Flex, Heading, Text, EthAddress } from 'rimble-ui';
import { newContextComponents } from '@drizzle/react-components';
const { AccountData } = newContextComponents;

const AccountInfo = ({ drizzle, drizzleState, accountName, accountIndex }) => (
  <AccountData
    drizzle={drizzle}
    drizzleState={drizzleState}
    accountIndex={accountIndex}
    units="ether"
    precision={4}
    render={({ address, balance, units }) => (
      <Box p={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box><Heading.h5>{accountName}</Heading.h5></Box>
          <Text>{"Balance: "}{balance}{" "}{units}</Text>
        </Flex>
        <div>
          <EthAddress address={address} />
        </div>
      </Box>
    )}
  />
);

export default AccountInfo;