const { SendEmailCommand } = require('@aws-sdk/client-ses')

const createSendEmailCommand = (toAddress, fromAddress, emailBody, emailSubject) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Text: {
          Charset: 'UTF-8',
          Data: emailBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: emailSubject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  })
}

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { createSendEmailCommand }
