<template>
  <div class="container mt-10 flex flex-col items-center justify-center max-w-[90ch]">
    <div class="justify-start w-full">
      <div class="text-gray-700 text-xl py-1">
        <div class="flex items-center text-2xl">
          <Icon icon="bx:bx-help-circle" class="text-gray-900 me-1" />
          Validation
        </div>
      </div>
      <div class="border-l-4 ps-2 py-2">
        <div>
          {{ content?.title ?? defaultTitle }}
        </div>
      </div>
    </div>

    <div
      v-if="errorInputsIncomplete"
      class="p-4 text-red-700 rounded-md mt-10 font-semibold"
    >
      Please first complete the previous
      {{ content?.questionsToValidate?.length }}
      questions to validate your estimates.
    </div>

    <div v-else class="w-full border rounded-lg mt-8">
      <div class="text-xl w-full mt-10 mb-6 px-4">
        Does it accurately reflect your understanding of the uncertainty?
      </div>
      <div
        style="height: 450px; max-height: 50vh; min-height: 200px; width: 100%"
        class="relative flex flex-col"
      >
        <v-chart
          ref="chart"
          class="chart"
          :option="chartOption"
          style="height: 100%; width: 100%"
          autoresize
        ></v-chart>
      </div>

      <div class="border-t w-full px-6 py-4">
        <div>
          <table class="table-auto w-full gap-2 leading-tight">
            <tr>
              <td class="py-2">
                <div class="h-8 w-16 bg-gray-100 rounded flex flex-col">
                  <div class="border-t-4 border-black my-auto mx-3"></div>
                </div>
              </td>
              <td class="px-4">Represents observed trial data.</td>
            </tr>
            <tr>
              <td class="py-2">
                <div
                  class="h-8 w-16 rounded flex flex-col"
                  :style="{ backgroundColor: REDS[0] }"
                ></div>
              </td>
              <td class="px-4">
                The shaded box(es) represent your estimates. The longer the box, the greater the
                uncertainty about the value.
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div
      class="bg-priorb-50 rounded-lg my-8 flex py-4 px-4 w-full items-center"
      v-if="!errorInputsIncomplete"
    >
      <div class="font-semibold">Does this visualisation accurately capture your estimates?</div>

      <div class="ps-4 ms-auto">
        <button class="btn btn-refine" @click="goBackAndRefine()">Refine</button>
        <button class="btn btn-confirm" @click="goNext">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { rocket } from '@/lib/colors'
import { use } from 'echarts/core'
import { LineChart, CandlestickChart } from 'echarts/charts'
import {
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent
} from 'echarts/components'
import { useExpertStore } from '@/store/expertStore'
import { splitChipsForBoxPlot, splitChipsForConditionalBoxplots } from '@/lib/rouletteUtils'

const props = defineProps({
  content: {}
})
const expertStore = useExpertStore()

const defaultTitle = 'We have taken your estimates and visualised them along with existing data from a clinical trial.'

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

// to be included in agendaItems
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
  console.log('No chips or some other data missing (1)')
  someError = true
} else if (
  responsesToValidate?.some((response) => {
    if (!response) return true
    if (response?.chips?.length === 0) return true
    if (response?.chips?.reduce((a, b) => a + b, 0) === 0) return true
    return false
  })
) {
  console.log('No chips or some other data missing (1)')
  someError = true
}

if (someError) {
  errorInputsIncomplete.value = true
  expertStore.hideNavBtns = false
}

let boxPlotData = []

// check if responsesToValidate contains a null, if so filter it out

try {
    responsesToValidate = responsesToValidate?.filter((response) => response !== null)
    if (!responsesToValidate) {
      //TODO: Responses-to-validate are null. Handle this case.
      errorInputsIncomplete.value = true
      expertStore.hideNavBtns = false
    } else {
      const boxPlotYValues = splitChipsForConditionalBoxplots(responsesToValidate, 100, 1 / 100)
      boxPlotData = responsesToValidate?.map((response, index) => {
      if (!response) return
      const name = seriesNames[index]
      const x = xValues[index]
      const y = boxPlotYValues[index]
      return { name, data: [x, ...y] }
      })
    }
} catch (e) {
  console.log(e)
  errorInputsIncomplete.value = true
  expertStore.hideNavBtns = false
}

const goNext = () => {
  expertStore.goToNextPage()
}

const goBackAndRefine = () => {
  let firstQuestion = props.content.questionsToValidate[0]
  expertStore.goToPageByPageId(firstQuestion)
}

provide(THEME_KEY, 'vintage')
const chart = ref(null)

use([
  CanvasRenderer,
  LineChart,
  CandlestickChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  TitleComponent
])

// const REDS = ['#ff5f56', '#ba5353', '#ef4444', '#622424', '#d20404']
const REDS = rocket(10).reverse().slice(4)

const predictionSeriesMaker = (name, data, index = 0) => {
  if (!data) return []
  // max x value
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
        color: REDS[index],
        borderColor: REDS[index],
        borderWidth: 5
      },

      animationDuration: 200,
      animationDelay: (idx) => idx * 10000
    },
    {
      name,
      type: 'line',
      lineStyle: {
        color: REDS[index],
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
        color: REDS[index],
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
    }
  ]
}

const predictionSeries = boxPlotData
  ?.map((prediction, index) => {
    if (!prediction) return

    return predictionSeriesMaker(prediction.name, prediction.data, index)
  })
  .flat()

const chartOption = computed(() => {
  return {
    legend: {
      data: [props.content.trialName, ...seriesNames],
      selectedMode: false,
      showSymbol: false,
      textStyle: {
        fontSize: 18
      },
      top: 12
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
.btn {
  @apply py-2 px-6 mx-2 rounded-lg;
}
.btn-confirm {
  @apply bg-priorb-500 text-white;
}
.btn-refine {
  @apply bg-white text-priorb-500 border border-priorb-500 rounded-lg;
}
.btn-confirm:hover {
  @apply bg-priorb-500/80;
}
.btn-refine:hover {
  @apply bg-white/80 text-priorb-500/80;
}
</style>
