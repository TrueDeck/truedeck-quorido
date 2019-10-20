import AWS from "aws-sdk" // eslint-disable-line import/no-extraneous-dependencies

const isTest = process.env.JEST_WORKER_ID

let options = {}

// connect to local DB if running offline
if (isTest) {
  options = {
    convertEmptyValues: true,
    endpoint: "localhost:8000",
    sslEnabled: false,
    region: "local-env",
  }
}

const ddb = new AWS.DynamoDB.DocumentClient(options)

export default ddb
