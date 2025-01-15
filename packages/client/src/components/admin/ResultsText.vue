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
import { QuestionFormKitAgendaItem } from '@/models/AgendaClass'
const selectedQuestion = defineModel({ type: String, default: null })

const adminStore = useAdminStore()
const {
  currentSurveyQuestions,
  currentActiveExperts,
  currentSurveyId,
  tenantId,
  loading
} = storeToRefs(adminStore)

const responseByExpert = computed(() => QuestionFormKitAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value))

const statsTableDataForDownload = computed(() => {
  if (responseByExpert.value.length == 0) return []
  const out = [ ['name', 'expertId', 'response','comment'] ]
  responseByExpert.value.forEach((res) => out.push([res.name, res.expertId, res.value, res.comment])) 
  return out
})

const statsTableData = computed(() => {
  return statsTableDataForDownload.value.map((y) => y.slice(0, 1).concat(y.slice(2)))
})
</script>

<style scoped></style>