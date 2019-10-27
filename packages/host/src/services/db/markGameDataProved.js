import ddb from "./dynamoDb"

async function markGameDataProved(player, game, gamehash) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: `${player}#${game}#pending`,
      sk: gamehash,
    },
  }
  const { Item } = await ddb.get(params).promise()

  if (Item !== undefined) {
    const transactParams = {
      TransactItems: [
        {
          Delete: {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
              pk: `${player}#${game}#pending`,
              sk: gamehash,
            },
          },
        },
        {
          Put: {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
              pk: `${player}#${game}#proved`,
              sk: gamehash,
              attr1: Item.attr1,
              attr2: Item.attr2,
            },
          },
        },
      ],
    }
    return ddb.transactWrite(transactParams).promise()
  }
}

export default markGameDataProved
