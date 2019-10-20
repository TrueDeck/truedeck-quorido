import ddb from "../../services/DynamoDb"
import updateBalance from "../../services/UpdateBalance"

describe("UpdateBalance", function() {
  it("should update balance of a player", async () => {
    const player = "abcd"
    const game = "bcde"
    const token = "cdef"
    const amount = "12345"

    await updateBalance(player, game, token, amount).promise()

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: `${player}#${game}#${token}`,
        sk: `${player}#gamestate`,
      },
    }

    const { Item } = await ddb.get(params).promise()

    expect(Item).toEqual({
      pk: `${player}#${game}#${token}`,
      sk: `${player}#gamestate`,
      attr1: "12345",
    })
  })
})
