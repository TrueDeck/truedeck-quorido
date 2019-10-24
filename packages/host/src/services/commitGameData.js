import { validateAddress } from "../utils"
import ddb from "./dynamoDb"

function commitGameData(player, game, token, clientDataHash, serverSeed) {
  validateAddress(player, "player")
  validateAddress(game, "game")
  validateAddress(token, "token")

  const now = new Date(Date.now()).toISOString()
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      pk: `${player}#${game}#${token}#hash`,
      sk: now,
      attr1: clientDataHash,
      attr2: serverSeed,
    },
  }

  return ddb.put(params).promise()
}

export default commitGameData
