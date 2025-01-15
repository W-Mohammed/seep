import axios from 'axios'
import { apiOptionsWithAuth } from './index'

/////////// SURVEY ENDPOINTS ///////////

export async function getSurveys(tenantId) {
  if(!tenantId) throw new Error('Tenant ID is required')
  const { data } = await axios.get(`tenants/${tenantId}/surveys`, apiOptionsWithAuth())
  return data
}

// update survey status
// '/tenants/:tenantId/surveys/:surveyId/status'
export async function updateSurveyStatus(tenantId, surveyId, status) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!surveyId) throw new Error('Survey ID is required')
  if (!status) throw new Error('Status is required')
  const { data } = await axios.put(`tenants/${tenantId}/surveys/${surveyId}/status`, { status }, apiOptionsWithAuth())
  return data
}

/////////// DRAFT SURVEY ENDPOINTS ///////////

// get draft survey '/tenants/:tenantId/draftsurveys/:surveyId'
export async function getDraftSurvey(tenantId, surveyId) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!surveyId) throw new Error('Survey ID is required')
  const { data } = await axios.get(`tenants/${tenantId}/draftsurveys/${surveyId}`, apiOptionsWithAuth())
  return data
}

// create draft survey '/tenants/:tenantId/draftsurveys'
export async function createDraftSurvey(tenantId, survey) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!survey) throw new Error('Survey is required')
  if (!survey.agenda) throw new Error('Survey draft requires an agenda property')
    
  const { data } = await axios.post(`tenants/${tenantId}/draftsurveys`, survey, apiOptionsWithAuth())
  return data
}

// update draft survey '/tenants/:tenantId/draftsurveys'
export async function updateDraftSurvey(tenantId, survey) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!survey) throw new Error('Survey is required')
  if (!survey.agenda) throw new Error('Survey draft requires an agenda property')
    
  const { data } = await axios.put(`tenants/${tenantId}/draftsurveys`, survey, apiOptionsWithAuth())
  return data
}

// delete a draft survey '/tenants/:tenantId/draftsurveys/:surveyId'
export async function deleteDraftSurvey(tenantId, surveyId) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!surveyId) throw new Error('surveyId key is required')
  const { data } = await axios.delete(`tenants/${tenantId}/draftsurveys/${surveyId}`, apiOptionsWithAuth())
  return data
}

// get draft survey for testing '/tenants/:tenantId/draftsurveys/:surveyId'
export async function getDraftSurveyForTesting(tenantId, surveyId) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!surveyId) throw new Error('Survey ID is required')
  const { data } = await axios.get(`tenants/${tenantId}/draftsurveys/${surveyId}`, apiOptionsWithAuth())
  return data
}

/////////// SURVEY ENDPOINTS ///////////

// create a survey 
//app.post('/tenants/:tenantId/surveys',
export async function createSurvey(tenantId, survey) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!survey) throw new Error('Survey is required')
  const { data } = await axios.post(`tenants/${tenantId}/surveys`, survey, apiOptionsWithAuth())
  return data
}

// generate compliance PDF
export async function generateCompliancePDF(tenantId, surveyId) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!surveyId) throw new Error('Survey ID is required')
  const {data}  = await axios.get(`tenants/${tenantId}/surveys/${surveyId}/compliancepdf`,  apiOptionsWithAuth())
  return data
}

export async function getSurvey(tenantId, id) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!id) throw new Error('Survey ID is required')
  const { data } = await axios.get(`tenants/${tenantId}/surveys/${id}`, apiOptionsWithAuth())
  return data
}

// delete a survey
// '/tenants/:tenantId/surveys/:surveyId'
export async function deleteSurvey(tenantId, surveyId) {
  if(!tenantId) throw new Error('Tenant ID is required')
  if (!surveyId) throw new Error('surveyId key is required')
  const { data } = await axios.delete(`tenants/${tenantId}/surveys/${surveyId}`, apiOptionsWithAuth())
  return data
}
