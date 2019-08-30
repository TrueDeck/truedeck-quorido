
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

function calculateGameHash(prevhash, clientSeed, serverSeed, data) {
    const clientHash = web3.utils.keccak256(web3.eth.abi.encodeParameters(
                            ["bytes32", "bytes"],
                            [clientSeed, data]));
    const gamehash = web3.utils.keccak256(web3.eth.abi.encodeParameters(
                            ["bytes32", "bytes32", "bytes32"],
                            [prevhash, clientHash, serverSeed]));
    return gamehash;
}

module.exports = {
    initializeChip,
    initializeBankroll,
    calculateGameHash
};
