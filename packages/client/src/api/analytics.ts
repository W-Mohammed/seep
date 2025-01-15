import axios from 'axios'
import { apiOptions, apiOptionsWithAuth } from './index'

export async function getAnalyticsChipsAndBins(tenantId, surveyId, expertId, questionId, model) {
        const { data } = await axios.get(`tenants/${tenantId}/surveys/${surveyId}/experts/${expertId}/responses/${questionId}/analytics/chipsandbins?model=${model}`, apiOptionsWithAuth())

        return data
}

export async function getRawDataDump(tenantId, surveyId) {
        const { data } = await axios.get(`tenants/${tenantId}/surveys/${surveyId}/rawdatadump`, apiOptionsWithAuth())

        return data
}

export async function getAnalyticsChipsAndBinsPsa(tenantId, surveyId,  questionId, model, psaSamples: number) {
        const { data } = await axios.get(`tenants/${tenantId}/surveys/${surveyId}/experts/pooled/responses/${questionId}/analytics/chipsandbins/psa?model=${model}&psaSamples=${psaSamples}`, apiOptionsWithAuth())

        return data
}


export async function getProbabilityFit(values, probabilities, xMin, xMax, nx) {
        const { data } = await axios.get(`analytics/probabilityfit?values=${values}&probabilities=${probabilities}&xMin=${xMin}&xMax=${xMax}&nx=${nx}`, apiOptionsWithAuth())

        return data
}