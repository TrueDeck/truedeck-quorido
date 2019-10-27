import getProvedGameData from "./getProvedGameData"

import ddb from "./dynamoDb"
import {
  getRandomAddress,
  getInvalidAddress,
  getRandomHex,
  getRandomUint256,
  sleep
} from "../../utils"

describe("getProvedGameData", function() {
  it("gets proved GameData for 'n' days", async function() {
    // Populates the data
    const numberOfProofs = 20
    const numberOfPendingProofs = 5
    const numberOfTodaysProofs = 13;
    const player = getRandomAddress()
    const game = getRandomAddress()
    const gamehashes = []
    const data = []
    for (let i = 0; i < numberOfProofs; i++) {
      gamehashes.push(getRandomHex(32))
      data.push({
        token: getRandomAddress(),
        withdrawalAmount: getRandomUint256(),
        gamedata: getRandomHex(77),
        proof: getRandomHex(55),
      })
    }

    // Insert the data
    for (let i = 0; i < numberOfProofs; i++) {
      let time = new Date(Date.now() - 60 * 60 * 1000);
      if (i > numberOfTodaysProofs - 1) {
        time.setDate(time.getDate() - 1)
      }

      const proofType = (i < numberOfPendingProofs) ? "pending" : "proved"
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: `${player}#${game}#${proofType}`,
          sk: gamehashes[i],
          attr1: time.toISOString(),
          attr2: data[i],
        },
      }
      ddb.put(params).promise()
      await sleep(10);
    }

    // Actual call
    const { Items } = await getProvedGameData(player, game, 1)

    // Verify the data
    expect(Items.length).toEqual(numberOfTodaysProofs - numberOfPendingProofs)
    for (let i = 0; i < Items.length; i++) {
      expect(Items[i]).toEqual({
        pk: `${player}#${game}#proved`,
        sk: gamehashes[numberOfPendingProofs + i],
        attr1: expect.any(String),
        attr2: data[numberOfPendingProofs + i],
      })
    }
  })
})
