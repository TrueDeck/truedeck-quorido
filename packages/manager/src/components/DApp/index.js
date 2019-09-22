import React from 'react';
import { useContract } from '../../hooks';
import BalanceInfo from '../BalanceInfo';
import AddressInfo from '../AddressInfo';

export default function DApp({ dAppContext }) {

  let owner;
  let player;
  const chip = useContract(dAppContext, 'Chip');
  const bankroll = useContract(dAppContext, 'Bankroll');
  const dice = useContract(dAppContext, 'Dice');

  const accounts = dAppContext.accounts;
  if (accounts && accounts.length >= 2) {
    player = accounts[0];
    owner = accounts[1];
  }

  const dAppProps = {
    lib: dAppContext.lib,
    owner,
    player,
    chip,
    bankroll,
    dice
  };

  return (
    <>
      <AddressInfo {...dAppProps} />
      <BalanceInfo {...dAppProps}  />
    </>
  );
}