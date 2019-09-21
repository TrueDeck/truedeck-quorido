// Required by @openzeppelin/upgrades when running from truffle
global.artifacts = artifacts;
global.web3 = web3;

// Import dependencies
const { Contracts, SimpleProject, ZWeb3 } = require('@openzeppelin/upgrades')
const BN = web3.utils.BN;

const name = 'Chip';
const symbol = 'CHIP';
const decimals = web3.utils.toHex(new BN(18));
const initialSupply = web3.utils.toHex(new BN(1000000));   // 1 million

async function main() {
  /* Initialize OpenZeppelin's Web3 provider. */
  ZWeb3.initialize(web3.currentProvider)

  /* Retrieve compiled contract artifacts. */
  const Chip = Contracts.getFromLocal('Chip');
  const Bankroll = Contracts.getFromLocal('Bankroll');
  const Dice = Contracts.getFromLocal('Dice');

  /* Retrieve a couple of addresses to interact with the contracts. */
  const [deployer, owner, signer] = await ZWeb3.accounts();

  /* Create a SimpleProject to interact with OpenZeppelin programmatically. */
  const quorido = new SimpleProject('Quorido', null, { from: deployer });

  /* Deploy the Chip contract with a proxy that allows upgrades. Initialize it by setting the values. */
  const chipInstance = await quorido.createProxy(Chip, { initArgs: [name, symbol, decimals, initialSupply, owner, [owner], [owner]] });
  console.log('Chip:');
  console.log('  - Address:       ', chipInstance.address);
  console.log('  - Name:          ', (await chipInstance.methods.name().call({ from: owner })).toString());
  console.log('  - Symbol:        ', (await chipInstance.methods.symbol().call({ from: owner })).toString());
  console.log('  - Decimals:      ', (await chipInstance.methods.decimals().call({ from: owner })).toString());
  console.log('  - Total Supply:  ', (await chipInstance.methods.totalSupply().call({ from: owner })).toString());
  console.log('  - Owner Balance: ', (await chipInstance.methods.balanceOf(owner).call({ from: owner })).toString());
  console.log('');

  /* Deploy the Bankroll contract with a proxy that allows upgrades. Initialize it by setting the values. */
  const bankrollInstance = await quorido.createProxy(Bankroll, { initArgs: [owner] });
  console.log('Bankroll:');
  console.log('  - Address:       ', bankrollInstance.address);
  console.log('  - Balance:       ', (await chipInstance.methods.balanceOf(bankrollInstance.address).call({ from: owner })).toString());
  console.log('');

  /* Deploy the Dice contract with a proxy that allows upgrades. Initialize it by setting the values. */
  const diceInstance = await quorido.createProxy(Dice, { initArgs: [owner, signer, bankrollInstance.address] });
  console.log('Dice:');
  console.log('  - Address:       ', diceInstance.address);
  console.log('');

//  console.log('Contract\'s storage new value:', (await instance.methods.value().call({ from: owner })).toString());
}

// For truffle exec
module.exports = function(callback) {
  main().then(() => callback()).catch(err => callback(err))
};