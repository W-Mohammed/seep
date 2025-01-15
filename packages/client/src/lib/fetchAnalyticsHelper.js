import { toast } from 'vue-sonner'
import { getAnalyticsChipsAndBins } from '@/api/analytics'

export const fetchAnalytics = async (
  tenantId,
  currentSurveyId,
  selectedQuestion,
  selectedModel,
  currentResult,
  loadingState,
  cachedData,
  anonymiseExperts,
) => {
  if (!selectedQuestion.value || !currentSurveyId.value) return toastError()

  // cached?
  let cacheKey = `${currentSurveyId.value}-${selectedQuestion.value}-${selectedModel.value}`
  if (cachedData.value[cacheKey]) {
    currentResult.value = cachedData.value[cacheKey]
    if (cachedData.value[cacheKey + 'warning']) {
      toastError(cachedData.value[cacheKey + 'warning'])
    }
    return
  }

  // go fetch
  let response
  loadingState.value = true

  let warningMsg = ""
  try {
    response = await getAnalyticsChipsAndBins(
      tenantId.value,
      currentSurveyId.value,
      'pooled',
      selectedQuestion.value,
      selectedModel.value
    )
    if (response.warning) {
      let warningFromR = response.warning
      if (anonymiseExperts.value) {
        let idx = warningFromR.indexOf(':')
        if (idx > 0) 
          warningFromR = warningFromR.substring(0, idx)
      }
      warningMsg = warningFromR
    } 
  } catch (error) {
    response = createFetchError(error)
  }

  

  loadingState.value = false
  currentResult.value = response.data || response.error || {}
  if (response.error) {
    cachedData.value[cacheKey] = null
  } else {
    cachedData.value[cacheKey] = response.data || response.error || {}
  }

  if (warningMsg) {
    toastError(warningMsg)
    cachedData.value[cacheKey + 'warning'] = warningMsg
  } else if (response.error || response.success === false) {
    //TODO: change the backend to not send this error message
    if (response.error != "No experts found" && response.error != "No expert responses found for this question") {
      toastError(response?.message || response?.error || null)
    }
  } else {
    toastSuccess('Data loaded')
  }
  
}

export function createFetchError(error) {
  return {
    message: error.error || error.message || 'Error',
    error: {
      error: {
        expertId: 'No data',
        expertName: 'No data',
        fit: {
          x: [0, 100],
          y: [0, 0]
        },
        hist: {
          x: [0, 100],
          y: [0, 0]
        }
      }
    }
  }
}

export const toastError = (str) => {
  toast.error(str || 'Something went wrong', {
    style: { background: '#fda0a0' },
    duration: 10000
  })
}

export const toastSuccess = (str) => {
  toast.success(str || 'Success', {
    style: { right: '1px', width: '200px', background: '#fff' }
  })
}
