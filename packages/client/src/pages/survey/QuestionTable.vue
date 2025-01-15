<template>
  <div class="container flex flex-col max-w-[100ch]">
    <QuestionBlock
      v-if="content?.questionTitle"
      :content="content"
      class="mb-8"
    />
    <div v-if="content.table" class="overflow-x-auto">
      <table class="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th
              v-for="(column, columnIndex) in content.table.columns"
              :key="'header-' + columnIndex"
              class="border border-gray-300 px-4 py-2 text-left"
            >
              {{ column.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="rowIndex in content.table.totalRows - 1"
            :key="'row-' + rowIndex"
          >
            <td
              v-for="(column, colIndex) of content.table.columns"
              :key="'cell-' + rowIndex + '-' + colIndex"
              class="border border-gray-300"
              :colspan="getColspan(rowIndex, colIndex)"
              :class="{ 'bg-gray-50': rowIndex % 2 === 0, 'hidden': isMissing(rowIndex, column.id) }"
            >
              <template v-if="isMergedCell(rowIndex, colIndex)">
                <div class="px-4 py-2">{{ getCellContent(rowIndex, colIndex) }}</div>
              </template>
              <template v-else-if="getCellContent(rowIndex, colIndex) && isNotInput(rowIndex, column.id)">
              <div class="px-4 py-2">
                {{ getCellContent(rowIndex, colIndex) }}
              </div>
              </template>
              <template v-else-if="!isMergedCell(rowIndex, colIndex) && !isPartOfMergedCell(rowIndex, colIndex)">
                <input
                  v-model="tableData[rowIndex][column.id].content"
                  :type="column.type === 'percentages' ? 'text' : 'text'" 
                  class="w-full px-4 py-2 rounded focus:ring focus:ring-priorb-200 rounded-none focus:outline-none"
                   @input="formatCellValue(rowIndex, column.id, column.type)"
                />
              </template>  
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import { useExpertStore } from '@/store/expertStore'
import { ref, computed, onBeforeMount, watch } from 'vue'
const expertStore = useExpertStore()
import { storeToRefs } from 'pinia'
const { currentPageValue } = storeToRefs(expertStore)
const { setCurrentQuestionCompleted } = expertStore
import { TableAgendaItem } from '@/models/AgendaClass';

const props = defineProps({
  content: Object, 
})

TableAgendaItem.initialiseResponse(currentPageValue, props)

function buildCompleteTable(table) {
  const completeRows = []

  
  for (let rowIndex = 0; rowIndex < table.totalRows; rowIndex++) {
    
    const row = table.rows?.[rowIndex] || { cells: [] }
    
    const existingCellsMap = new Map(
      row.cells?.map((cell) => [cell.columnId, { content: cell.content, type: cell.type, function: cell.function, args: cell.args }])
    )

    const completeRow = {
      rowIndex,
      cells: table.columns.filter((column) => !existingCellsMap.has(column.id) || existingCellsMap.get(column.id).type != "skip"  ).map((column) => ({
        columnId: column.id,
        content: existingCellsMap.get(column.id) || { content: '', type: 'input' },
        type: existingCellsMap.has(column.id) ? 'data' : 'empty',
      })),
    }

    completeRows.push(completeRow)
  }

  return {
    ...table,
    rows: completeRows, 
  }
}

const completeTable = computed(() => buildCompleteTable(props.content.table))

const tableData = ref([])

const getCellContent = (rowIndex, columnIndex) => {
  const row = completeTable.value.rows?.[rowIndex]
  if (!row) return ''
  const cell = row.cells?.find(
    (c) => c.columnId === completeTable.value.columns[columnIndex].id
  )

  if (!cell) return ''
 
  if (cell.content.type === 'calculated') {
    const result = calculationFunctions[cell.content.function]?.apply(this, [cell, ...cell.content.args])
    cell.content.content = result
  }
  return cell?.content?.content || ''
}


const isMergedCell = (rowIndex, columnIndex) => {
  const columnId = completeTable.value.columns[columnIndex].id
  return completeTable.value.mergedCells?.some(
    (merge) =>
      merge.start.rowIndex === rowIndex &&
      merge.start.columnId === columnId
  )
}

const getColspan = (rowIndex, columnIndex) => {
  const merge = completeTable.value.mergedCells?.find(
    (m) =>
      m.start.rowIndex === rowIndex &&
      m.start.columnId === completeTable.value.columns[columnIndex].id
  )
  if (merge) {
    const startIndex = completeTable.value.columns.findIndex(
      (col) => col.id === merge.start.columnId
    )
    const endIndex = completeTable.value.columns.findIndex(
      (col) => col.id === merge.end.columnId
    )
    return endIndex >= startIndex ? endIndex - startIndex + 1 : 1
  }
  return 1;
}

const isPartOfMergedCell = (rowIndex, columnIndex) => {
  return completeTable.value.mergedCells?.some((merge) => {
    const startIndex = completeTable.value.columns.findIndex(
      (col) => col.id === merge.start.columnId
    );
    const endIndex = completeTable.value.columns.findIndex(
      (col) => col.id === merge.end.columnId
    );
    return (
      merge.start.rowIndex === rowIndex &&
      columnIndex > startIndex &&
      columnIndex <= endIndex
    )
  })
}

const isMissing = (rowIndex, columnId) => {
  return tableData.value[rowIndex][columnId] == null
}

onBeforeMount(() => {

  tableData.value = currentPageValue.value.tableData?.length == 0 ? Array.from({ length: completeTable.value.totalRows }, (_, rowIndex) => {
    const row = completeTable.value.rows?.[rowIndex] || {}
    const temp = {}
    for (let i = 0; i < row.cells.length; i++) {
      temp[row.cells[i].columnId] = row.cells[i].content
    }
    return temp
  }) : currentPageValue.value.tableData
  currentPageValue.value.tableData = tableData.value
})

watch(
  tableData,
  (newTableData) => {
    currentPageValue.value.tableData = newTableData
    setCurrentQuestionCompleted(true)
  },
  { deep: true}
)

const isNotInput = (rowIndex, colId) => {
  return completeTable.value.rows[rowIndex].cells.filter((cell) => cell.columnId === colId)[0] && 
    completeTable.value.rows[rowIndex].cells.filter((cell) => cell.columnId === colId)[0].content.type !== 'input'
}

const formatCellValue = (rowIndex, columnId, columnType) => {
  const cell = tableData.value[rowIndex][columnId]
  
  if (columnType === 'percentages') {
    const numericValue = parseFloat(cell.content.replace('%', '').trim())
    if (!isNaN(numericValue)) {
      cell.content = numericValue + '%'
    } else {
      cell.content = ''
    }
  }
}

// This is where you can add your custom calculation functions
const calculationFunctions = {
  calculateTotalPercentage: (cell, startRow, endRow) => {
    const columnId = cell.columnId

    let sum = 0
    for (let i = startRow; i <= endRow; i++) {
      const value = parseFloat(tableData.value[i][columnId]?.content?.replace('%', '') || 0)
      sum += isNaN(value) ? 0 : value
    }
    return sum + '%'
  },
}


</script>

<style scoped>
</style>
