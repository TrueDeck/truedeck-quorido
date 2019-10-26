import deleteCommittedGameData from "./deleteCommittedGameData"

import ddb from "./dynamoDb"
import { getRandomAddress, getRandomHex } from "../utils"

describe("deleteCommittedGameData", function() {
  it("deletes the Committed Game Data", async function() {
    // Populate the data
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

    // Insert the data
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

    // Verify the data inserted
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
    let result = await ddb.query(params).promise()
    for (let i = 0; i < numberOfEntries; i++) {
      expect(result.Items[i]).toEqual({
        pk: `${player}#${game}#${token}#hash`,
        sk: expect.any(String),
        attr1: clientDataHashes[i],
        attr2: serverSeeds[i],
      })
    }

    // Delete the data
    await deleteCommittedGameData(player, game, token)

    // Verify the data deleted
    result = await ddb.query(params).promise()
    expect(result.Items).toEqual([])
  })
})
