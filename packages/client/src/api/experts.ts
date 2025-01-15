import axios from 'axios'
import { apiOptions, apiOptionsWithAuth } from './index'

export async function getExpert(tenantId, surveyId, expertId, token) {
  if (!tenantId || !surveyId || !expertId) {
    console.error('getExpert Error: tenantId, surveyId, expertId are required')
    return { error: 'tenantId, surveyId, expertId are required', success: false }
  }
  if (token && apiOptions.headers) {
    apiOptions.headers['Authorization'] = `Bearer ${token}`
  }
  try {
    const { data } = await axios.get(
      `tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}`,
      apiOptions
    )
    const { expert } = data
    return { expert, error: null }
  } catch (error) {
    return { expert: null, error }
  }
}


export async function selfCreateAndGetExpert(tenantId, surveyId) {
  if (!tenantId || !surveyId) {
    console.error('getExpert Error: tenantId and surveyId are required')
    return { error: 'tenantId and surveyId are required', success: false }
  }
  
  const body = {}
    const { data } = await axios.post(
      `tenants/${tenantId}/surveys/${surveyId}/experts/new`,
      body,
      apiOptions)
    const { expert } = data
    return { expert, error: null }
}





export async function createExpert(tenantId, surveyId, body) {
  const { data } = await axios.post(`tenants/${tenantId}/surveys/${surveyId}/experts`, body, apiOptionsWithAuth())

  return data
}

export async function updateExpert(
  tenantId,
  expertId,
  surveyId,
  body
) {
  const { data } = await axios.patch(
    `tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}`,
    body,
    apiOptionsWithAuth()
  )

  return data
}

export async function sendEmail(tenantId, expertId, surveyId, body) {
  const { data } = await axios.post(
    `tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}/invitation`,
    body,
    apiOptionsWithAuth()
  )

  return data
}
