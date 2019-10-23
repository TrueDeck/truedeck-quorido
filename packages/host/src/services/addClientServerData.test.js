import addClientServerData from "./addClientServerData"

import ddb from "./dynamoDb"
import { getRandomAddress, getInvalidAddress, getRandomHex } from "../utils"

describe("addClientServerData", function() {
  describe("when player is not a valid address", function() {
    it("rejects", async function() {
      const player = getInvalidAddress()
      const game = getRandomAddress()
      const token = getRandomAddress()
      const clientDataHash = getRandomHex(32)
      const serverSeed = getRandomHex(32)

      expect(() =>
        addClientServerData(player, game, token, clientDataHash, serverSeed)
      ).toThrowError("Invalid address")
    })
  })

  describe("when game is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getInvalidAddress()
      const token = getRandomAddress()
      const clientDataHash = getRandomHex(32)
      const serverSeed = getRandomHex(32)

      expect(() =>
        addClientServerData(player, game, token, clientDataHash, serverSeed)
      ).toThrowError("Invalid address")
    })
  })

  describe("when token is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const token = getInvalidAddress()
      const clientDataHash = getRandomHex(32)
      const serverSeed = getRandomHex(32)

      expect(() =>
        addClientServerData(player, game, token, clientDataHash, serverSeed)
      ).toThrowError("Invalid address")
    })
  })

  describe("when addresses are valid", function() {
    it("adds an entry", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const token = getRandomAddress()
      const clientDataHash = getRandomHex(32)
      const serverSeed = getRandomHex(32)

      const dateMock = new Date("2019-05-14T11:01:58.135Z")
      jest
        .spyOn(global.Date, "now")
        .mockImplementationOnce(() => dateMock.valueOf())

      await addClientServerData(player, game, token, clientDataHash, serverSeed)

      const now = dateMock.toISOString()
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          pk: `${player}#${game}#${token}#hash`,
          sk: now,
        },
      }
      const { Item } = await ddb.get(params).promise()

      expect(Item).toEqual({
        pk: `${player}#${game}#${token}#hash`,
        sk: now,
        attr1: clientDataHash,
        attr2: serverSeed,
      })
    })
  })
})
