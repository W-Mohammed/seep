const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { signToken } = require('../auth/checkToken')
const { Tenant } = require('../database/tenant.model')

const login = function (app) {
  app.post('/login', async (req, res) => {
    let { username, password } = req.body
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.send({
        error: 'Username and password required',
        status: 400,
        success: false,
      })
    }
    username = username.toLowerCase()

    Tenant.findOne({
      'users.username': username,
    })
      .then(async (tenant) => {
        if (!tenant) {
          return res.send({
            error: 'Username or password incorrect',
            status: 404,
            success: false,
          })
        }

        const user = tenant.users.find((user) => user.username === username)

        if (!user) {
          return res.send({
            error: 'Username or password incorrect',
            status: 404,
            success: false,
          })
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) {
          return res.send({
            error: 'Username or password incorrect',
            status: 401,
            success: false,
          })
        }

        if (user.forcePasswordReset) {
          /* Since data is sent back, this cannot be an error message */
          return res.send({
            message: 'Password reset required',
            messageCode: 'PASSWORD_RESET_REQUIRED',
            tenantId: tenant.id,
            status: 200,
            success: true,
          })
        }

        const token = signToken(
          username,
          user.name,
          user.role,
          user.superadmin,
          tenant.name,
          tenant.id
        )

        await Tenant.updateOne(
          { id: tenant.id, 'users.username': user.username },
          { $set: { 'users.$.lastLoggedIn': new Date() } }
        ).catch((err) => {
          console.error('Error updating lastLoggedIn', err)
          // error should not prevent login
        })

        return res.send({
          idToken: token,
          username: username,
          name: user.name,
          tenantId: tenant.id,
          tenant: tenant.name,
          role: user.role,
          status: 200,
          success: true,
        })
      })
      .catch((err) => {
        console.log(err)
        return res.send({ message: err, status: 500, success: false })
      })
  })

  app.post('/verifytoken', async (req, res) => {
    const { token } = req.body
    jwt.verify(token, process.env.JWT_SECRET, (err, _decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Error! Possibly not authorised',
          success: false,
          error: err,
        })
      } else {
        // create a new token
        const newToken = signToken(
          _decoded.username,
          _decoded.name,
          _decoded.role,
          _decoded.superadmin,
          _decoded.tenant,
          _decoded.tenantId
        )

        res.json({
          idToken: newToken,
          username: _decoded.username,
          name: _decoded.name,
          tenantId: _decoded.tenantId,
          tenant: _decoded.tenant,
          superadmin: _decoded.superadmin,
          role: _decoded.role,
          status: 200,
          success: true,
        })
      }
    })
  })
}
module.exports = { login }
