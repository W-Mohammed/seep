const { Tenant } = require('../database/tenant.model.js')
const { createSendEmailCommand } = require('../utils/sesCommands.js')
const { sesClient } = require('../utils/sesClient.js')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT = 10

function validateUserCreation(req) {
    const { username, password, role, name, superadmin } = req.body
    const tenantId = req.tenantId

    console.log('tenantId', tenantId)

  if (!tenantId || !username || !password || !role || !name) {
    // throw new Error('Missing required fields: tenantId, username, password, role, name');
    return {
      success: false,
      message: 'Missing required fields: tenantId, username, password, role, name',
    }
  }

  if (!superadmin && !role === 'admin')
    // throw new Error('Not authorised to create a user');
    return { success: false, message: 'Not authorised to create a user' }

  if (!superadmin && !role === 'superadmin')
    // throw new Error('Not authorised to create a superadmin');
    return { success: false, message: 'Not authorised to create a superadmin' }

  if (!tenantId === req.params.tenantId)
    // throw new Error('Discrepancy between tenantId in request body and URL path');
    return {
      success: false,
      message: 'Discrepancy between tenantId in request body and URL path',
    }

  if (!superadmin && !tenantId === req.params.tenantId)
    // throw new Error('Not authorised to create a user for this organisation');
    return {
      success: false,
      message: 'Not authorised to create a user for this organisation',
    }

  return { success: true }
}


async function addUserToTenant(tenantId, reqBody) {
  let {
    username,
    password,
    role,
    name,
    superadmin,
    forcePasswordReset,
  } = reqBody
    
  username = username.toLowerCase()
    
  let tenant = await Tenant.findOne({ id: tenantId })
  if (!tenant) return { error: 'Tenant not found', success: false }

  const hashedPassword = bcrypt.hashSync(password, SALT)

  const user = {
    username,
    password: hashedPassword,
    role,
    name,
    superadmin,
    forcePasswordReset,
  }

  let userExists = tenant.users.find((u) => u.username === user.username)

  if (userExists) return { error: 'User already exists', success: false }

  tenant.users.push(user)
  await tenant.save()

  let result = {
    success: true,
    message: `User ${username} added to tenant ${tenantId}`,
  }

  return result
}

async function updatePassword(username, currentPassword, newPassword, tenantId) {

    if(!tenantId || !username) {
        throw new Error('Tenant id and username are required')
    }

  if (!currentPassword || !newPassword) {
    throw new Error('Current and new passwords are required')
  }

  if (currentPassword === newPassword) {
    throw new Error('New password must be different from the current password')
  }

  const tenant = await Tenant.findOne({ id: tenantId })
  if (!tenant) {
    throw new Error('Tenant not found')
  }

  const user = tenant.users.find((u) => u.username === username)
  if (!user) {
    throw new Error('Username or password incorrect')
  }

  const currentPasswordHash = bcrypt.hashSync(currentPassword, SALT)

  if (bcrypt.compareSync(user.password, currentPasswordHash)) {
    throw new Error('Username or password incorrect')
  }

  const newPasswordHash = bcrypt.hashSync(newPassword, SALT)

  await Tenant.updateOne(
    { id: tenantId, 'users.username': username },
    {
      $set: {
        'users.$.password': newPasswordHash,
        'users.$.forcePasswordReset': false,
      },
    }
  )

  return { success: true, message: 'Password updated' }
}

async function emailConfirmUserCreation(username, password) {
  // string indentation is intentional !
  const emailBody = `Hello,

The password has been reset for you on the Structured Expert Elicitation Platform.

Your new one-time password is: ${password}

Best wishes,
...
`

  const sendEmailCommand = createSendEmailCommand(
    username,
    'YOUR@EMAIL.COM',
    emailBody,
    'Password reset on the Structured Expert Elicitation Platform'
  )

  try {
    await sesClient.send(sendEmailCommand)
    return { emailSuccess: true }
  } catch (e) {
    console.error(e)
    return { emailSuccess: false, emailError: e }
  }
}

async function resetPassword(username) {
  let session

  try {
    // For security reasons, we don't want to reveal if the user exists or not
    if (!username) {
      return { success: true }
    }
  
    const tenant = await Tenant.findOne({ 'users.username': username })
    if (!tenant) {
      return { success: true }
    }
  
    const user = tenant.users.find((u) => u.username === username)
    if (!user) {
      return { success: true }
    }
  
    const newPassword = Math.random().toString(36).slice(2)
    const newPasswordHash = bcrypt.hashSync(newPassword, SALT)
    session = await mongoose.startSession()
    session.startTransaction()



    await Tenant.updateOne(
      { _id: tenant._id, 'users.username': username },
      {
        $set: {
          'users.$.password': newPasswordHash,
          'users.$.forcePasswordReset': true,
        },
      },
      { session: session }
    )

    const emailResult = await emailConfirmUserCreation(username, newPassword)
    if (emailResult.emailSuccess) {
      await session.commitTransaction()
      session.endSession()
      return { success: true }
    } else {
      await session.abortTransaction()
      session.endSession()
      throw 'Error sending email'
    }
  } catch (e) {
    console.error(e)
    if (session && !session.hasEnded) {
      await session.abortTransaction()
      session.endSession()
    }
    return { error: e, success: false }
  } 
}

  module.exports = {
  updatePassword,
  addUserToTenant,
  emailConfirmUserCreation,
  validateUserCreation,
  resetPassword
}
