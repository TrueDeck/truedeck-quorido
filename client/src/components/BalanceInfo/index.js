import React, { useState, useEffect } from 'react';

export default function BalanceInfo({ lib, player, owner, chip, bankroll }) {
  const [playerEthBalance, setPlayerEthBalance] = useState('Unknown');
  const [playerBalance, setPlayerBalance] = useState('Unknown');
  const [bankrollAllowance, setBankrollAllowance] = useState('Unknown');
  const [ownerBalance, setOwnerBalance] = useState('Unknown');
  const [bankrollBalance, setBankrollBalance] = useState('Unknown');

  useEffect(() => {
    getBalancesAndAllowances();
  });

  const getBalancesAndAllowances = async () => {
    if (player) {
      setPlayerEthBalance(lib.utils.fromWei(await lib.eth.getBalance(player), 'ether'));
      if (chip) {
        setPlayerBalance(lib.utils.fromWei(await chip.methods.balanceOf(player).call({ from: player }), 'ether'));
        if (bankroll) {
          setBankrollAllowance(lib.utils.fromWei(await chip.methods.allowance(player, bankroll._address).call({ from: player }), 'ether'));
        }
      }
    }
    if (owner) {
      if (chip) {
        setOwnerBalance(lib.utils.fromWei(await chip.methods.balanceOf(owner).call({ from: owner }), 'ether'));
      }
    }
    if (bankroll && bankroll._address) {
      if (chip) {
        setBankrollBalance(lib.utils.fromWei(await chip.methods.balanceOf(bankroll._address).call({ from: owner }), 'ether'));
      }
    }
  };

  return (
    <div className={styles.box}>
      <h3>Balances &amp; Allowances</h3>
      <p>Player</p>
      <div className={`${styles.dataPoint} ${styles.column}`}>
        <div className={styles.value}>ETH: {playerEthBalance}</div>
        <div className={styles.value}>CHIP: {playerBalance}</div>
        <div className={styles.value}>Allowance: {bankrollAllowance} CHIP</div>
      </div>
      <p>Owner (Initial Holder)</p>
      <div className={`${styles.dataPoint} ${styles.column}`}>
        <div className={styles.value}>CHIP: {ownerBalance}</div>
      </div>
      <p>Bankroll</p>
      <div className={`${styles.dataPoint} ${styles.column}`}>
        <div className={styles.value}>CHIP: {bankrollBalance}</div>
      </div>
    </div>
  );
}
