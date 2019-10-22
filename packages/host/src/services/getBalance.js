import ddb from "./dynamoDb"

async function getBalance(player, game, token) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: `${player}#${game}#${token}`,
      sk: `${player}#gamestate`,
    },
  }

  const { Item } = await ddb.get(params).promise()
  return Item.attr1
}

export default getBalance
