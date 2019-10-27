import { validateAddress } from "../../utils"
import ddb from "./dynamoDb"

function getGameDataProofs(player, game) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: "lsi1",
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `${player}#${game}#pending`
    },
  }
  return ddb.query(params).promise()
}

export default getGameDataProofs
