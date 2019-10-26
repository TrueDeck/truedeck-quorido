import updateBalance from "./updateBalance"

import ddb from "./dynamoDb"
import { getRandomAddress, getInvalidAddress, getRandomUint256 } from "../../utils"

describe("updateBalance", function() {
  describe("when player is not a valid address", function() {
    it("rejects", async function() {
      const player = getInvalidAddress()
      const game = getRandomAddress()
      const token = getRandomAddress()
      const amount = getRandomUint256()

      expect(() => updateBalance(player, game, token, amount)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when game is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getInvalidAddress()
      const token = getRandomAddress()
      const amount = getRandomUint256()

      expect(() => updateBalance(player, game, token, amount)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when token is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const token = getInvalidAddress()
      const amount = getRandomUint256()

      expect(() => updateBalance(player, game, token, amount)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when addresses are valid", function() {
    it("updates the balance", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const token = getRandomAddress()
      const amount = getRandomUint256()

      await updateBalance(player, game, token, amount)

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
        attr1: amount,
      })
    })
  })
})
