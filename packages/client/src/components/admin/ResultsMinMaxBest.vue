<template>
  <div v-if="responseByExpert?.length">
    <div class="roulette-results">
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


      <ResultsComments :current-active-experts="currentActiveExperts" :selected-question="selectedQuestion" />

      <!-- stats table -->
      <OverlaySpinner :loadingState="loading" />
      <ResultsTable
        :statsTableData="statsTableData"
        :validResponses="responseByExpert.length ?? 0"
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
import { use } from 'echarts'
import { LineChart } from 'echarts/charts'
import VChart from 'vue-echarts'
use([LineChart])
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
import ResultsNoResults from './ResultsNoResults.vue'
import { MinMaxBestAgendaItem } from '@/models/AgendaClass'
import {drawErrorBardsForMinMaxBest} from '@/lib/utils'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
import ResultsComments from '@/components/admin/ResultsComments.vue';
const selectedQuestion = defineModel({ type: String, default: null })

const adminStore = useAdminStore()
const { currentActiveExperts, currentSurveyId, tenantId, expertColorMap, loading } = storeToRefs(adminStore)

const chartRef = ref(null)

const responseByExpert = computed(() =>
    MinMaxBestAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value)
)

const averages = computed(() => {
  const mins = responseByExpert.value.map((res) => res.value.min)
  const averageMin =
    responseByExpert.value.map((res) => res.value.min).reduce((a, b) => a + b, 0) / mins.length
  const maxs = responseByExpert.value.map((res) => res.value.max)
  const averageMax = maxs.reduce((a, b) => a + b, 0) / maxs.length
  const bestEstimates = responseByExpert.value.map((res) => res.value.bestEstimate ?? res.value.bestGuess)
  const averageBestEstimate = bestEstimates.reduce((a, b) => a + b, 0) / bestEstimates.length
  return { 
      min: averageMin, 
      max: averageMax, 
      best: averageBestEstimate, 
      rationale: 'Arithmetic mean of expert estimates'
  }
})

const options = computed(() => {
  const series = []
  responseByExpert.value.forEach((res, j) => {
    let i = j +1 
    const col = expertColorMap.value[res.expertId].color
    series.push({
      type: 'line',
      name: res.name,
      color: col,
      data: [
        [res.value.min, i],
        [res.value.max, i]
      ],
      symbol: 'none'
    })
    series.push({
      type: 'custom',
      name: 'error',
      itemStyle: {
        borderWidth: 1.5,
      },
      renderItem: drawErrorBardsForMinMaxBest(i,res, col),
      encode: {
        x: 0,
        y: [1, 2]
      },
      data: [
        [res.value.min, i, i],
        [res.value.max, i, i]
      ],
      z: 100,
      silent: true,
      animationDuration: 200,
      animationDelay: 100
    })
    series.push({
      type: 'scatter',
      name: res.name,
      color: expertColorMap.value[res.expertId].color,
      data: [[res.value.bestEstimate ?? res.value.bestGuess, i]],
    })
  })

  // push average as new line

  series.push({
    type: 'line',
    name: 'Average',
    symbol: 'none',
    data: [
      [averages.value?.min, 0],
      [averages.value?.max, 0]
    ],
    lineStyle: {
      color: 'rgba(0, 0, 0, 1)',
      type: 'solid',
      width: 3
    },
  })
  series.push({
    type: 'custom',
    name: 'error',
    itemStyle: {
      borderWidth: 1.5,
    },
    renderItem: drawErrorBardsForMinMaxBest(0,averages, 'rgba(0, 0, 0, 0.75)'),
    encode: {
      x: 0,
      y: [1, 2]
    },
    data: [
      [averages.value?.min, 0, 0],
      [averages.value?.max, 0, 0]
    ],
    z: 100,
    silent: true,
    animationDuration: 200,
    animationDelay: 100
  })
  series.push({
    type: 'scatter',
    name: 'Average',
    data: [[averages.value?.best, 0]],
    symbol: 'diamond',
    symbolSize: 20,
    itemStyle: {
      color: 'rgb(0, 0, 0)'
    },
    z: 1000
  })

  const expertNames = responseByExpert.value.map((res) => res.name)
  return {
    yAxis: {
      type: 'category',
      data: ['Average', ...expertNames],
      axisLabel: {
        show: true,
        color: 'rgba(0, 0, 0, 0.9)',
        fontSize: 12,
        fontWeight: 600
      },
    },
    xAxis: {
      type: 'value',
    },
    animation: true,
    animationDuration: 350,
    series: [
      ...series,
    ],

    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        // show best [min-max] for each expert
        let min = params[0].value[0]
        let max = params[3].value[0]
        let best = params[4].value[0]
        if(max - min < 10) {
          return `${best.toFixed(2)} [${min.toFixed(2)} - ${max.toFixed(2)}]`
        } 
        return `${best.toFixed(0)} [${min.toFixed(0)} - ${max.toFixed(0)}]`
        
      }
    },
    grid: {
      left: 2,
      bottom: 2,
      right: 10,
      top: 20,
      containLabel: true
    }
  }
})


const statsTableDataForDownload = computed(() => {
  const out = [['name', 'expertId', 'rationale', 'min', 'best-estimate', 'max','comment']]
  // add average row
  let min = averages.value?.min
  let max = averages.value?.max
  let best = averages.value?.best
  let rationale = averages.value?.rationale
  if(max - min < 10) {
    out.push(['Average', 'Average', 
    rationale,    
    min.toFixed(2),
    best.toFixed(2),
    max.toFixed(2),
    ])
  } else {
    out.push(['Average', 'Average',
      rationale,
      min.toFixed(0),
      best.toFixed(0),
      max.toFixed(0),
    ])
  }
  responseByExpert.value.forEach((res) =>
    out.push([res.name, res.expertId, res.value?.rationale, res.value?.min, res.value?.bestEstimate ?? res.value?.bestGuess, res.value?.max, res.value?.comment]) 
  )
  return out
})

const statsTableData = computed(() => {
  return statsTableDataForDownload.value.map((y) => y.slice(0, 1).concat(y.slice(2)))
})
</script>

<style scoped></style>
