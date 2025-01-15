<template>
  <div v-if="responseByExpert?.length">
    <div class="w-full flex flex-col">
      <div
        class="flex pt-5 px-4 NOT-bg-vGray-100 w-full text-priorb-SECONDARY me-auto rounded-b-lg rounded-r-lg"
      >
        <ButtonDownloadResults
          :statsTableData="statsTableData"
          :chart="chartRef"
          :questionId="selectedQuestion"
          :tenantId="tenantId"
          :surveyId="currentSurveyId"
          :showPsa="false"
        />
      </div>
    </div>

    <!-- no other main panel -->

    <!-- comments -->
    <ResultsComments :current-active-experts="currentActiveExperts" :selected-question="selectedQuestion" />

    <!-- stats table -->
    <ResultsTable
      :statsTableData="statsTableData"
      :validResponses="responseByExpert?.length || '0'"
    />
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
import { countByCategory } from '@/lib/formKitUtils'
import { TableAgendaItem } from '@/models/AgendaClass'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
import ResultsComments from '@/components/admin/ResultsComments.vue';

const selectedQuestion = defineModel({ type: String, default: null })
const adminStore = useAdminStore()
const { currentActiveExperts, currentSurveyId, tenantId, currentSurveyQuestions, loading } =
  storeToRefs(adminStore)

const chartRef = ref(null)
const responseByExpert = computed(() => {
 return  TableAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value)
})

const responseStats = computed(() => countByCategory(responseByExpert.value))

// not used at the moment
const statsTableDataForDownload = computed(() => {
  if (!responseStats.value || responseByExpert.value.length == 0) return []
  const out = []
  const header = ['Name', 'ExpertId', 'Response', 'Comment']
  out.push(header)
  responseByExpert.value.forEach((res) => out.push([res.name, res.expertId, JSON.stringify(res.value), res.comment]))
  return out
})

const statsTableData = computed(() => {

  if (!responseStats.value) return []

  const dynamicHeaders = new Set()
  const out = []

  responseByExpert.value.forEach((res) => {
    if (res.value) {
      Object.keys(res.value).forEach((key) => dynamicHeaders.add(key))
    }
  })

  out.push(['Name', 'Comment', ...Array.from(dynamicHeaders)])

  responseByExpert.value.forEach((res) => {
    const row = []

    row.push(res.name)
    row.push(res.comment || '')

    Array.from(dynamicHeaders).forEach((key) => {
      row.push(res.value[key] || '') 
    })

    out.push(row)
  })
  
  return out


})

</script>

<style scoped></style>
