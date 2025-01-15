<script  setup>
import ButtonBase from '@/components/admin/ButtonBase.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/admin/ui/dropdown-menu'
import { downloadTableAsCsv } from '@/lib/utils'
import { ref } from 'vue'
import { getRawDataDump, getAnalyticsChipsAndBinsPsa } from '@/api/analytics'
import { Parser } from '@json2csv/plainjs'
import { unwind, flatten } from '@json2csv/transforms'
import { Icon } from '@iconify/vue'
import { toastError } from '@/lib/fetchAnalyticsHelper'

const props = defineProps({
  statsTableData: {
    type: Array,
    default: () => []
  },
  chart: {
    type: Object,
    default: () => {}
  },
  tenantId: {
    type: String,
    default: ''
  },
  surveyId: {
    type: String,
    default: ''
  },
  questionId: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: ''
  },
  showPsa: {
    type: Boolean,
    default: true
  }
})

const downloadCsv = () => {
  if (!props.statsTableData) return toastError('No data')
  if (props.statsTableData.length === 0) return toastError('No data')
  if (props.statsTableData[0].length < 2) return toastError('No data')
  downloadTableAsCsv(props.statsTableData, 'see-stats.csv')
}

const downloadChart = () => {
  if (!props.chart) return
  if (!props.chart?.getDataURL) toastError('No chart data')
  const img = props.chart?.getDataURL({
    pixelRatio: 4,
    type: 'png',
    backgroundColor: '#fff',
    width: '1000px',
    height: '1000px'
  })
  var a = document.createElement('a')
  a.href = img
  a.download = 'see-chart.png'
  a.click()
}

const downloadRawData = async (tenantId, surveyId) => {
  try {
    isLoading.value = true
    const response = await getRawDataDump(tenantId, surveyId)
    const opts = {
      delimiter: ',',
      transforms: [
        flatten({
          objects: true,
          arrays: true
        })
      ]
    }
    
    const parser = new Parser(opts)
    const dataAsArr = Object.values(response?.data)
    const arrFormat = []
    const uniqCols = new Set()
    dataAsArr.forEach((row) => {
      arrFormat.push({})
      row.forEach((col) => {
          let prefix = col._columnName ? col._columnName + '.' : ''
          Object.keys(col).forEach((key) => {
            if(key === '_columnName') return
            arrFormat[arrFormat.length - 1][prefix + key] = col[key]
            uniqCols.add(prefix + key)
        })
      })
    })

    // sort the unique columns
    const sortedCols = Array.from(uniqCols).sort()
    const arrSorted = arrFormat.map((row) => {
      const newRow = new Map()
      sortedCols.forEach((col) => {
        let colName = col
        if (colName.startsWith('_.')) {
          // '_.' is prefix for meta data to ensure sorted first
          // but remove it from the final output
          colName = colName.slice(2)
        }
        if (row[col] != null)
          newRow[colName] = row[col]
        else 
        newRow[colName] = ''
      })
      return newRow
    })
    let csv = parser.parse(arrSorted)
    const csvArr = csv.split('\n')
    csv = csvArr.join('\n')
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += csv
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)


    const fileName = `responses_${tenantId}-${surveyId}.csv`

    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    isLoading.value = false
    link.click()
  } catch (err) {
    isLoading.value = false
    toastError('Something went wrong: Failed to download raw data')
    console.error(err)
  }
}

// tenantId, surveyId,  questionId, model, psaSamples: number
const drawChipsAndBinPsa = async (tenantId, surveyId, questionId, model, psaSamples) => {
  isLoading.value = true
  try {
    const response = await getAnalyticsChipsAndBinsPsa(
      tenantId,
      surveyId,
      questionId,
      model,
      psaSamples
    )
    const header = 'rlinearpool-' + model
    let csv = response?.data?.join('\n')
    csv = header + '\n' + csv
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += csv
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `psaSample_${questionId}.csv`)
    document.body.appendChild(link)
    isLoading.value = false
    link.click()
  } catch (err) {
    isLoading.value = false
    toastError('Something went wrong: Failed to draw chips and bins')
    console.error(err)
  }
}

const isLoading = ref(false)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <ButtonBase
        :disabled="isLoading"
        variant="outline"
        class="ms-auto h-9 rounded-sm py-0 border border-gray-700 whitespace-nowrap p-0 justify-start items-center min-w-[141px]"
      >
        <div class="border-r border-gray-700 text-base text-gray-700 my-1.5 h-full">
          <Icon v-if="!isLoading" icon="bi:chevron-down" class="h-full w-9 px-0 py-1" />
          <Icon v-else icon="mdi:loading" class="h-full animate-spin w-9 px-0 py-1" />
        </div>
        <div class="text-gray-900 font-medium flex justify-center items-center">
          <div class="ms-2">Export</div>
          <Icon icon="mdi:export" class="h-full text-2xl ms-2 font-semibold text-gray-700" />
        </div>
      </ButtonBase>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-40">
      <DropdownMenuItem @click="downloadCsv">
        <Icon icon="bi:table" class="h-full text-xl me-2 font-semibold text-gray-700" /> Table as
        .csv
      </DropdownMenuItem>
      <DropdownMenuItem @click="downloadChart" v-if="chart">
        <Icon icon="bi:graph-up" class="h-full text-xl me-2 font-semibold text-gray-700" /> Graph as
        .png
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="showPsa"
        @click="drawChipsAndBinPsa(tenantId, surveyId, questionId, model, 1000)"
      >
        <Icon icon="mdi:dice-3-outline" class="h-full text-xl me-2 font-semibold text-gray-700" />
        Draw 1,000
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="showPsa"
        @click="drawChipsAndBinPsa(tenantId, surveyId, questionId, model, 10000)"
      >
        <Icon
          icon="mdi:dice-multiple-outline"
          class="h-full text-xl me-2 font-semibold text-gray-700"
        />
        Draw 10,000
      </DropdownMenuItem>
      <DropdownMenuSeparator class="border-t border-gray-300" />
      <DropdownMenuItem @click="downloadRawData(tenantId, surveyId)">
        <Icon icon="bi:database-down" class="h-full text-xl me-2 font-semibold text-gray-700" /> Raw
        data dump
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
