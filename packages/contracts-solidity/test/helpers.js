
async function initializeChip(contract, name, symbol, decimals, initialSupply, initialHolder, minters, pausers, from) {
    const signature = 'initialize(string,string,uint8,uint256,address,address[],address[])';
    const args = [name, symbol, decimals, initialSupply, initialHolder, minters, pausers];
    await contract.methods[signature](...args, { from });
}

async function initializeBankroll(contract, owner, from) {
    const signature = 'initialize(address)';
    const args = [owner];
    await contract.methods[signature](...args, { from });
}

async function initializeDice(contract, owner, signer, bankroll, from) {
    const signature = 'initialize(address,address,address)';
    const args = [owner, signer, bankroll];
    await contract.methods[signature](...args, { from });
}

function calculateGameHash(prevhash, serverSeed, clientData) {
    const gamehash = web3.utils.keccak256(web3.eth.abi.encodeParameters(
                            ["bytes32", "bytes32", "bytes"],
                            [prevhash, serverSeed, clientData]));
    return gamehash;
}

function fixSignature (signature) {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}

// signs message in node (ganache auto-applies "Ethereum Signed Message" prefix)
async function signMessage (signer, messageHex = '0x') {
  return fixSignature(await web3.eth.sign(messageHex, signer));
};

module.exports = {
    initializeChip,
    initializeBankroll,
    initializeDice,
    calculateGameHash,
    signMessage
};
