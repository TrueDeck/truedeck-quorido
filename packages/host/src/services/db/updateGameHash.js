import { validateAddress } from "../../utils"
import ddb from "./dynamoDb"

function updateGameHash(player, game, token, hash) {
  validateAddress(player, "player")
  validateAddress(game, "game")
  validateAddress(token, "token")

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      pk: `${player}#${game}#${token}`,
      sk: `${player}#gamestate`,
      attr2: hash,
    },
  }

  return ddb.put(params).promise()
}

export default updateGameHash
