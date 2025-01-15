const jwt = require('jsonwebtoken')

const signToken = (username, name, role, superadmin, tenant, tenantId) => {
  return jwt.sign(
    {
      username: username,
      name: name,
      role: role,
      superadmin: superadmin,
      tenant: tenant,
      tenantId: tenantId,
      iss: 'PRIORB',
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400, // 24 hours
    }
  )
}

module.exports = { signToken }
