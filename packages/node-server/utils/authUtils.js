const isAuthorised = (req) => {   
    if (req.superadmin) return true
    if (req.tenantId === req.params.tenantId) return true
    return false
}

const isSuperAdmin = (req) => {
    return req.superadmin
}

module.exports = { isAuthorised, isSuperAdmin }