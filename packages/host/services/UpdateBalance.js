import ddb from "./DynamoDb"

function updateBalance(player, game, token, amount) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      pk: `${player}#${game}#${token}`,
      sk: `${player}#gamestate`,
      attr1: amount,
    },
  }

  return ddb.put(params)
}

export default updateBalance
