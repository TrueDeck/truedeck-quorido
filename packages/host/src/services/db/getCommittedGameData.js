import { validateAddress } from "../../utils"
import ddb from "./dynamoDb"

function getCommittedGameData(player, game, token) {
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

  return ddb.query(params).promise()
}

export default getCommittedGameData
