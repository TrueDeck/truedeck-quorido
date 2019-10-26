import ddb from "./dynamoDb"
import getCommittedGameData from "./getCommittedGameData"

async function deleteCommittedGameData(player, game, token) {
  const { Items } = await getCommittedGameData(player, game, token)

  const requests = []
  for (let i = 0; i < Items.length; i++) {
    requests.push({
      DeleteRequest: {
        Key: {
          pk: Items[i].pk,
          sk: Items[i].sk,
        },
      },
    })
  }
  const params = {
    RequestItems: {
      [process.env.DYNAMODB_TABLE]: requests,
    },
  }
  return ddb.batchWrite(params).promise()
}

export default deleteCommittedGameData
