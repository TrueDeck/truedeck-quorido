import React from 'react';
import { Box, Card, Heading } from 'rimble-ui';

import ContractInfo from '../ContractInfo';

const Contracts = (props) => (
  <Box p={2}>
    <Card flexDirection="column">
      <Heading.h3>Contracts</Heading.h3>
      <ContractInfo contractName="Chip" {...props} />
      <ContractInfo contractName="Bankroll" {...props} />
      <ContractInfo contractName="Dice" {...props} />
    </Card>
  </Box>
);

export default Contracts;