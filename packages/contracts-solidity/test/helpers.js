
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

module.exports = {
    initializeChip,
    initializeBankroll,
    initializeDice,
    calculateGameHash
};
