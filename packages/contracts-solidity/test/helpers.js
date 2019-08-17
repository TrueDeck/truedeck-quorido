
async function initializeChip(contract, name, symbol, decimals, initialSupply, initialHolder, minters, pausers, from) {
    const signature = 'initialize(string,string,uint8,uint256,address,address[],address[])';
    const args = [name, symbol, decimals, initialSupply, initialHolder, minters, pausers];
    await contract.methods[signature](...args, { from });
}

module.exports = {
    initializeChip
};
