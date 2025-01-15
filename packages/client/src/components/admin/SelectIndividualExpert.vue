<script  setup>
import ButtonBase from '@/components/admin/ButtonBase.vue'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/admin/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
  currentExperts: {
    type: Array,
    default: () => []
  },
  expertColors: {
    type: Object,
    default: () => ({})
  }
})
const selectedExperts = defineModel()
const selectedExpertStrings = computed(() => {
  let out = props.currentExperts
    .filter((expert) => selectedExperts.value[expert._id] && !expert.noData && !expert.isIgnored)
    .map((expert) => {
      return badgeDiv(expert.name.split(' ')[0], expert._id)
    })

  if (out.length > 4) {
      let count = out.length
    out = out.slice(0, 4)
    out.push(` +${count - 4}`)
    }

  const noDataCount = props.currentExperts.filter(
    (expert) => (expert.noData || expert.isIgnored) && selectedExperts.value[expert._id]
  ).length
  let noCountStr
  if (noDataCount > 0 && out.length > 0) noCountStr = ` (+${noDataCount} without data)`
  else if (noDataCount > 0 && out.length === 0) noCountStr = `${noDataCount} Experts without data`
  else noCountStr = ''
  out.push(noCountStr)
  return out
})

const selectedAllExperts = () => {
  const allExperts = {}
  props.currentExperts.forEach((expert) => {
    allExperts[expert._id] = true
  })
  selectedExperts.value = allExperts
}

const badgeDiv = (expertName, expertId) => {
  
  return `<span class=" py-0.5 px-1 me-0.5 rounded-md border text-xs text-white"
 style="background-color: ${props.expertColors[expertId].color}"
  >${expertName}</span>`
}

const selectInputFieldContent = computed(() => {
  if (props.currentExperts.length === 0) return 'No data available'
  if (selectedExpertStrings.value.length === 0 ||
    selectedExpertStrings.value[0] === ''
  ) return 'Show Experts'
  return selectedExpertStrings.value.join(' ')
})
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child>
      <ButtonBase
        variant="outline"
        class="h-8 rounded-md py-2 whitespace-nowrap pe-8 ps-2 me-4 font-normal min-w-[200px] grow max-w-[300px] justify-start"
        :disabled="currentExperts.length === 0"
      >
        <Icon icon="bi:chevron-down" class="me-2 text-base text-gray-700" />
        <div class="text-gray-400 overflow-x-hidden" v-html="selectInputFieldContent"></div>
      </ButtonBase>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <!-- select all / unselect all -->
      <DropdownMenuItem @click="selectedAllExperts()">
        <Icon icon="bi:check-all" class="h-full text-xl me-2 font-semibold text-gray-700" /> Select
        all
      </DropdownMenuItem>
      <DropdownMenuItem @click="selectedExperts = {}">
        <Icon icon="bi:x-lg" class="h-full text-xl me-2 font-semibold text-gray-700" /> Remove all
      </DropdownMenuItem>
      <DropdownMenuSeparator class="border-t border-gray-300" />
      <DropdownMenuCheckboxItem
        v-for="(expert, index) in currentExperts"
        :key="index"
        v-model:checked="selectedExperts[expert._id]"
        :disabled="expert.disabled"
        :class="(expert.noData || expert.isIgnored) ? 'text-gray-400' : 'text-gray-900'"
      >
        {{ expert?.name }}
        <Icon v-if="expert.noData" icon="pepicons-pencil:database-off" class="ms-1 text-lg" />
        <Icon v-if="expert.isIgnored" icon="bi:ban" class="ms-1.5 text-lg" />
      </DropdownMenuCheckboxItem>
      
    </DropdownMenuContent>
  </DropdownMenu>
</template>
