import markGameDataProved from "./markGameDataProved"

import ddb from "./dynamoDb"
import { getRandomAddress, getRandomHex, getRandomUint256 } from "../../utils"

describe("markGameDataProved", function() {
  describe("when a pending GameData doesn't exist", function() {
    it("ignores", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const gamehash = getRandomHex(32)

      await markGameDataProved(player, game, gamehash)
    })
  })

  describe("when a pending GameData exists", function() {
    it("marks pending GameData proved", async function() {
      // Populates the data
      const player = getRandomAddress()
      const game = getRandomAddress()
      const gamehash = getRandomHex(32)

      const token = getRandomAddress()
      const withdrawalAmount = getRandomUint256()
      const gamedata = getRandomHex(77)
      const proof = getRandomHex(55)
      const data = {
        token: token,
        withdrawalAmount: withdrawalAmount,
        gamedata: gamedata,
        proof: proof,
      }

      // Insert the data
      const now = new Date(Date.now()).toISOString()
      const putParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: `${player}#${game}#data`,
          sk: `pending#${gamehash}`,
          attr1: now,
          attr2: data,
        },
      }
      await ddb.put(putParams).promise()

      // Verify the data inserted
      const pendingParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          pk: `${player}#${game}#data`,
          sk: `pending#${gamehash}`,
        },
      }
      let result = await ddb.get(pendingParams).promise()
      expect(result.Item).toEqual({
        pk: `${player}#${game}#data`,
        sk: `pending#${gamehash}`,
        attr1: now,
        attr2: data,
      })

      // Mark pending GameData proved
      await markGameDataProved(player, game, gamehash)

      // Verify the data updated
      result = await ddb.get(pendingParams).promise()
      expect(result).toEqual({})

      const provedParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          pk: `${player}#${game}#data`,
          sk: `proved#${gamehash}`,
        },
      }
      result = await ddb.get(provedParams).promise()
      expect(result.Item).toEqual({
        pk: `${player}#${game}#data`,
        sk: `proved#${gamehash}`,
        attr1: now,
        attr2: data,
      })
    })
  })
})
