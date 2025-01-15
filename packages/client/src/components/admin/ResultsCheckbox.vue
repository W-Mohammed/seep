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
    <div
      style="height: 400px; max-height: 50vh; min-height: 200px; width: 100%"
      class="relative flex flex-col px-2"
    >
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
    <ResultsTable :statsTableData="statsTableData" :validResponses="responseByExpert.length ?? 0" />
  </div>
  <ResultsNoResults v-else />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import ResultsTable from '@/components/admin/ResultsTable.vue'
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
import VChart from 'vue-echarts'
import ResultsNoResults from './ResultsNoResults.vue'
import { viridis } from '@/lib/colors'
import { countByCategory } from '@/lib/formKitUtils'
import { CheckboxAgendaItem } from '@/models/AgendaClass'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
import ResultsComments from '@/components/admin/ResultsComments.vue';
const selectedQuestion = defineModel({ type: String, default: null })
const adminStore = useAdminStore()
const { currentSurveyQuestions, currentActiveExperts, currentSurveyId, tenantId, loading } =
  storeToRefs(adminStore)

const chartRef = ref(null)

const responseByExpert = computed(() =>
  CheckboxAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value)
)

const responseStats = computed(() => countByCategory(responseByExpert.value))


const options = computed(() => {
  const data = responseStats.value
  if (!data) return {}

  let allCategories = Object.keys(data);

  let standardCategories = [];
  if (currentSurveyQuestions?.value && selectedQuestion?.value) {
    standardCategories = currentSurveyQuestions?.value
      .filter((q) => q._id === selectedQuestion.value)[0]
      ?.content.options.map((opt) => opt.label)
      .reverse();
  }
  
   const nonStandardCategories = allCategories.filter(cat => !standardCategories.includes(cat));

  const categories = [...nonStandardCategories, ...standardCategories];

  const values = categories.map(cat => data[cat] || 0);

  const cols = viridis(categories.length)

  const series = {
    data: values.map((val, idx) => {
      return {
        value: val,
        itemStyle: {
          color: cols[idx]
        }
      }
    }),
    type: 'bar'
  }

  return {
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        formatter: function (value) {
          return value
        }
      }
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        formatter: function (value) {
          return Number.isInteger(value) ? value : ''
        }
      }
    },
    series: series,
    grid: {
      left: '0%',
      right: '5%',
      bottom: '4%',
      top: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return `${params[0].name}: ${params[0].value} (${((params[0].value / responseByExpert.value.length) * 100).toFixed(0)}%)`
      }
    }
  }
})

const statsTableDataForDownload = computed(() => {
  const out = [['name', 'expertId', 'response','comment']]
  responseByExpert.value.forEach((res) =>
    out.push([res.name, res.expertId, res.value && res.value.selected ? res.value.selected.join(', ') : '', res.comment])
  )
  return out
})

const statsTableData = computed(() => {
  const out = [['name', 'response','comment']]
  responseByExpert.value.forEach((res) => out.push([res.name, res.value ? res.value.join(', ') : '', res.comment]))
  return out
})


</script>

<style scoped></style>
