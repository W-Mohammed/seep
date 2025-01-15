<template>
  <div class="container flex flex-col items-center justify-center max-w-[90ch]">
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

    <div class="text-xl w-full mt-10 mb-6">
      Does it accurately reflect your understanding of the uncertainty?
    </div>

    <div class="w-full border rounded-lg">
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

    <div class="bg-priorb-50 rounded-lg my-8 flex py-4 px-4 w-full items-center">
      <div class="font-semibold leading-tight">Does this visualisation accurately capture your estimates?</div>

      <div class="ps-4 ms-auto flex gap-2">
        <button class="btn btn-refine" @click="goBackAndRefine()">Refine</button>
        <button class="btn btn-confirm" @click="goNext">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { Icon } from '@iconify/vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
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
import { splitChipsForBoxPlot } from '@/lib/rouletteUtils'

throw new Error('This component is deprecated and needs to be updates before it can be used.')

const props = defineProps({
  content: {}
})
const expertStore = useExpertStore()

const defaultTitle = 'We have taken your estimates and visualised them along with existing data from a clinical trial.'


const trialSeriesMaker = (name, data) => {
  if(!data) return []
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
const xValues = [36, 60]
const seriesNames = ['3 years prediction', '5 years prediction']
const trialSeries = trialSeriesMaker('XC7 Trial data', [
  [0, 100],
  [3, 95],
  [6, 92],
  [9, 85],
  [12, 84],
  [15, 82],
  [18, 78]
])

const responsesToValidate = props?.content?.questionsToValidate?.map((q) =>
  expertStore.getResponseByPageId(q)
)
const boxPlotData = responsesToValidate?.map((response, index) => {
  if (!response) return
  const name = seriesNames[index]
  const x = xValues[index]
  const y = splitChipsForBoxPlot(response.chips, response.xMin, response.xMax)
  return { name, data: [x, ...y] }
})

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

const REDS = ['#ff5f56', '#ba5353', '#ef4444', '#622424', '#d20404']

const predictionSeriesMaker = (name, data, index = 0) => {
  if (!data) return []
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
        [data[0] - 1, data[3]],
        [data[0] + 1, data[3]]
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
        [data[0] - 1, data[4]],
        [data[0] + 1, data[4]]
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
      data: ['XC7 Trial data', '3 years prediction', '5 years prediction'],
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
      max: 72,
      min: 0,
      interval: 6,
      name: 'Months',
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
</script>

<style scoped>
.btn {
  @apply py-2 px-6 rounded-lg;
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
