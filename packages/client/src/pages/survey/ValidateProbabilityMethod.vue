<template>
  <div class="container mt-10 flex flex-col items-center justify-center max-w-[90ch]">
    <QuestionBlock
      :content="content"
    />
    <div class="w-full border rounded-lg mt-8">
      <div class="text-xl w-full px-4">
      </div>
      <div
        style="height: 450px; max-height: 50vh; min-height: 200px; width: 100%"
        class="relative flex flex-col my-4"
      >
        <v-chart
          ref="chart"
          class="chart"
          :option="chartOption"
          style="height: 100%; width: 100%"
          autoresize
        ></v-chart>
      </div>

    </div>

    <div
      class="bg-priorb-50 rounded-lg my-8 flex py-4 px-4 w-full items-center"
      v-if="!errorInputsIncomplete"
    >
      <div class="font-semibold">

<span v-if="content?.questionsToValidate?.length > 1">
        Do the estimates in the graph above accurately reflect your understanding of the uncertainty?
</span>
<span v-else>
        Does the estimate in the graph above accurately reflect your understanding of the uncertainty?
</span>
      
      
      
      </div>

      <div class="ps-4 ms-auto flex">
        <button class="py-2 px-6 mx-2 rounded-lg bg-white text-priorb-500 border border-priorb-500 rounded-lg hover:bg-white/80 hover:text-priorb-500/80" @click="goBackAndRefine()">Refine</button>
        <button class="py-2 px-6 mx-2 rounded-lg bg-priorb-500 text-white  hover:bg-priorb-500/80 
        " @click="goNext">Confirm</button>
      </div>
    </div>
    <div v-else
      class="p-4 text-red-700 rounded-md mt-8 mb-4 font-semibold bg-priorb-errorLight"
    >
    Some answers are missing. Please complete the previous {{ content?.questionsToValidate?.length }} questions before validating your estimates.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { viridis } from '@/lib/colors'
import { use } from 'echarts/core'
import { sharedPropsJs, interpolateForProbabilityMethod } from '@/lib/utils';
import { CandlestickChart, LineChart } from 'echarts/charts'
import {
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import { ValidationAgendaItem } from '@/models/AgendaClass';

const props = defineProps(sharedPropsJs);
const expertStore = useExpertStore()
const { currentPageValue } = storeToRefs(expertStore)
ValidationAgendaItem.initialiseResponse(currentPageValue, props)

const defaultTitle = 'We have taken your estimates and visualised them along with existing data from a clinical trial.'
if (!props.content) props.content = {}
if (!props.content.title) props.content.title = defaultTitle

const trialSeriesMaker = (name, data) => {
  if(!data) return []
  // scale proportion to 100 if needed
  if (data[0][1] < 10) {
    data = data.map((d) => [d[0], d[1] * 100])
  }

  return {
    name,
    type: 'line',
    step: 'start',
    showSymbol: false,
    silent: true,
    data,
    lineStyle: {
      color: 'black',
      width: 4
    },
    symbol: 'none',
    itemStyle: {
      color: 'transparent'
    }
  }
}

const xValues = props.content.timePoints
const seriesNames = props.content.seriesNames
const trialSeries = trialSeriesMaker(props.content.trialName, props.content.trialData)

expertStore.hideNavBtns = true
const errorInputsIncomplete = ref(false)
let responsesToValidate = props?.content?.questionsToValidate?.map((q) =>
  expertStore.getResponseByPageId(q)
)

let someError = false

if (responsesToValidate?.length !== props.content.questionsToValidate?.length) {
  someError = true
} else if (
  responsesToValidate?.some((response) => {

    if (!response) return true

    if(response.ySelected?.length > 0 && response.ySelected?.length > 0) {
      return false
    }
    return false
  })
) {
  someError = true
}

if (someError) {
  errorInputsIncomplete.value = true
  expertStore.hideNavBtns = false
}

let estimateData = []
try {
    responsesToValidate = responsesToValidate?.filter((response) => response !== null)
    if (!responsesToValidate) {
      //TODO: Responses-to-validate are null. Handle this case.
      errorInputsIncomplete.value = true
      expertStore.hideNavBtns = false
    } else {
      estimateData = responsesToValidate?.map((response, index) => {
      if (!response) return
      const name = seriesNames[index]
        // const correspondingYValues = interpolateForProbabilityMethod(response, [25, 50, 75])

        // turn into function
        const findClosestIndexForPercentile = (percentile, y) => {
          let closestIndex = null
          let closestValue = Infinity
          y.forEach((value, index) => {
            if (Math.abs(value - percentile) < closestValue) {
              closestValue = Math.abs(value - percentile)
              closestIndex = index
            }
          })
          return closestIndex
        }
        
        const xMin = response.xSelected[0]
        const xMax = response.xSelected[response.xSelected.length - 1]

        const qIndices = [0.25, 0.50, 0.75].map((percentile) => findClosestIndexForPercentile(percentile, response.ySelected))
        if(qIndices.some((q) => q === null)) {
          errorInputsIncomplete.value = true
          expertStore.hideNavBtns = false
        }
        const x = xValues[index]
        const y = [response.xSelected[qIndices[0]], response.xSelected[qIndices[2]], xMin, xMax]
        let out = { name, data: [x, ...y], mid: response.xSelected[qIndices[1]] }
      return out
      })
    }
} catch (e) {
  console.log(e)
  errorInputsIncomplete.value = true
  expertStore.hideNavBtns = false
}

const goNext = () => {
  currentPageValue.value.response.confirmCount++
  expertStore.goToNextPage()
}

const goBackAndRefine = () => {
  currentPageValue.value.response.refineCount++
  let firstQuestion = props.content.questionsToValidate[0]
  expertStore.goToPageByPageId(firstQuestion)
}

use([
  CanvasRenderer,
  CandlestickChart,
  LineChart,
  LegendComponent,
  GridComponent,
])

const COLS = viridis(5)

const predictionSeriesMaker = (name, data, mid, index = 0) => {
  if (!data) return []


  let xUnit = 1
  try {
    xUnit = xValues.reduce((a, b) => Math.max(a, b), 0) / 50
    if(!xUnit) xUnit = 1
  } catch (e) {
    console.log(e)
  }

  return [
    {
      name,
      type: 'candlestick',
      data: [data],
      barWidth: '5%',
      silent: true,
      itemStyle: {
        color: COLS[index],
        borderColor: COLS[index],
        borderWidth: 5
      },
      animationDuration: 200,
      animationDelay: (idx) => idx * 10000
    },
    {
      name,
      type: 'line',
      lineStyle: {
        color: COLS[index],
        width: 4
      },
      symbol: 'none',
      itemStyle: {
        color: 'transparent'
      },
      data: [
        [data[0] - xUnit, data[3]],
        [data[0] + xUnit, data[3]]
      ],
      barWidth: '5%',
      silent: true,
      animationDuration: 200,
      animationDelay: 100
    },
    {
      name,
      type: 'line',
      lineStyle: {
        color: COLS[index],
        width: 4
      },
      symbol: 'none',
      itemStyle: {
        color: 'transparent'
      },
      data: [
        [data[0] - xUnit, data[4]],
        [data[0] + xUnit, data[4]]
      ],
      barWidth: '5%',
      silent: true,
      animationDuration: 200,
      animationDelay: 100
    },
    {
      name: `${name} Midpoint`,
      type: 'line',
      lineStyle: {
        color: 'red', 
        width: 2,
        type: 'dotted'
      },
      symbol: 'diamond',
      symbolSize: 15,
      itemStyle: {
        color: 'red'
      },
      data: [
        [data[0], mid], 
      ],
      silent: true,
      animationDuration: 200,
      animationDelay: 100
    }
  ]
}

const predictionSeries = estimateData
  ?.map((prediction, index) => {
    if (!prediction) return
    return predictionSeriesMaker(prediction.name, prediction.data, prediction.mid, index)
  })
  .flat()

const chartOption = computed(() => {
  return {
    legend: {
      show: true,
      data: [props.content.trialName, ...seriesNames],
      selectedMode: false,
      showSymbol: false,
      textStyle: {
        fontSize: 18
      },
      top: 6,
      left: 'center',

    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '7%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      min: 0,
      boundaryGap: [0, 0.01],
      name: props.content.timeUnits ?? 'Months',
      nameLocation: 'center',
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      nameGap: 24
    },
    yAxis: {
      type: 'value',
      max: 100,
      min: 0,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [trialSeries, ...(predictionSeries?.length ? predictionSeries : [])]
  }
})

onBeforeUnmount(() => {
  expertStore.hideNavBtns = false
})
</script>

<style scoped>
</style>
