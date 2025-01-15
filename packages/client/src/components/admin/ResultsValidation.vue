<template>
  <div v-if="responseByExpert?.length">
    <div class="roulette-results">
      <div class="w-full flex flex-col">
        <div
          class="flex pt-5 px-4 NOT-bg-vGray-100 w-full text-priorb-SECONDARY me-auto rounded-b-lg rounded-r-lg"
        >
          <ButtonDownloadResults
            :statsTableData="statsTableDataForDownload"
            :questionId="selectedQuestion"
            :tenantId="tenantId"
            :surveyId="currentSurveyId"
            :showPsa="false"
          />
        </div>
      </div>


<div class=" mb-8">
<span class="font-semibold">
Validated Questions:
</span>
<ul class="border-l-2 mb-4 my-2 text-gray-700">
<li v-for="validatedQuestion in validatedQuestions" :key="validatedQuestion" class="text-sm">
{{ validatedQuestion }}
</li>
</ul>


      
     
      </div>
      
      <div class="border bg-priorb-50 font-semibold px-4 py-2 w-fit rounded mb-8">
      <div>Number of Experts who refined their Estimates: {{ expertsWhoRefined.length }}
      ({{ expertsWhoConfirmedOrRefined?.length !== 0 ? ((expertsWhoRefined?.length / expertsWhoConfirmedOrRefined?.length) * 100).toFixed(0) : 0 }}%)
      </div>

      </div>


      <!-- stats table -->
      <OverlaySpinner :loadingState="loading" />
      <ResultsTable :statsTableData="statsTableData" :validResponses="responseByExpert.length ?? 0" 
      class="mt-0"
      />
    </div>
  </div>
  <ResultsNoResults v-else />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
import ResultsTable from '@/components/admin/ResultsTable.vue'
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
import ResultsNoResults from './ResultsNoResults.vue'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
import { ValidationAgendaItem } from '@/models/AgendaClass'
const selectedQuestion = defineModel({ type: String, default: null })

const adminStore = useAdminStore()
const {
  currentActiveExperts,
  currentSurveyQuestions,
  currentSurveyId,
  tenantId,
  loading
} = storeToRefs(adminStore)

const responseByExpert = computed(() => ValidationAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value))


const expertsWhoRefined = computed(() => {
  return responseByExpert.value.filter((expert) => expert.value?.refineCount > 0)
})

const expertsWhoConfirmedOrRefined = computed(() => {
  return responseByExpert.value.filter((expert) => expert.value?.confirmCount > 0 || expert.value?.refineCount > 0)
})

const validatedQuestions = computed(() => {
  let questionsPageIds = currentSurveyQuestions.value.find((q) => q._id === selectedQuestion.value)?.content?.questionsToValidate
  if (questionsPageIds) {
    const qToV = questionsPageIds.map((q, index) => {
      return currentSurveyQuestions.value.find((q2) => q2.pageId === q)?.content?.questionTitle ?? 'No question text'
    })
    return qToV.filter((q) => q)
  }
  return []
})

const statsTableDataForDownload = computed(() => {
  if (responseByExpert.value.length == 0) return []
  const out = [ ['name', 'expertId', 'confirmCount','refineCount', 'comment'] ]
  responseByExpert.value.forEach((res) => out.push([res.name, res.expertId, res.value?.confirmCount, res.value?.refineCount, res.comment]))
  return out
})

const statsTableData = computed(() => {
  return statsTableDataForDownload.value.map((y) => y.slice(0, 1).concat(y.slice(2)))
})
</script>

<style scoped></style>