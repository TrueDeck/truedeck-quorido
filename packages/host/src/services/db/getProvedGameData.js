import { validateAddress } from "../../utils"
import ddb from "./dynamoDb"

function getProvedGameData(player, game, numberOfDays) {
  const end = new Date(Date.now())
  const start = new Date(end.getTime())
  start.setDate(end.getDate() - numberOfDays)

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: "lsi1",
    KeyConditionExpression: "pk = :pk and attr1 between :t_start and :t_end",
    ExpressionAttributeValues: {
      ":pk": `${player}#${game}#proved`,
      ":t_start": start.toISOString(),
      ":t_end": end.toISOString(),
    },
  }
  return ddb.query(params).promise()
}

export default getProvedGameData
