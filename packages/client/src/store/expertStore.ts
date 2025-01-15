import { defineStore } from 'pinia'
import { getExpert, selfCreateAndGetExpert } from '@/api/experts'
import {getDraftSurveyForTesting} from '@/api/surveys'
import { postResponse } from '@/api/responses'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { decomposeRoute, isQuestion, isValidation, agendaItemsLabeller, rouletteFieldMissingWarning, minMaxBestMissingWarning } from '@/lib/utils'
import { lockSurvey } from '@/api/lock'

export const useExpertStore = defineStore('expertStore', () => {
  
  // meta params
  const tenantId = ref('')
  const surveyId = ref('')
  const expertId = ref('')
  const expertName = ref('')
  const studyContact = ref({})
  const studyName = ref('')
  const studyDescription = ref('')

  // data
  const agenda = ref([])
  const data = ref({})
  const responses = ref({})
  const responsesSaved = ref({})
  const lockedScreen = ref({})

  // navigation variables
  const currentPageIndex = ref(0)

  // status variables
  const surveyGoingOn = ref(false)
  const error = ref<null | unknown>(null)
  const errorMsg = ref('')
  const loading = ref(false)
  const isSaving = ref(false)
  const savingError = ref(false)
  const hideNavBtns = ref(false)
  const postSubmissionViewOnly = ref(false)
  const disableComments = ref(false) // for the whole survey
  
    
  //validation
  const shouldTriggerValidation = ref(false)

  // router
  const router = useRouter()
  const { query, params } = useRoute()


  // agenda items getters
  const currentPage = computed(() => agenda.value[currentPageIndex.value] || {})


  const currentPageId = computed(() => {
    if(currentPage?.value._id) return currentPage?.value._id
    if(expertId.value === 'test') return currentPageIndex.value
    return null
  })

  const currentPageCollectsData = computed(() => isQuestion(currentPage.value) || isValidation(currentPage.value))


  const showCommentField = computed(() => {
    if (disableComments.value) return false
    if (currentPage?.value?.options?.showCommentField != null) return currentPage?.value?.options?.showCommentField
    return false
  })

  // current question completed OR not a question?
  const currentPageIsCompleted = computed(() => {
    return isQuestion(currentPage.value) ? currentPageValue.value?.completed : true
  })

  // API wrappers
  const postExpertResponse = async (moveIndex = 0) => {
    if (!surveyGoingOn.value) return
    if(postSubmissionViewOnly.value) return
    if(!currentPageId.value) return
    if(expertId.value === 'test') return
    if (!currentPageCollectsData.value) return
    
    let pageId = currentPageId.value
    let response = currentPageValue.value || {}
    let page = currentPageIndex.value + moveIndex
    let responseAsString = JSON.stringify(response)
    
    if (responseAsString === responsesSaved.value[pageId]) return
    const oldEntry = responsesSaved.value[pageId]
    responsesSaved.value[pageId] = responseAsString
    isSaving.value = true
    const payload = {
      tenantId: tenantId.value,
      surveyId: surveyId.value,
      expertId: expertId.value,
      _id: pageId,
      response: response,
      lastVisitedPageIndex: page
    }
    
    try {
      const res = await postResponse(payload)
      // Prevent the loading spinner from disappearing too quickly
       await new Promise((resolve) => setTimeout(resolve, 1000))
        if (!res?.data?.success) {
          savingError.value = true
          responsesSaved.value[pageId] = oldEntry
        } else {  
          savingError.value = false
        }
    } catch (e) {
      savingError.value = true
      console.log('error', e)
      responsesSaved.value[pageId] = oldEntry
    } finally {
      isSaving.value = false
    }
    return
  }


  async function postLockSurvey() {
    await lockSurvey(tenantId.value, surveyId.value, expertId.value)
    surveyGoingOn.value = false
    agenda.value = [lockedScreen.value]
    currentPageIndex.value = 0
    await router.push({ name: currentPage.value.viewId })
    return
  }

  // Navigation functions
  async function goToNextPage() {
    if (!canGoNext.value) return
    postExpertResponse(1)
    currentPageIndex.value++
    await router.push({ name: currentPage.value.viewId })
  }

  async function goToPreviousPage() {
    if (!canGoPrevious.value) return
    postExpertResponse(-1)
    currentPageIndex.value--
    await router.push({ name: currentPage.value.viewId })
  }

  async function goToPageByPageId(pageId) {
    const index = agenda.value.findIndex((item) => item.pageId === pageId)
    if (index === -1) return
    postExpertResponse(index - currentPageIndex.value)
    currentPageIndex.value = index
    await router.push({ name: currentPage.value.viewId })
  }
  async function goToPageByIndex(index) {
    if (index < 0 || index >= agenda.value.length) return

    postExpertResponse(index - currentPageIndex.value)

    currentPageIndex.value = index

    await router.push({ name: currentPage.value.viewId })
  }

  async function mountView(viewId) {
    await router.push({ name: viewId ?? 'Error404Page' })
  }








  async function initialiseStore() {
    if (!params.route) return
    if (!query) return
    
    const queryParams = decomposeRoute(params.route, query.id)
    
    if (!queryParams) return mountView('Error404Page')

    if (!queryParams.tenantId || !queryParams.surveyId) {
      errorMsg.value = 'Survey url is invalid or missing'
      return mountView('Error404Page')
    }

    tenantId.value = queryParams.tenantId
    surveyId.value = queryParams.surveyId
    expertId.value = queryParams.expertId

    if (query.draftsurvey) {
      return initialiseSurveyWithDraftSurvey(queryParams.tenantId, queryParams.surveyId)
    } else if (!queryParams.expertId) {
      errorMsg.value = 'Expert ID is invalid or missing'
      return mountView('Error404Page')
    } else if (queryParams.expertId === 'new') {
      selfCreateAndGetExpertData(queryParams.tenantId, queryParams.surveyId)
    } else {
      getExpertData(queryParams.tenantId, queryParams.surveyId, queryParams.expertId, query.token)
    }
  
  }

  async function getExpertData(tenantId, surveyId, expertId, token) {
    try {
      const { expert, error } = await getExpert(
        tenantId,
        surveyId,
        expertId,
        token
      )
      if (error) {
        // @ts-expect-error we don't have error types
        errorMsg.value = error?.response?.data?.message ||
        error?.response?.data?.error ||
          'Could not fetch expert data'
        await mountView('Error404Page')
        return
      }
      if (!expert) {
        throw new Error('No expert found')
      }
      currentPageIndex.value = expert.lastVisitedPageIndex ?? 0
      if (currentPageIndex.value < 0) currentPageIndex.value = 0
      else if (currentPageIndex.value >= expert.survey.agenda.length - 1) currentPageIndex.value = expert.survey.agenda.length - 1
      
      expert.responses?.forEach((response) => {
        responses.value[response.questionId] = response.value
        responsesSaved.value[response.questionId] = JSON.stringify(response.value)
      })
      agenda.value = expert.survey?.agenda ?? []
      data.value = expert
      studyContact.value = expert.survey?.studyContact
      studyName.value = expert.survey?.name
      studyDescription.value = expert.survey?.description
      expertName.value = expert.name
      lockedScreen.value = expert.survey?.lockedScreen;
      disableComments.value = expert.survey?.config?.disableComments 

      if (!expert.locked) {
        surveyGoingOn.value = true
      } else if (expert.survey?.config?.allowPostSubmissionView) {
        postSubmissionViewOnly.value = true
      } else {
        surveyGoingOn.value = false
        postSubmissionViewOnly.value = false
      }
    } catch (e) {
      error.value = e
    } finally {
  
      // router.push({ name: currentPage.value.viewId })
    }
  }

  async function initialiseSurveyWithDraftSurvey(tenantId, surveyId) {
    
    try {
      const {survey, error} = await getDraftSurveyForTesting(
        tenantId,
        surveyId,
      )
      if (error) {
        // @ts-expect-error we don't have error types
        errorMsg.value = error?.response?.data?.message ?? 'Could not fetch expert data'
        await mountView('Error404Page')
        return
      }    
      currentPageIndex.value =  0
      agenda.value = survey.agenda ?? []
      surveyGoingOn.value = true
      // data.value = expert
      studyContact.value = survey?.studyContact
      studyName.value = survey?.name
      studyDescription.value = survey?.description
      expertId.value = 'test'
      lockedScreen.value = survey?.lockedScreen;
      disableComments.value = survey?.config?.disableComments 
    } catch (e) {
      console.log("error", e)
      error.value = e
    } finally {
      // router.push({ name: currentPage.value.viewId })
    }
  }


  async function selfCreateAndGetExpertData(tenantId, surveyId) {
    try {
      const { expert } = await selfCreateAndGetExpert(
        tenantId,
        surveyId
      )

        if (!expert) {
          throw new Error('No expert found')
        }
      
        expertId.value = expert._id
  
        currentPageIndex.value = expert.lastVisitedPageIndex ?? 0
        if (currentPageIndex.value < 0) currentPageIndex.value = 0
        else if (currentPageIndex.value >= expert.survey.agenda.length - 1) currentPageIndex.value = expert.survey.agenda.length - 1
        
        expert.responses?.forEach((response) => {
          responses.value[response.questionId] = response.value
          responsesSaved.value[response.questionId] = JSON.stringify(response.value)
        })
        
        agenda.value = expert.survey?.agenda ?? []
        data.value = expert
        studyContact.value = expert.survey?.studyContact
        studyName.value = expert.survey?.name
        studyDescription.value = expert.survey?.description
        expertName.value = expert.name
      lockedScreen.value = expert.survey?.lockedScreen;
      disableComments.value = expert.survey?.config?.disableComments 
  
        if (!expert.locked) {
          surveyGoingOn.value = true
        } else if (expert.survey?.config?.allowPostSubmissionView) {
          postSubmissionViewOnly.value = true
        } else {
          surveyGoingOn.value = false
          postSubmissionViewOnly.value = false
        }
      } catch (e) {
        console.error('error', e)
        errorMsg.value = e?.response?.data?.error || e
      mountView('Error404Page')
      return { expert: null, error }
    } finally {
      // change query to include expertId to allow page refresh
      setTimeout(() => {
        router.push({ name: currentPage.value.viewId , query: { ...query, id: expertId.value } })
      }, 10)
    }
  }


  
  

  // progress bar getters
  const currentProgressIndex = computed(() =>
    agenda?.value?.length === 0 ? 0 : currentPageIndex.value + 1
  )

  const maxProgress = computed(() => agenda.value.length)

  const currentProgressPercentage = computed(() => {
    let progress = (currentProgressIndex.value / maxProgress.value) * 100
    if (isNaN(progress)) progress = 0

    return Math.min(Math.max(progress, 0), 100).toFixed(0)
  })

  // question progress bar getters
  const progressBoxesGetter = computed(() =>
    agenda.value.map((item) => {
      return {
        type: isQuestion(item) ? 'question' : item.isValidation ? 'validation' : 'tutorial',
        isCompleted: isQuestion(item) ? responses.value[item._id]?.completed : true,
        isCurrent: item.pageId === currentPage.value.pageId
      }
    })
  )

  const getUncompletedItemIndices = computed(() => {
    const indices: number[] = []
    agenda.value.forEach((item, index) => {
      if (isQuestion(item) && !responses.value[item._id]?.completed) {
        indices.push(index)
      }
    })
    return indices
  })

  // navigation checks
  const canGoNext = computed(() => currentPageIndex.value < agenda.value.length - 1)


  
  const currentPageError = computed(() => {
    if (!currentPage || !currentPage.value || !currentPageValue || !currentPageValue.value || currentPage.value.pageType !== "question") return null;
    
    const currentValue = currentPageValue.value;

    if (currentPage.value.viewId === 'QuestionRoulette') {
      return rouletteFieldMissingWarning(currentValue);
    } else if (currentPage.value.viewId === 'QuestionMinMaxBest'){
      return minMaxBestMissingWarning(currentValue);
    } else if (currentPage.value.viewId === 'WorkshopProbability'){
      return minMaxBestMissingWarning(currentValue);
    } else {
    return '';
    }
  });

  const canGoPrevious = computed(() => currentPageIndex.value > 0)

  // agenda items getters
  const agendaItems = computed(() => {
    return agendaItemsLabeller(agenda.value).filter((item) => item.qType != 'Page')
  })

  const currentPageValue = computed({
    get() {
      if (!currentPageCollectsData.value) return null
      return responses.value[currentPageId.value]
    },
    set(newValue) {
      if (!currentPageCollectsData.value) return null
      responses.value[currentPageId.value] = newValue
    }
  })

  // response getters
  const getResponseByPageId = (pageId) => {
    const item = agenda.value.find((item) => item.pageId === pageId)
    if (!item) return null
    return responses.value[item._id] || null
  }

  // agenda items actions
  const setCurrentQuestionCompleted = (completed) => {
    if (isQuestion(currentPage.value))
      currentPageValue.value.completed = completed
  }


  // look up next page's component name
  const getNextPageComponent = () => {
    if(currentPageIndex.value + 1 >= agenda.value.length) return null
    return agenda.value[currentPageIndex.value + 1].viewId
  }

  return {
    tenantId,
    surveyId,
    expertId,
    error,
    errorMsg,
    loading,
    responses,
    canGoNext,
    canGoPrevious,
    shouldTriggerValidation,
    showCommentField,
    goToPageByPageId,
    goToNextPage,
    goToPreviousPage,
    getNextPageComponent,
    mountView,
    initialiseStore,
    currentProgressPercentage,
    maxProgress,
    currentProgressIndex,
    currentPageIndex,
    currentPage,
    currentPageValue,
    postExpertResponse,
    agendaItems,
    goToPageByIndex,
    postLockSurvey,
    setCurrentQuestionCompleted,
    hideNavBtns,
    getResponseByPageId,
    progressBoxesGetter,
    getUncompletedItemIndices,
    currentPageIsCompleted,
    expertName,
    studyContact,
    studyName,
    studyDescription,
    surveyGoingOn,
    isSaving,
    savingError,
    currentPageCollectsData,
    currentPageError,
    postSubmissionViewOnly
  }
})
