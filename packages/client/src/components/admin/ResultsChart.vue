<template>
  <v-chart
    ref="chart"
    class="chart"
    :option="chartOption"
    style="height: 100%; width: 100%"
    autoresize
  ></v-chart>
</template>

<script setup>
import { provide, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
    TooltipComponent,
    TitleComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent
} from 'echarts/components'
const props = defineProps({
  resultsArr: Array,
  xAxisLabel: String,
  yAxisLabel: String
})

provide(THEME_KEY, 'vintage')
// const chart = ref(null)
const chart = defineModel('chart')

use([CanvasRenderer, LineChart, TooltipComponent, LegendComponent, GridComponent, ToolboxComponent, TitleComponent])

const chartOption = computed(() => {
  return {
    title: {
      // text: 'Line Chart'
    },
    tooltip: {
      trigger: 'axis',
    showContent: false,
    // position: function (pt) {
    //   return [pt[0], '10%'];
    //   },
      formatter: function (params) {
        params = params.sort((a, b) => b.value[1] - a.value[1])
        return params.map((param) => param.seriesName + ': ' + Math.round(param.value[1]*1000)/1000).join('<br />')
      },
      axisPointer: {
        animation: true
      },
    //   textStyle: {
    //     fontSize: 12
    //   }
  },
    legend: {
      show: false,
      data: props.resultsArr.map((result) => result.name),
      selectedMode: false,
      showSymbol: false,
      textStyle: {
        fontSize: 12
      },
      top: 12
    },
    grid: {
      top: '10%',
      left: '0%',
      right: '1%',
      bottom: '6%',
      containLabel: true
    },
    toolbox: {
      right: 30,
      top: 7,
      feature: {
        dataZoom: {
          show: false,
          title: {
            zoom: 'Zoom',
            back: 'Reset Zoom'
          },
          yAxisIndex: 'none'
        },
        // dataView: { show: true, readOnly: true },
        saveAsImage: {
          show: false,
          title: 'Download',
          name: 'see-chart',
          type: 'png',
          backgroundColor: '#fff',
          excludeComponents: ['toolbox']
        }
      },
      iconStyle: {
        borderColor: '#ff5f56',
        borderWidth: 1
      },
      emphasis: {
        iconStyle: {
          borderColor: '#ff5f56',
          borderWidth: 2
        }
      }
    },
    xAxis: {
      type: 'value',
      name: props?.xAxisLabel || null,
    nameLocation: 'center',
    nameGap: 0,
    nameTextStyle: {
      align: 'center',
      verticalAlign: 'top',
      fontSize: 16,
      color: '#444',
      /**
       * the top padding will shift the name down so that it does not overlap with the axis-labels
       * t-l-b-r
       */
      padding: [28, 0, 0, 0],
    },

    },
    //     type: 'category',
    //     boundaryGap: false,
    //     // data: xValuesFit.value || [],
    // },
    yAxis: {
      type: 'value',
      name: props?.yAxisLabel || null,

      nameGap: 30, 
      nameTextStyle: {
        align: 'top',
        fontSize: 16,
        color: '#444',
      },
    },
    series: props.resultsArr.map((result) => {
      return {
        name: result.name,
        expertId: result.expertId,
        type: 'line',
        data: result.data,
        lineStyle: result.lineStyle || {},
        step: result.step || false,
        areaStyle: result.areaStyle || {},
        label: {
          show: true,
          formatter: function (params) {
            return params.seriesName.split(' ')[0] + ': ' + Math.round(params.value[1] * 1000) / 1000
          }
        },
        showSymbol: result.showSymbol || false,
        silent: true,
        symbol: 'none',
        itemStyle: {
          color: 'transparent'
        }
      }
    })
  }
})

</script>

<style scoped></style>
