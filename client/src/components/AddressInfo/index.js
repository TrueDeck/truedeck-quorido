import React from 'react';
import { EthAddress } from 'rimble-ui';

import styles from './AddressInfo.module.scss';

export default function AddressInfo({ owner, player, chip, bankroll, dice }) {
  return (
    <div className={styles.box}>
      <h3>Addresses</h3>
      <div className={styles.dataPoint}>
        <div className={styles.label}>Owner:</div>
        <div className={styles.value}>
        {owner ? (
          <EthAddress address={owner} />
        ) : (
          <div>UNKNOWN</div>
        )}
        </div>
      </div>
      <div className={styles.dataPoint}>
        <div className={styles.label}>Player:</div>
        <div className={styles.value}>
        {player ? (
          <EthAddress address={player} />
        ) : (
          <div>UNKNOWN</div>
        )}
        </div>
      </div>
      <div className={styles.dataPoint}>
        <div className={styles.label}>Chip:</div>
        <div className={styles.value}>
        {chip ? (
          <EthAddress address={chip._address} />
        ) : (
          <div>NOT DEPLOYED</div>
        )}
        </div>
      </div>
      <div className={styles.dataPoint}>
        <div className={styles.label}>Bankroll:</div>
        <div className={styles.value}>
        {bankroll ? (
          <EthAddress address={bankroll._address} />
        ) : (
          <div>NOT DEPLOYED</div>
        )}
        </div>
      </div>
      <div className={styles.dataPoint}>
        <div className={styles.label}>Dice:</div>
        <div className={styles.value}>
        {dice ? (
          <EthAddress address={dice._address} />
        ) : (
          <div>NOT DEPLOYED</div>
        )}
        </div>
      </div>
    </div>
  );
}