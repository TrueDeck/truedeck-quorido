import addGameDataProof from "./addGameDataProof"

import ddb from "./dynamoDb"
import {
  getRandomAddress,
  getInvalidAddress,
  getRandomHex,
  getRandomUint256,
} from "../../utils"

describe("addGameDataProof", function() {
  describe("when player is not a valid address", function() {
    it("rejects", async function() {
      const player = getInvalidAddress()
      const game = getRandomAddress()
      const gamehash = getRandomHex(32)

      const token = getRandomAddress()
      const withdrawalAmount = getRandomUint256()
      const gamedata = getRandomHex(77)
      const proof = getRandomHex(55)
      const data = { token, withdrawalAmount, gamedata, proof }

      expect(() => addGameDataProof(player, game, gamehash, data)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when game is not a valid address", function() {
    it("rejects", async function() {
      const player = getRandomAddress()
      const game = getInvalidAddress()
      const gamehash = getRandomHex(32)

      const token = getRandomAddress()
      const withdrawalAmount = getRandomUint256()
      const gamedata = getRandomHex(77)
      const proof = getRandomHex(55)
      const data = { token, withdrawalAmount, gamedata, proof }

      expect(() => addGameDataProof(player, game, gamehash, data)).toThrowError(
        "Invalid address"
      )
    })
  })

  describe("when addresses are valid", function() {
    it("adds an entry", async function() {
      const player = getRandomAddress()
      const game = getRandomAddress()
      const gamehash = getRandomHex(32)

      const token = getRandomAddress()
      const withdrawalAmount = getRandomUint256()
      const gamedata = getRandomHex(77)
      const proof = getRandomHex(55)
      const data = { token, withdrawalAmount, gamedata, proof }

      const dateMock = new Date("2019-10-01T12:00:00.000Z")
      jest
        .spyOn(global.Date, "now")
        .mockImplementationOnce(() => dateMock.valueOf())

      await addGameDataProof(player, game, gamehash, data)

      const now = dateMock.toISOString()
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          pk: `${player}#${game}#data`,
          sk: `pending#${gamehash}`,
        },
      }
      const { Item } = await ddb.get(params).promise()

      expect(Item).toEqual({
        pk: `${player}#${game}#data`,
        sk: `pending#${gamehash}`,
        attr1: now,
        attr2: data,
      })
    })

    it("adds multiple entries", async function() {
      const numberOfEntries = 5
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

      for (let i = 0; i < numberOfEntries; i++) {
        await addGameDataProof(player, game, gamehashes[i], data[i])
      }

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: "lsi1",
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
        ExpressionAttributeValues: {
          ":pk": `${player}#${game}#data`,
        },
      }
      const { Items } = await ddb.query(params).promise()

      for (let i = 0; i < numberOfEntries; i++) {
        expect(Items[i]).toEqual({
          pk: `${player}#${game}#data`,
          sk: `pending#${gamehashes[i]}`,
          attr1: expect.any(String),
          attr2: data[i],
        })
      }
    })
  })
})
