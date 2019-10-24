import { validateAddress } from "../utils"
import ddb from "./dynamoDb"

function addGameDataProof(player, game, gamehash, data) {
  validateAddress(player, "player")
  validateAddress(game, "game")

  const now = new Date(Date.now()).toISOString()
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      pk: `${player}#${game}#data`,
      sk: `pending#${gamehash}`,
      attr1: now,
      attr2: data,
    },
  }

  return ddb.put(params).promise()
}

export default addGameDataProof
