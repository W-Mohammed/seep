const { verifyToken } = require('../auth/authMiddleware')
const { Tenant } = require('../database/tenant.model')
const {
  validateTenantCreationRequest,
  createTenant,
  deleteTenant,
  validateTenantDeletionRequest,
} = require('../services/tenant.service')
// superadmin only
const tenantsApi = function (app) {
  // get all tenants
  app.get('/tenants', verifyToken, async (req, res) => {
    if (!req.superadmin) return res.json({ error: 'Not authorised', status: 401 })
    let allTenants = await Tenant.find({}).select('id name createdAt updatedAt')
    if (!allTenants) return res.json({ error: 'No tenants found', status: 404 })
    return res.json({ tenants: allTenants, status: 200 })
  })

  // create a new tenant
  app.post('/tenants', verifyToken, async (req, res) => {
    const requestIsValid = validateTenantCreationRequest(req)
    if (!requestIsValid.success) return res.json(requestIsValid)

    try {
      const result = await createTenant(req.body)
      return res.json(result)
    } catch (e) {
      res.json({ error: e.errmsg || e, success: false })
    }
  })

  // delete tenant
  app.delete('/tenants/:tenantId', verifyToken, async (req, res) => {
    const requestIsValid = validateTenantDeletionRequest(req)
    if (!requestIsValid.success) return res.json(requestIsValid)

    try {
      const result = await deleteTenant(req.params.tenantId)
      return res.json(result)
    } catch (e) {
      res.json({ error: e.errmsg || e, success: false })
    }
  })
}

module.exports = { tenantsApi }
