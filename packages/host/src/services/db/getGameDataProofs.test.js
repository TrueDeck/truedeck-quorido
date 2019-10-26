import getGameDataProofs from "./getGameDataProofs"

import ddb from "./dynamoDb"
import {
  getRandomAddress,
  getInvalidAddress,
  getRandomHex,
  getRandomUint256,
} from "../../utils"

describe("getGameDataProofs", function() {
  it("gets all pending GameData proofs", async function() {
    // Populates the data
    const numberOfEntries = 5
    const numberOfPendingProofs = 3
    const player = getRandomAddress()
    const game = getRandomAddress()
    const gamehashes = []
    const data = []
    for (let i = 0; i < numberOfEntries; i++) {
      gamehashes.push(getRandomHex(32))
      data.push({
        token: getRandomAddress(),
        withdrawalAmount: getRandomUint256(),
        gamedata: getRandomHex(77),
        proof: getRandomHex(55),
      })
    }

    // Insert the data
    for (let i = 0; i < numberOfEntries; i++) {
      const now = new Date(Date.now()).toISOString()
      const proofType = (i < numberOfPendingProofs) ? "pending" : "proved"
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: `${player}#${game}#${proofType}`,
          sk: gamehashes[i],
          attr1: now,
          attr2: data[i],
        },
      }
      ddb.put(params).promise()
    }

    // Actual call
    const { Items } = await getGameDataProofs(player, game)

    // Verify the data
    expect(Items.length).toEqual(numberOfPendingProofs)
    for (let i = 0; i < numberOfPendingProofs; i++) {
      expect(Items[i]).toEqual({
        pk: `${player}#${game}#pending`,
        sk: gamehashes[i],
        attr1: expect.any(String),
        attr2: data[i],
      })
    }
  })
})
