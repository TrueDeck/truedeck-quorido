import getBalance from "./getBalance"

import ddb from "./dynamoDb"
import { getRandomAddress, getRandomUint256 } from "../../utils"

describe("getBalance", function() {
  it("gets the balance", async function() {
    const player = getRandomAddress()
    const game = getRandomAddress()
    const token = getRandomAddress()
    const amount = getRandomUint256()

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: `${player}#${game}#${token}`,
        sk: `${player}#gamestate`,
        attr1: amount,
      },
    }
    await ddb.put(params).promise()

    const balance = await getBalance(player, game, token)
    expect(balance).toEqual(amount)
  })
})
