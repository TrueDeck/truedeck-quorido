import getCommittedGameData from "./getCommittedGameData"

import ddb from "./dynamoDb"
import { getRandomAddress, getRandomHex } from "../utils"

describe("getCommittedGameData", function() {
  it("gets the Committed Game Data", async function() {
    const numberOfEntries = 5
    const player = getRandomAddress()
    const game = getRandomAddress()
    const token = getRandomAddress()
    const clientDataHashes = []
    const serverSeeds = []
    for (let i = 0; i < numberOfEntries; i++) {
      clientDataHashes.push(getRandomHex(32))
      serverSeeds.push(getRandomHex(32))
    }

    for (let i = 0; i < numberOfEntries; i++) {
      const now = new Date(Date.now()).toISOString()
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: `${player}#${game}#${token}#hash`,
          sk: now,
          attr1: clientDataHashes[i],
          attr2: serverSeeds[i],
        },
      }
      await ddb.put(params).promise()
    }

    const { Items } = await getCommittedGameData(player, game, token)

    for (let i = 0; i < numberOfEntries; i++) {
      expect(Items[i]).toEqual({
        pk: `${player}#${game}#${token}#hash`,
        sk: expect.any(String),
        attr1: clientDataHashes[i],
        attr2: serverSeeds[i],
      })
    }
  })
})
