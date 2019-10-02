const { BN } = require("openzeppelin-test-helpers")
const { calculateGameHash, signMessage } = require("../utils")

var gameData = {
  prevHash: null,
  totalRounds: 0,
  clientSeeds: [],
  betAmounts: [],
  rollUnders: [],
  serverSeeds: [],
  wonBits: [],
}

var DiceGameDataEncoder = {
  create: function(
    prevHash = "0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    gameData.prevHash = new BN(prevHash, 16)
    ++gameData.totalRounds
    return betAmountConsumer
  },
}

var betAmountConsumer = {
  betAmount: function(betAmount) {
    gameData.betAmounts.push(new BN(betAmount))
    return rollUnderConsumer
  },
}

var rollUnderConsumer = {
  rollUnder: function(rollUnder) {
    gameData.rollUnders.push(new BN(rollUnder))
    return clientSeedConsumer
  },
}

var clientSeedConsumer = {
  clientSeed: function(clientSeed) {
    gameData.clientSeeds.push(new BN(clientSeed, 16))
    return serverSeedConsumer
  },
}

var serverSeedConsumer = {
  serverSeed: function(serverSeed) {
    gameData.serverSeeds.push(new BN(serverSeed, 16))
    return wonBitConsumer
  },
}

var wonBitConsumer = {
  hasWon: function(wonBit) {
    gameData.wonBits.push(wonBit)
    return encoder
  },
}

var encoder = {
  ___anotherRound: function() {
    ++gameData.totalRounds
    return betAmountConsumer
  },

  ___encode: async function(signer) {
    var betAmount = new BN(0)
    var payout = new BN(0)
    var data = "0x"
    var gamehash = "0x" + gameData.prevHash.toString(16, 64)

    for (var i = 0; i < gameData.totalRounds; i++) {
      const amount = gameData.betAmounts[i]
      const rollUnder = gameData.rollUnders[i]
      const clientSeed = gameData.clientSeeds[i].toString(16, 64)
      const serverSeed = gameData.serverSeeds[i].toString(16, 64)
      const clientData =
        clientSeed + amount.toString(16, 64) + rollUnder.toString(16, 2)

      var flags = new BN(0)
      flags = flags.or(gameData.wonBits[i] === true ? new BN(2) : new BN(0)) // Won Bit
      flags = flags.or(i === gameData.totalRounds - 1 ? new BN(0) : new BN(1)) // EOG Bit
      flags = flags.toString(16, 2)

      betAmount = betAmount.add(amount)
      if (gameData.wonBits[i] === true) {
        payout = payout.add(amount.muln(99).div(rollUnder.subn(1)))
      }
      gamehash = calculateGameHash(
        gamehash,
        "0x" + serverSeed,
        "0x" + clientData
      )
      data = data + clientData + serverSeed + flags
    }

    var proof = await signMessage(signer, gamehash)

    return { betAmount, payout, gamehash, data, proof }
  },
}

module.exports = {
  DiceGameDataEncoder,
}
