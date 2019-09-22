import React from 'react';

import { useWeb3Network } from '@openzeppelin/network/react';
import DApp from './components/DApp';

import styles from './App.module.scss';

function App() {
  const dAppContext = useWeb3Network('http://127.0.0.1:8545');

  return (
    <div className={styles.App}>
      <br />
      <h1>TrueDeck Quorido</h1>
      <div className={styles.boxContainer}>
          <DApp dAppContext={dAppContext} />
      </div>
    </div>
  );
}

export default App;
