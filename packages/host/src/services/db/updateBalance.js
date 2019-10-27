import { validateAddress } from "../../utils"
import ddb from "./dynamoDb"

function updateBalance(player, game, token, amount) {
  validateAddress(player, "player")
  validateAddress(game, "game")
  validateAddress(token, "token")

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      pk: `${player}#${game}#${token}`,
      sk: `${player}#gamestate`,
      attr1: amount,
    },
  }

  return ddb.put(params).promise()
}

export default updateBalance
