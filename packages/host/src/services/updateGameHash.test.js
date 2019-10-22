import updateGameHash from "./updateGameHash"

import ddb from "./dynamoDb"
import { getRandomAddress, getInvalidAddress, getRandomHex } from "../utils"

describe("UpdateGameHash", function() {
  describe("when player is not a valid address", function() {
    it("rejects", async function() {
      const player = getInvalidAddress()
      const game = getRandomAddress()
      const token = getRandomAddress()
      const hash = getRandomHex(32)

      expect(() => updateGameHash(player, game, token, hash)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when game is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getInvalidAddress()
      const token = getRandomAddress()
      const hash = getRandomHex(32)

      expect(() => updateGameHash(player, game, token, hash)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when token is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const token = getInvalidAddress()
      const hash = getRandomHex(32)

      expect(() => updateGameHash(player, game, token, hash)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when addresses are valid", function() {
    it("updates the balance", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const token = getRandomAddress()
      const hash = getRandomHex(32)

      await updateGameHash(player, game, token, hash).promise()

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          pk: `${player}#${game}#${token}`,
          sk: `${player}#gamestate`,
        },
      }
      const { Item } = await ddb.get(params).promise()

      expect(Item).toEqual({
        pk: `${player}#${game}#${token}`,
        sk: `${player}#gamestate`,
        attr2: hash,
      })
    })
  })
})
