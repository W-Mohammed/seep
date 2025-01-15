const { Tenant } = require("../database/tenant.model");


function validateTenantCreationRequest(req) {
  if (!req.superadmin) return { error: "Not authorised", status: 401, success: false };
  if (!req.body.id || !req.body.name) return { error: "Tenant id and name are required", status: 400, success: false };
  if (req.body.users?.length > 0) return { error: "Tenants cannot be created with users, they must be added separately", status: 400, success: false };
  return { success: true };
}

function validateTenantDeletionRequest(req) {
  if (!req.superadmin) return { error: "Not authorised", status: 401, success: false };
  return { success: true };
}


async function createTenant(tenantData) {

    let tenant = await Tenant.create({
      id: tenantData.id,
      name: tenantData.name,
    });
    return { tenantId: tenant.id, message: `New tenant created with id ${tenant.id} and name ${tenant.name}.`, success: true };
}

// delete tenant
async function deleteTenant(tenantId) {
    let tenant = await Tenant.deleteOne({ id: tenantId });
    if (!tenant) return { error: "Tenant not found", success: false };
    if(tenant.deletedCount === 0) return { error: "Tenant not found", success: false };
    return { tenant, success: true };
}
      
module.exports = { validateTenantCreationRequest, createTenant, deleteTenant, validateTenantDeletionRequest };