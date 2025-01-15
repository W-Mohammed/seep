<template>
  <div class="text-gray-500 text-xs mb-1">
  Question type:
  </div>
<Menu as="div" class="relative w-full">
      <MenuButton
        class="text-gray-700 h-10 text-sm hover:opacity-90 py-1 h-10 bg-white border w-[240px] text-left justify-start ps-4 border-gray-300"
      >
        <Icon icon="bi:chevron-down" class="text-gray-500 text-lg me-2" />
        {{ selectedTypeLabel }}
        
      </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-25"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-25"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute z-10 mt-2 border border-gray-300 origin-top-right rounded bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none left-0 right-0"
      >
        <div class="py-1 px-2">
          <div v-for="(type, i) in agendaItemTypes" :key="type.value">
            <MenuItem
              v-if="type.value"
              v-slot="{ active }"
              @click="changeAgendaType(type.value)"
            >
              <span
                :class="[
  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
  'block px-2 py-1 text-sm cursor-pointer',
                  selectedType === type.value ? 'font-semibold bg-gray-100' : '',
                ]"
              >
                {{ type.text }}
              </span>
            </MenuItem>
            <div v-else>
              <div v-if="i != 0" class="border-t mt-2 pb-2" />
              <div class="text-gray-400 text-xs pb-4 ps-2 h-4">
                {{ type.section }}
              </div>
            </div>
          </div>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {Icon } from '@iconify/vue';
import {getAgendaItemTypes} from '@/lib/addAgendaItemUtils'

const props = defineProps({
  selectedQ: '',
  surveyType: {
    type: String,
    default: 'survey'
  }
})
const agenda = defineModel()
const agendaItemTypes = getAgendaItemTypes(props.surveyType)

const changeAgendaType = (type) => selectedType.value = type; 

const selectedTypeLabel = computed(() => {
  const type = agendaItemTypes.find((item) => item.value === selectedType.value)
  return type ? type.text : 'Select a question type'
})

const changeAgendaItemTypeAndViewId = (type) => {
  if (!type) return
  let itemType = agendaItemTypes.find((item) => item.value === type)
  if (!itemType) return

  const { mainIndex, subIndex } = searchItemIndex(props.selectedQ)
  if (mainIndex === null) return

  let item;
  if (subIndex === null) {
    item = agenda.value[mainIndex]
  } else {
    item = agenda.value[mainIndex].children[subIndex]
  }

  item.content.questionType = itemType.value
  item.viewId = itemType.viewId
  item.pageType = itemType.pageType
  item.section = itemType.section || false
  return item
}

const searchItemIndex = (pageId) => {
  for (let i = 0; i < agenda.value.length; i++) {
    if (agenda.value[i].pageId === pageId) {
        return { mainIndex: i, subIndex: null }
    }
    if (agenda.value[i].section) {
      for (let j = 0; j < agenda.value[i].children.length; j++) {
        if (agenda.value[i].children[j].pageId === pageId) {
          return { mainIndex: i, subIndex: j }
        }
      }
    } 
  }
  return { mainIndex: null, subIndex: null }
}

const selectedType = computed({
  get: () => {
    if (!props.selectedQ) return 'roulette'
    const { mainIndex, subIndex } = searchItemIndex(props.selectedQ)
    if (mainIndex === null) return 'roulette'
    if(subIndex != null) {
      return agenda.value[mainIndex].children[subIndex].content.questionType || 'radio'
    } else {
      if (agenda.value[mainIndex].section) return 'section'
      else return agenda.value[mainIndex].content.questionType || 'radio'
    }
  },
  set: (val) => changeAgendaItemTypeAndViewId(val)
})


</script>

<style scoped></style>
