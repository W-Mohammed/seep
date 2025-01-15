<template>
  <div>
    <div v-if="loadingState || anyExpertWithData">
      <div class="w-full flex flex-col">
        <div
          class="pt-1 px-4 text-gray-700 rounded-t-lg text-sm text-gray-800 text-xs"
        >
          Filter view:
        </div>
        <div
          class="flex pb-2 px-4 w-full text-gray-700 me-auto rounded-b-lg rounded-r-lg"
        >
          <div class="flex gap-2 items-center me-4 md:me-6 lg:me-8">
            <SimpleSwitch v-model="togglePooled" label="Show pooled" />
          </div>

          <SelectIndividualExpert
            :currentExperts="currentExpertsWithData"
            :expertColors="expertColorMap"
            v-model="selectedIndividualExpert"
          />

          <ButtonDownloadResults
            :statsTableData="statsTableDataForDownload"
            :chart="chartRef"
            :model="selectedModel"
            :questionId="selectedQuestion"
            :tenantId="tenantId"
            :surveyId="currentSurveyId"
          />
        </div>
      </div>

      <!-- main panel -->
      <div
        style="height: 600px; max-height: 50vh; min-height: 200px; width: 100%"
        class="relative flex flex-col px-2 mt-4"
      >
        <OverlaySpinner :loadingState="loadingState" />
        <div class="flex items-center" >
          <SelectModel v-model="showCharts" />
          <SelectDistribution v-model="selectedModel" :viewFitted="viewFitted" />
        </div>
        <div v-if="!loadingState" class="grow min-w-[400px] ps-2 pe-4">
          <ResultsChart
            :resultsArr="chartSeriesData"
            v-model:chart="chartRef"
            :xAxisLabel="xAxisLabel"
          />
        </div>
      </div>

      <!-- comments -->
      <ResultsComments :current-active-experts="currentActiveExperts" :selected-question="selectedQuestion" />
      
      <!-- stats table -->
      <ResultsTable v-if="!loadingState" :statsTableData="statsTableData" :validResponses="validResponses" />
    
    </div>
    <ResultsNoResults v-else />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { expertToLineStyleMapper } from '@/lib/utils'
import { fetchAnalytics } from '@/lib/fetchAnalyticsHelper'
import ResultsTable from '@/components/admin/ResultsTable.vue'
import ResultsChart from '@/components/admin/ResultsChart.vue'
import SelectModel from '@/components/admin/SelectModel.vue'
import SelectDistribution from '@/components/admin/SelectDist.vue'
import ResultsComments from '@/components/admin/ResultsComments.vue';
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
import SimpleSwitch from '@/components/admin/SimpleSwitch.vue'
import ResultsNoResults from './ResultsNoResults.vue'
import SelectIndividualExpert from '@/components/admin/SelectIndividualExpert.vue'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue'
const props = defineProps({
  expertId: String,
  refreshTrigger: Boolean
})

const selectedQuestion = defineModel({ type: String, default: null })

const adminStore = useAdminStore()
const {
  currentSurveyQuestions,
  currentActiveExperts,
  currentSurveyId,
  tenantId,
  cachedData,
  isLoggedIn,
  anonymiseExperts,
  selectedIndividualExpert,
  expertColorMap,
  togglePooled
} = storeToRefs(adminStore)

const currentExpertsWithData = computed(() => {
  if (!currentActiveExperts.value) return []
  if (!selectedQuestion.value) return []

  // disable experts without data or without model fit or for whom question is supposed to be ignored and show note
  let expertsWithData = currentActiveExperts.value.map((expert) => {
    if (!currentResult.value) return { ...expert, disabled: true }
    let expertsWithAnalytics = Object.keys(currentResult.value)
    let hasQuestionData = expert?.responses?.find(
      (question) => question.questionId === selectedQuestion.value
    )
    let hasChipsAllocated = hasQuestionData?.value?.chips?.reduce((acc, chip) => acc + chip, 0) > 0

    if (expert.ignoreQuestions?.includes(selectedQuestion.value)) {
      return { ...expert, isIgnored: true }
    } else if (!hasQuestionData || !hasChipsAllocated) {
      // selectedIndividualExpert.value[expert._id] = false
      return { ...expert, noData: true }
    } else if (!expertsWithAnalytics.includes(expert._id)) {
      // selectedIndividualExpert.value[expert._id] = false
      return { ...expert, noData: true }
    } else {
      return expert
    }
  })
  expertsWithData.sort((a, b) => a.disabled - b.disabled)
  return expertsWithData
})


const anyExpertWithData = computed(() => {
  let someData = false
  currentExpertsWithData.value.forEach((expert) => {
    if (!expert.disabled && !expert.noData && !expert.isIgnored) {
      someData = true
    }
  })
  return someData
})


const selectedExpert = ref([])

if (!Object.keys(selectedIndividualExpert.value).length) {
  if (props.expertId === 'pooled') {
    selectedExpert.value.push('linearPool')
    togglePooled.value = true
    selectedIndividualExpert.value = {}
  } else if (props.expertId) {
    selectedExpert.value.push(props.expertId)
    selectedIndividualExpert.value[props.expertId] = true
    togglePooled.value = false
  } else {
    selectedExpert.value.push('linearPool')
    selectedIndividualExpert.value = {}
    togglePooled.value = true
  }
} else {
  selectedExpert.value = Object.entries(selectedIndividualExpert.value).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc.push(key)
      }
      return acc
    },
    []
  )
}

watch(
  [togglePooled, selectedIndividualExpert],
  ([pooled, indviduals]) => {
    const selectedExpertsArr = Object.entries(indviduals).reduce((acc, [key, value]) => {
      if (value) {
        acc.push(key)
      }
      return acc
    }, [])

    selectedExpert.value = [
      ...(selectedExpertsArr.length ? selectedExpertsArr : []),
      ...(pooled ? ['linearPool'] : [])
    ]
  },
  { deep: true }
)

const loadingState = ref(false)
const chartRef = ref(null)
// toggle fitted/histogram/both view
const showCharts = ref('fitted')
const viewFitted = computed(() => showCharts.value === 'fitted' || showCharts.value === 'both')
const viewHistogram = computed(
  () => showCharts.value === 'histogram' || showCharts.value === 'both'
)

// select distribution
const selectedModel = ref('best')

// store results
const currentResult = ref(null)
const currentResultFiltered = computed(() => {
  if (!currentResult.value) return null
  let filtered = {}
  Object.keys(currentResult.value).forEach((key) => {
    if (selectedExpert.value.includes(key)) {
      filtered[key] = currentResult.value[key]
      let name = currentActiveExperts.value.find((expert) => expert._id === key)?.name
      filtered[key].expertName = name || key
    }
  })
  return filtered
})

const currentResultsStats = computed(() => {
  if (!currentResult.value || Object.keys(currentResult.value).length === 0)
    return []

  let stats = []
  Object.keys(currentResult.value).forEach((key) => {
    let data = currentResult.value[key]
    stats.push({
      expertId: data.expertId || key,
      name: data?.expertName,
      rationale: data?.rationale || '',
      comment: data?.comment || '',
      fitBest: data?.fitBest,
      fitUsed: data?.fitUsed
    })

    if (data?.modelCoefs && Object.keys(data.modelCoefs).length) {
      let modelCoefKeys = Object.keys(data.modelCoefs)
      let coefs = modelCoefKeys.map((key) => {
        return {
          param: key,
          value: data?.modelCoefs[key]
        }
      })
      let maxCoefs = 3
      if (coefs.length < maxCoefs) {
        for (let i = coefs.length; i < maxCoefs; i++) {
          coefs.push({ param: null, value: null })
        }
      }

      coefs.forEach((coef, i) => {
        stats[stats.length - 1]['fitParam' + (i + 1)] = coef.param
        stats[stats.length - 1]['value' + (i + 1)] = coef.value
      })
    }

    const quantiles = data?.quantiles
    if (quantiles?.quantile.length) {
      quantiles.quantile.forEach((q, i) => {
        if (!data?.quantiles?.value || !data?.quantiles?.value[i]) return
        let val_ = data?.quantiles?.value[i] || null
        if (val_ === 'NA') val_ = null
        if (!val_) return
        val_ = val_ > 1 ? val_.toFixed(2) : val_.toFixed(4)
        stats[stats.length - 1]['q' + q * 100] = val_
      })
    }

    if (data?.rawResponseData?.binNumber?.length) {
      data?.rawResponseData?.binNumber.forEach((bin, i) => {
        stats[stats.length - 1]['bin' + (i + 1)] = data?.rawResponseData?.binEdges[i]
        stats[stats.length - 1]['chips' + (i + 1)] = data?.rawResponseData?.chips[i]
        stats[stats.length - 1]['prob' + (i + 1)] = data?.rawResponseData?.probs[i]
      })
    }
  })
  return stats
})

// fetch data on page (re)load or input change
const fetchAnalyticsWrapper = async () => {
  await fetchAnalytics(
    tenantId,
    currentSurveyId,
    selectedQuestion,
    // selectedExpert,
    selectedModel,
    currentResult,
    loadingState,
    cachedData,
    anonymiseExperts
  )
}

watch(
  selectedQuestion,
  (newVal, oldVal) => {
    if (!newVal && !oldVal) {
      selectedQuestion.value = currentSurveyQuestions?.value
        ? currentSurveyQuestions.value[0]?._id
        : null
    }
    if (!oldVal && newVal) {
      fetchAnalyticsWrapper()
    }
  },
  { immediate: true }
)

function clearCacheAndUpdate() {
  cachedData.value = {}
  fetchAnalyticsWrapper()
}

watch(
  () => props.refreshTrigger,
  () => {
    clearCacheAndUpdate()
  },
  { immediate: false }
)

watch(
  [selectedQuestion, selectedModel],
  () => {
    fetchAnalyticsWrapper()
  },
  { immediate: false }
)


const chartSeriesData = computed(() => {
  if (!currentResultFiltered.value) return []
  let results = []
  Object.keys(currentResultFiltered.value).map((key) => {
    let lineStyle
    if (selectedExpert.value.includes('linearPool')) {
      lineStyle = {
        color: expertColorMap?.value[key]?.color,
        width: key === 'linearPool' ? 4 : 1,
        type: key === 'linearPool' ? 'solid' : 'dashed'
      }
    } else {
      lineStyle = {
        color: expertColorMap?.value[key]?.color,
        width: 3,
        type: 'solid'
      }
    }

    let data = currentResultFiltered?.value[key]
    if (!data) return

    if (viewFitted.value) {
      results.push({
        name: data?.expertName || key,
        expertId: data.expertId,
        label: {
          show: true,
          position: 'bottom',
          textStyle: {
            fontSize: 20
          }
        },
        showSymbol: false,
        lineStyle,
        step: false,
        data: data?.fit?.y?.map((y, i) => {
          return [data?.fit?.x[i], y]
        })
      })
    }
    if (viewHistogram.value) {
      results.push({
        expertId: data.expertId,
        name: data?.expertName || key,
        label: {
          show: true,
          position: 'bottom',
          textStyle: {
            fontSize: 20
          }
        },
        showSymbol: false,
        lineStyle: { ...lineStyle, width: viewFitted.value ? 1 : 3 },
        step: 'end',
        areaStyle: {
          color: expertColorMap?.value[key]?.color,
          opacity: 0.1
        },
        data: data?.hist?.y?.map((y, i) => {
          return [data?.hist?.x[i], y]
        })
      })
    }
  })

  return results
})

const statsTableDataForDownload = computed(() => {
  if (!currentResultsStats.value || currentResultsStats.value.length == 0) return []

  let uniqueHeader = new Set()
  currentResultsStats.value.forEach((stat) => {
    Object.keys(stat).forEach((key) => {
      uniqueHeader.add(key)
    })
  })
  let header = Array.from(uniqueHeader)
  // make sure name is the first column
  header = header.filter((key) => key !== 'name')
  header.unshift('name')
  let table = []
  currentResultsStats.value.forEach((stat) => {
    let row = []
    header.forEach((key) => {
      let _v = stat[key]
      row.push(stat[key])
    })
    table.push(row)
  })

  // 'linearPool' should be the first row
  const linearPoolIndex = table.findIndex((row) => row[0] === 'linearPool')
  if (linearPoolIndex !== -1) {
    const linearPoolRow = table[linearPoolIndex]
    table.splice(linearPoolIndex, 1)
    table.unshift(linearPoolRow)
  }

  table.unshift(header)

  // if togglePooled is expert, transpose the table
  if (props.togglePooled) {
    table = table[0].map((_, colIndex) => table.map((row) => row[colIndex]))
  }
  return table
})

const statsTableData = computed(() => {
  
  return statsTableDataForDownload.value.map((row) => {  
    // remove index 1
      return row.filter((_, index) => index !== 1)
  })
})

const validResponses = computed(() => {
  if (!currentResultsStats.value) return 0
  if (currentResultsStats.value.length === 0) return 0
  return currentResultsStats.value.filter((row) => row.expertId !== 'linearPool').length
})

const xAxisLabel = computed(() => {
  if (
    !selectedQuestion?.value ||
    !currentSurveyQuestions?.value ||
    chartSeriesData.value.length === 0
  )
    return null
  return currentSurveyQuestions?.value?.find((q) => q._id === selectedQuestion?.value).content
    ?.xLabel
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
