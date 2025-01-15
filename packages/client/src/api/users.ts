import axios from 'axios'
import { apiOptions, apiOptionsWithAuth } from './index'

export async function updatePassword(tenantId, username, currentPassword, newPassword) {
  const { data } = await axios.put(`tenants/${tenantId}/users/${encodeURIComponent(username)}/password`, { currentPassword, newPassword }, apiOptions)
  return data
}

export async function getUser(tenantId, username) {
  const { data } = await axios.get(`tenants/${tenantId}/users/${encodeURIComponent(username)}`, apiOptionsWithAuth())
  return data
}

export async function deleteUser(tenantId, username) {
  const { data } = await axios.delete(`tenants/${tenantId}/users/${encodeURIComponent(username)}`, apiOptionsWithAuth())
  return data
}

export async function requestPasswordReset(username) {
  const { data } = await axios.post(`users/${encodeURIComponent(username)}/reset-password`, {}, apiOptions)
  return data
}