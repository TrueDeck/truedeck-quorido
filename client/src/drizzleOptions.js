import Chip from '@contracts/Chip.json';
import Bankroll from '@contracts/Bankroll.json';
import Dice from '@contracts/Dice.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
  contracts: [
//    Chip,
//    Bankroll,
//    Dice
  ],
  events: {
//    Chip: [
//      'Transfer',
//      'Approval'
//    ],
//    Bankroll: [
//      'OwnershipTransferred',
//      'ManagerAdded',
//      'ManagerRemoved',
//      'Paused',
//      'Unpaused',
//      'WithdrawerAdded',
//      'WithdrawerRemoved'
//    ],
//    Dice: [
//      'OwnershipTransferred',
//      'ManagerAdded',
//      'ManagerRemoved',
//      'Paused',
//      'Unpaused',
//      'SignerAdded',
//      'SignerRemoved',
//      'Proved'
//    ]
  },
  polls: {
    accounts: 1500,
  },
  syncAlways: true
};

export default drizzleOptions;