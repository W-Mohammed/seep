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
      <ResultsTable :statsTableData="statsTableData" :validResponses="responseByExpert?.length ?? 0" />
    </div>
  </div>
  <ResultsNoResults v-else />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { expertToLineStyleMapper } from '@/lib/utils'
import ResultsTable from '@/components/admin/ResultsTable.vue'
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
import { use } from 'echarts'
import { BarChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import ResultsNoResults from './ResultsNoResults.vue'
use([BarChart])
import { NumberAgendaItem } from '@/models/AgendaClass'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
const selectedQuestion = defineModel({ type: String, default: null })
import ResultsComments from '@/components/admin/ResultsComments.vue';

const adminStore = useAdminStore()
const {
  currentActiveExperts,
  currentSurveyId,
  tenantId,
  expertColorMap,
  loading
} = storeToRefs(adminStore)

const responseByExpert = computed(() => NumberAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value))

const chartRef = ref(null)





const options = computed(() => {
  const respByExpSorted = responseByExpert?.value?.sort((a, b) => b.value - a.value)
  
  return {
    color: '#FF5A46',
    yAxis: {
      type: 'category',
      data: respByExpSorted.map((val) => val.name),
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          // thousands separator
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      }
    },
    series: [
      {
        data: respByExpSorted.map((resp, i) => {
          let col = expertColorMap.value[resp.expertId]
          return {
          value: resp.value,
            itemStyle: {
            color:  col?.color ?? '#FF5A46'
            }
          }
        }),
        type: 'bar',
        barWidth: '75%',
      }
    ],
    grid: {
      left: '0%',
      right: '5%',
      bottom: '4%',
      top: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        return `${params[0].name}: ${params[0].value}`
      }
    }
  };
});


const statsTableDataForDownload = computed(() => {
  const out = [['name', 'expertId', 'response','comment']]
  out.push(['Average', '', responseByExpert.value.reduce((agg, cur) => agg + Number(cur.value), 0) / responseByExpert.value.length, 'This is the average response'])
  responseByExpert.value.forEach((res) => out.push([res.name, res.expertId, res.value, res.comment]))
  return out
})

const statsTableData = computed(() => {
  return statsTableDataForDownload.value.map((y) => y.slice(0, 1).concat(y.slice(2)))
  
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>