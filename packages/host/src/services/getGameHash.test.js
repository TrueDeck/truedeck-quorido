import getGameHash from "./getGameHash"

import ddb from "./dynamoDb"
import { getRandomAddress, getRandomHex } from "../utils"

describe("getGameHash", function() {
  it("gets the gamehash", async function() {
    const player = getRandomAddress()
    const game = getRandomAddress()
    const token = getRandomAddress()
    const hash = getRandomHex(32)

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: `${player}#${game}#${token}`,
        sk: `${player}#gamestate`,
        attr2: hash,
      },
    }
    await ddb.put(params).promise()

    const gamehash = await getGameHash(player, game, token)
    expect(gamehash).toEqual(hash)
  })
})
