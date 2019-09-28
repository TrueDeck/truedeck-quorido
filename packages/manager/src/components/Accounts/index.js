import React from 'react';
import { Box, Card, Heading } from 'rimble-ui';

import AccountInfo from '../AccountInfo';

const Accounts = (props) => (
  <Box p={2} width={1/3}>
    <Card flexDirection="column">
      <Heading.h3>Accounts</Heading.h3>
      <AccountInfo accountName="Player" accountIndex={0} {...props} />
      <AccountInfo accountName="Owner" accountIndex={1} {...props} />
    </Card>
  </Box>
);

export default Accounts;