<template>
  <div class="mt-4 flex flex-col mb-20 relative">
    <div class="flex flex-row justify-between mb-2 gap-3">
      <h1 class="text-xl font-semibold">{{ title ? title : "Experts" }} ({{ validResponses }})</h1>
    </div>
    <TableBase v-if="statsTableData?.length" class="mb-10">
      <TableHeader class="bg-vGray-100 text-priorb-SECONDARY">
        <TableRow class="border-gray-300">
          <TableHead
          v-if="headerGroups.length"
          v-for="(header, index) in headerGroups"
          :title="header.group"
          :key="index"
          class="h-8 font-semibold ps-4 text-ellipsis overflow-hidden whitespace-nowrap max-w-[8ch]"
          :class="{
            'headcol min-w-[120px] bg-vGray-100': index === 0,
            'px-1 border-b border-gray-400': header.group ? true : false
          }"
          :colspan="header.colspan"
        >
            {{ header.group }}

            
            <div
            v-if="header.group"
            class="absolute hidden group-hover:inline-block tooltip-text bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg"
            >
            {{ header.group }}
            </div>
          
          </TableHead>
        </TableRow>

        <TableRow class="border-b border-gray-300">
          <TableHead
            v-for="(cell, index) in statsTableData[0]"
            :key="index"
            class="h-8 px-2 font-semibold text-gray-900"
            :class="{
              'headcol min-w-[120px] bg-vGray-100': index === 0,
              'min-w-[35ch]': cell === 'rationale' || cell === 'Question' || cell === 'Comment',
            }"
          >
          <!--A quick hack-->
          {{ cell.includes('-&-') ? cell.split('-&-')[1].trim() : cell }} 
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="statsTableData?.length && statsTableData?.length>1">
        <TableRow v-for="(row, index) in statsTableData.slice(1)" :key="index">
          <TableCell
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="min-w-20 px-2 max-w-[200px]"
            :class="{
              'headcol min-w-[120px] bg-white': cellIndex === 0
            }"
          >
            {{ cell }}
          </TableCell>
        </TableRow>
      </TableBody>
      <TableBody v-else>
        <TableRow>
          <TableCell class="text-center font-bold" colspan="100%">
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    </TableBase>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  TableBase,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/admin/table'
const props = defineProps({
  validResponses: Number,
  statsTableData: Array,
  // currentResultsStats: Array,
  togglePooled: String,
  title: String
})
const headerGroups = computed(() => {
  let anyEmptyGroups = false
  const headerGroups = []
  let currentGroup = ''
  let currentGroupCount = 0

  for (let key of props.statsTableData[0]) {
    // for matrix questions
    const regex = /^Q\d+:\s.+/
    if (regex.test(key)) {
      anyEmptyGroups = true
      if (currentGroup === key.split('-&-')[0].trim()) {
        currentGroupCount++
      } else {
        if (currentGroup) {
          headerGroups.push({ group: currentGroup, colspan: currentGroupCount })
        }
        currentGroup = key.split('-&-')[0].trim()
        currentGroupCount = 1
      }
    } else if (key.startsWith('fit') || key.startsWith('value')) {
      anyEmptyGroups = true
      if (currentGroup === 'Model') {
        currentGroupCount++
      } else {
        if (currentGroup) {
          headerGroups.push({ group: currentGroup, colspan: currentGroupCount })
        }
        currentGroup = 'Model'
        currentGroupCount = 1
      }
    } else if (key.startsWith('q')) {
      anyEmptyGroups = true
      if (currentGroup === 'Quantiles') {
        currentGroupCount++
      } else {
        if (currentGroup) {
          headerGroups.push({ group: currentGroup, colspan: currentGroupCount })
        }
        currentGroup = 'Quantiles'
        currentGroupCount = 1
      }
    } else if (key.startsWith('bin') || key.startsWith('chip') || key.startsWith('prob')) {
      anyEmptyGroups = true
      if (currentGroup === 'Raw Response Data') {
        currentGroupCount++
      } else {
        if (currentGroup) {
          headerGroups.push({ group: currentGroup, colspan: currentGroupCount })
        }
        currentGroup = 'Raw Response Data'
        currentGroupCount = 1
      }
    } else {
      if (currentGroup) {
        headerGroups.push({ group: currentGroup, colspan: currentGroupCount })
      }
      headerGroups.push({ group: '', colspan: 1 })
      currentGroup = ''
      currentGroupCount = 0
    }
  }
  if(!anyEmptyGroups) return []
  headerGroups.push({ group: currentGroup, colspan: currentGroupCount })
  return headerGroups
})
</script>

<style scoped>
.headcol {
  position: sticky;
  width: 6em !important;
  left: 0;

  box-shadow: -1px 0 0 #efefef inset;
}

.headcol:hover .tooltip {
  display: flex;
}

.tooltip-text {
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 10;
  display: none;
}

.group:hover .tooltip-text {
  display: inline-block;
}

</style>
