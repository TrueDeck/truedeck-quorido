import React from 'react';
import PropTypes from "prop-types";
import { Flex } from 'rimble-ui';
import { LoadingContainer } from '@drizzle/react-components';

import Accounts from './components/Accounts';
import Contracts from './components/Contracts';

const DApp = (props, context) => {

  const dAppProps = {
    drizzle: context.drizzle,
    drizzleState: props.state
  };

  return (
    <LoadingContainer>
      <Flex pt={3} justifyContent="space-evenly">
        <Accounts {...dAppProps} />
        <Contracts {...dAppProps} />
      </Flex>
    </LoadingContainer>
  );
}

DApp.contextTypes = {
  drizzle: PropTypes.object
};

export default DApp;