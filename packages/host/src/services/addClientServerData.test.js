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

      const dateMock = new Date("2019-10-01T12:00:00.000Z")
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

    it("adds multiple entries", async function() {
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
        await addClientServerData(
          player,
          game,
          token,
          clientDataHashes[i],
          serverSeeds[i]
        )
      }

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
        ExpressionAttributeValues: {
          ":pk": `${player}#${game}#${token}#hash`,
        },
      }
      const { Items } = await ddb.query(params).promise()

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
})
