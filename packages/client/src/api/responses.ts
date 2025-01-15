import axios from 'axios'
import { apiOptions } from './index'

// expert posts a survey response
export async function postResponse(
  props = {
    tenantId: '',
    surveyId: '',
    expertId: '',
    _id: '',
    response: '',
    lastVisitedPageIndex: 0
  }
) {
    const { tenantId, surveyId, expertId, _id, response, lastVisitedPageIndex } = props
    const payload = {
      _id,
      response,
      lastVisitedPageIndex
    }
    const res  = await axios.post(
      `tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}/responses`,
      payload,
      apiOptions
    )
    return res
}

// admin gets specific expert response
export async function getOneResponse(
  tenantId,
  surveyId,
  expertId,
  questionId
) {
  try {
    const { data } = await axios.get(
      `tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}/responses/${questionId}`,
      apiOptions
    )
    return data
  } catch (error) {
    console.error('getOneResponse', error)
  }
}
