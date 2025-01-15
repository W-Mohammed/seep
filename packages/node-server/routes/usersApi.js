const { verifyToken } = require('../auth/authMiddleware')
const { Tenant } = require('../database/tenant.model')
const { updatePassword, addUserToTenant, validateUserCreation, resetPassword } = require('../services/user.service')

const usersApi = function (app) {
  // get all users for a tenant (accessible to tenants)
  app.get('/tenants/:tenantId/users', verifyToken, async (req, res) => {
    let tenant = await Tenant.findOne({ id: req.params.tenantId })
    if (!tenant) return res.json({ error: 'Tenant not found', status: 404 })
    if (tenant.id !== req.tenantId)
      return res.json({ error: 'Not authorised', status: 401 })
    const usersWithReadableFields = tenant.users.map(user => {
      const { password, actionTimestamps, ...userWithoutPassword } = user.toObject(); // should not send password outside
      return userWithoutPassword;
    });

    return res.json({ users: usersWithReadableFields, status: 200 })
  })

  // add user to tenant (accessible to superadmins only)
  app.post('/tenants/:tenantId/users', verifyToken, async (req, res) => {
    
    const requestIsValid = validateUserCreation(req)
    if(!requestIsValid.success) return res.json(requestIsValid)
    
    try {
      const result = await addUserToTenant(req.params.tenantId, req.body)
      return res.json(result)
    } catch (e) {
      res.json({ error: e.message || e, success: false })
    }
  })  

  // delete user from tenant (accessible to superadmins only)
  app.delete('/tenants/:tenantId/users/:userId', verifyToken, async (req, res) => {
    const valid = req.superadmin || req.tenantId === req.params.tenantId

    if (!valid) return res.json({ error: 'Not authorised', status: 401 })
      
    
    if (!req.superadmin && (!req.role === 'admin' || req.tenantId !== req.params.tenantId))
      return res.json({
        error: 'Not authorised to delete a user',
        success: false,
      })
  
    const username = decodeURIComponent(req.params.userId); // Decode the userId (email) from the URL path
    
    try {
      let tenant = await Tenant.findOne({ id: req.params.tenantId })
      if (!tenant) return res.json({ error: 'Tenant not found', success: false })
  
      let userIndex = tenant.users.findIndex((u) => u.username === username)
      if (userIndex === -1) return res.json({ error: 'User not found', success: false })
      
      tenant.users.splice(userIndex, 1)
      await tenant.save()
  
      return res.json({ message: "User deleted", success: true })
    } catch (e) {
      res.json({ error: e.message || e, success: false })
    }
  })

  // update user password (accessible to superadmins and the users themselves)
  app.put('/tenants/:tenantId/users/:userId/password', async (req, res) => {
    try {
      const tenantId = req.params.tenantId;
      let username = decodeURIComponent(req.params.userId);
      if(!username) return res.json({ error: 'Username is required', success: false });
      username = username.toLowerCase();
      const { currentPassword, newPassword } = req.body;
      const result = await updatePassword(username, currentPassword, newPassword, tenantId);
      res.json(result);
    } catch (e) {
      res.json({ error: e.message || e, success: false });
    }
  })

  // get user details (accessible to tenants)
  app.get('/tenants/:tenantId/users/:userId', verifyToken, async (req, res) => {
    try {
      let tenant = await Tenant.findOne({ id: req.params.tenantId })
      if (!tenant) return res.json({ error: 'Tenant not found', status: 404 })
      if (tenant.id !== req.tenantId)
        return res.json({ error: 'Not authorised', status: 401 })
      let user = tenant.users.find((u) => u.username === req.params.userId)
      if (!user) return res.json({ error: 'User not found', status: 404 })
      return res.json({ 
        userDetails: {
          userId: user.username,
          name: user.name,
          role: user.role,
          tenantId: tenant.id,
          tenantName: tenant.name,
        },
        success: true,
      })
    } catch (err) {
      res.json({ error: err.message || err, success: false })
    }
  })

  // reset password
  app.post('/users/:userId/reset-password', async (req, res) => {
    
    // For security reasons, we don't want to reveal if the user exists or not
    let username = decodeURIComponent(req.params.userId);
    if(!username) return res.json({ error: 'Username is required', success: false });
    username = username.toLowerCase();
    
    try {
      const result = await resetPassword(username)
      return res.json(result)
    } catch (e) {
      res.json({ error: e.message || e, success: false })
    }
  })  
}

module.exports = { usersApi }
