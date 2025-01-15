<template>
  <div v-if="responseByExpert?.length">
    <div class="w-full flex flex-col">
      <div
        class="flex pt-5 px-4 NOT-bg-vGray-100 w-full text-priorb-SECONDARY me-auto rounded-b-lg rounded-r-lg"
      >
        <ButtonDownloadResults
          :statsTableData="statsTableDataForDownload"
          :chart="chartRef"
          :questionId="selectedQuestion"
          :tenantId="tenantId"
          :surveyId="currentSurveyId"
          :showPsa="false"
        />
      </div>
    </div>

    <!-- main panel -->
    <div class="relative flex flex-col px-2 h-[400px] max-h-[50vh] min-h-[200px] w-full">
      <OverlaySpinner :loadingState="loading" />
      <div class="grow min-w-[400px] ps-2 pe-4">
        <v-chart
          ref="chartRef"
          :option="options"
          style="height: 100%; width: 100%"
          autoresize
        ></v-chart>
      </div>
    </div>

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
import VChart from 'vue-echarts'
import ResultsNoResults from './ResultsNoResults.vue'
import { viridis } from '@/lib/colors'
import { countByCategory } from '@/lib/formKitUtils'
import { RadioLikertAgendaItem } from '@/models/AgendaClass'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
import ResultsComments from '@/components/admin/ResultsComments.vue';

const selectedQuestion = defineModel({ type: String, default: null })
const adminStore = useAdminStore()
const { currentActiveExperts, currentSurveyId, tenantId, currentSurveyQuestions, loading } =
  storeToRefs(adminStore)

const chartRef = ref(null)

const responseByExpert = computed(() =>
  RadioLikertAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value)
)
const responseStats = computed(() => countByCategory(responseByExpert.value.map((res) => ({ value: res.value }))))

const optionTitles = computed(() => {
  const options = currentSurveyQuestions.value.filter(
    (q) => q._id === selectedQuestion.value
  )[0].content.options.map((opt) => opt.title);
  options.push('No Response')
  return options
})

const options = computed(() => {
  if (!responseStats.value) return {}
  let categories = Object.keys(responseStats.value)
  const colours = viridis(categories.length + 1)

  return {
    color: colours,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: optionTitles.value, 
      axisLabel: {
        rotate: 0, 
        fontSize: 14,
      },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#ccc' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: 'Responses',
        type: 'bar',
        barWidth: '60%',
        data: optionTitles.value.map((title) => ({
          value: responseStats.value[title] || 0,
          name: title
        })),
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        }
      }
    ]
  }
})



const statsTableDataForDownload = computed(() => {
  if (!responseStats.value || responseByExpert.value.length == 0) return []
  const out = []
  const header = ['Name', 'ExpertId', 'Response', 'Comment']
  out.push(header)
  responseByExpert.value.forEach((res) => out.push([res.name, res.expertId, res.value, res.comment]))
  return out
})

const statsTableData = computed(() => {
  if (!responseStats.value) return []
  const out = [['name', 'response','comment']]
  responseByExpert.value.forEach((res) => out.push([res.name, res.value, res.comment]))
  return out
})

</script>

<style scoped></style>
