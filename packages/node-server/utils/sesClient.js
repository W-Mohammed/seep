const { SESClient } = require('@aws-sdk/client-ses')
const { env } = require('process')
require('dotenv').config()

let sesClient

// if provided, use env variables for AWS credentials
if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_REGION) {
  console.log('Using env provided AWS credentials')
  const SES_CONFIG = {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
  }
  sesClient = new SESClient(SES_CONFIG)
} else {
  console.log('Using Instance Profile credentials')
  const REGION = 'eu-central-1'
  sesClient = new SESClient({ region: REGION })
}

module.exports = { sesClient }
