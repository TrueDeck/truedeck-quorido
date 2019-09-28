import React from 'react';
import PropTypes from "prop-types";
import { Flex } from 'rimble-ui';
import { LoadingContainer } from '@drizzle/react-components';

import Accounts from './components/Accounts';
import Contracts from './components/Contracts';
import Balances from './components/Balances';
import Deposit from './components/Deposit';

const DApp = (props, context) => {

  const dAppProps = {
    drizzle: context.drizzle,
    drizzleState: props.state
  };

  return (
    <LoadingContainer>
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
    </LoadingContainer>
  );
}

DApp.contextTypes = {
  drizzle: PropTypes.object
};

export default DApp;