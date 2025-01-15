import axios from 'axios'
import { apiOptions } from './index'

export async function lockSurvey(tenantId, surveyId, expertId) {

    const { data } = await axios.post(
        `tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}/lock`, {}, apiOptions)

    return data;
}
