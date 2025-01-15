<template>
  <div class="flex min-w-[100vw] h-full grow">
    <div class="w-1/4 max-w-sm min-w-[200px] flex flex-col items-start gap-0.5 ps-2 lg:ps-4 pe-2 xl:pe-4 border-r pt-4 min-h-[calc(100vh - 48px)] bg-white ">
      <router-link
        :to="{ name: 'ExpertsPage' }"
        :params="{ surveyId: currentSurveyId, expertId: 'pooled' }"
      >
        <div
          class="flex items-center gap-1 p-2 w-fit text-sm cursor-pointer hover:text-gray-700/50 px-3 text-gray-700 font-semibold"
        >
          <Icon icon="bi:chevron-left" class="w-5 h-5" />
          Back to Experts
        </div>
      </router-link>
      <SelectQuestion :agenda="currentSurveyAgenda" v-model="selectedQuestion" />
    </div>

    <!-- Main panel -->

    <!--  breadcrumbs -->
    <div class="py-6 px-6 mx-auto flex flex-col justify-start w-full overflow-x-auto container">
      <div class="flex gap-2 justify-start items-center py-2 ps-2 mb-0">
        <router-link
          class="router-link-class"
          v-if="isLoggedIn"
          :to="{
            name: 'SurveyOverview'
          }"
          >Surveys</router-link
        >
        <span class="text-vGray-400">/</span>
        <router-link
          class="router-link-class md:pl-2"
          v-if="isLoggedIn && currentSurveyId"
          :to="{
            name: 'ExpertsPage',
            params: { surveyId: currentSurveyId }
          }"
          >Experts</router-link
        >
        <span class="text-vGray-400">/</span>
        <router-link
          class="router-link-active md:pl-2"
          v-if="isLoggedIn && currentSurveyId"
          :to="{
            name: 'ResultsPage',
            params: {
              surveyId: currentSurveyId,
              expertId: 'pooled'
            }
          }"
          >Responses</router-link
        >

        <button
          class="px-1.5 py-1 rounded-md bg-priorb-white text-gray-700 gap-1 flex ms-auto border border-gray-300 hover:bg-gray-50"
          @click="clearCacheAndUpdateWrapper()"
        >
          <span class="ms-1 text-sm font-semibold"> Refresh </span>
          <Icon icon="bi:arrow-clockwise" class="text-xl ms-1" />
        </button>
      </div>
      <!-- header above chart -->
      <ResultsHeader :questions="currentSurveyQuestions" v-model="selectedQuestion" />
      <ResultsRoulette
        ref="rouletteComponent"
        v-if="selectedQuestionType === 'roulette'"
        v-model="selectedQuestion"
        :refreshTrigger="refreshTrigger"
      />
      <ResultsRadio
      v-else-if="selectedQuestionType === 'radio'"
      v-model="selectedQuestion" />
      <ResultsRadioLikert
        v-else-if="selectedQuestionType === 'radiolikert'"
        v-model="selectedQuestion" />
      <ResultsCheckbox
        v-else-if="selectedQuestionType === 'checkbox'"
        v-model="selectedQuestion"
      />
      <ResultsNumber
        v-else-if="selectedQuestionType === 'number'"
        v-model="selectedQuestion"
      />
      <ResultsText
        v-else-if="selectedQuestionType === 'text' || selectedQuestionType === 'textarea'"
        v-model="selectedQuestion"
      />
      <ResultsMinMaxBest
        v-else-if="selectedQuestionType === 'minMaxBest'"
        v-model="selectedQuestion"
      />
      <ResultsMatrix
        v-else-if="selectedQuestionType === 'matrix'"
        v-model="selectedQuestion" />
      <ResultsRadioRich
        v-else-if="selectedQuestionType === 'radiorich'"
        v-model="selectedQuestion" />
      <ResultsTableQuestion
        v-else-if="selectedQuestionType === 'table'"
        v-model="selectedQuestion" />
      <ResultsValidation
        v-else-if="selectedQuestionType === 'validation'"
        v-model="selectedQuestion"
      />
      <ResultsWorkshopProbability
        v-else-if="selectedQuestionType === 'workshopprobability'"
        v-model="selectedQuestion"
      />

      <div v-else class="w-full relative h-20 mt-20">
        <div
        v-if="initalLoading"
          class="loading-overlay rounded-lg inset-0 bg-opacity-50 flex items-center justify-center z-10 absolute w-full h-full inset-0"
        >
          <div class="spinner"></div>
        </div>
        <div v-else class="flex items-center justify-center w-full h-full">
          <div class="text-vGray-400 text-2xl">Something went wrong or no data available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import ResultsHeader from '@/components/admin/ResultsHeader.vue'
import ResultsRoulette from '@/components/admin/ResultsRoulette.vue'
import ResultsRadio from '@/components/admin/ResultsRadio.vue'
import ResultsRadioRich from '@/components/admin/ResultsRadioRich.vue'
import ResultsTableQuestion from '@/components/admin/ResultsTableQuestion.vue'
import ResultsRadioLikert from '@/components/admin/ResultsRadioLikert.vue'
import ResultsMatrix from '@/components/admin/ResultsMatrix.vue'
import ResultsCheckbox from '@/components/admin/ResultsCheckbox.vue'
import ResultsText from '@/components/admin/ResultsText.vue'
import ResultsNumber from '@/components/admin/ResultsNumber.vue'
import ResultsMinMaxBest from '@/components/admin/ResultsMinMaxBest.vue'
import ResultsValidation from '@/components/admin/ResultsValidation.vue'
import ResultsWorkshopProbability from '@/components/admin/ResultsWorkshopProbability.vue'
import SelectQuestion from '@/components/admin/SelectQuestion.vue'
import NavBtn from '@/components/admin/NavLink.vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'


const props = defineProps({
  expertId: String
})
const refreshTrigger = ref(false)
const clearCacheAndUpdateWrapper = () => {
  if (selectedQuestionType.value === 'roulette') {
    refreshTrigger.value = !refreshTrigger.value
  } else {
    adminStore.clearCacheAndUpdate()
  }
}

const adminStore = useAdminStore()
const {
  currentSurveyQuestions,
  currentSurveyAgenda,
  currentExperts,
  currentSurveyId,
  tenantId,
  cachedData,
  isLoggedIn,
} = storeToRefs(adminStore)

const initalLoading = ref(true)

setTimeout(() => {
  initalLoading.value = false
}, 5000)

onBeforeUnmount(() => {
  adminStore.cachedData = {}
})

if (!currentSurveyId.value) {
  const route = useRoute()
  adminStore.selectSurvey(route.params.surveyId)
  currentSurveyId.value = route.params.surveyId
  setTimeout(() => {
    selectedQuestion.value = currentSurveyQuestions.value[0]?._id
  }, 1000)
}

// initialize selected question if not provided
const selectedQuestion = ref(
  currentSurveyQuestions?.value ? currentSurveyQuestions.value[0]?._id : null
)


const mapQuestionToType = (question) => {
  if (!question)
    return null
  if (question.questionType)
    return question.questionType
  if (question?.content?.questionType)
    return question.content.questionType
  if (question.viewId === 'QuestionTable')
    return 'table'
  if (question.viewId === 'QuestionRoulette')
    return 'roulette'
  if (question.viewId === 'QuestionRadioRich')
    return 'radioRich'
  if (question.viewId === 'QuestionRadioLikert')
    return 'radiolikert'
  if (question.viewId === 'QuestionCheckbox')
    return 'checkbox'
  if(question.viewId === 'ValidateMinMaxBest')
    return 'validation'
  if (question.viewId === 'ValidateProbabilityMethod')
    return 'validation'
  if (question.viewId === 'ValidateProbabilityMethodConditional')
    return 'validation'
  return null
}

const selectedQuestionType = computed(() => {
  let question = currentSurveyQuestions?.value?.find(
    (question) => question._id === selectedQuestion.value
  )
  return mapQuestionToType(question)
})

watch(
  selectedQuestion,
  (newVal, oldVal) => {
    if (!newVal && !oldVal) {
      selectedQuestion.value = currentSurveyQuestions?.value
        ? currentSurveyQuestions.value[0]?._id
        : null
    }
  },
  { immediate: true }
)

</script>

<style scoped>

.spinner {
  border: 6px solid rgba(255, 255, 255, 0.1);
  border-left-color: theme('colors.priorb.primary');
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: spin 0.85s linear infinite;
}
</style>
