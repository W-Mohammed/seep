<template>
  <Menu as="div" class="relative inline-block text-left w-full" ref="btn">
    <div class="ps-2 lg:ps-4 pe-2 xl:pe-4">
      <MenuButton
        class="mt-2 px-1.5 text-white text-sm flex hover:opacity-90 items-center w-full py-2 bg-priorb-primary"
        @click="checkLocation()"
      >
        <Icon
          icon="akar-icons:plus"
          class="rounded-full text-xl border border-white h-5 w-5 me-2 p-0.5"
        />
        <span class="font-semibold"> Add Page </span>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-25"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-25"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute z-10 mt-2 border border-gray-500  rounded bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none left-1 right-1"
        :class="btnIsInTopHalf ? 'bottom-10' : 'top-10'"
      >
        <div class="py-1">
          <div v-for="(type, i) in agendaItemTypes" :key="type.value">
            <MenuItem
              v-if="type.value"
              v-slot="{ active }"
              @click="addAgendaItem(type.value)"
            >
              <span
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block px-4 py-1 text-sm',
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
import { ref,computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { Icon } from '@iconify/vue';
import { setPageId, initAgendaItem } from '@/lib/addAgendaItemUtils';
import { getAgendaItemTypes } from '@/lib/addAgendaItemUtils';

const props = defineProps({
  surveyType: {
    type: String,
    default: 'survey',
  }
})
const agenda = defineModel('agenda');
const selectedQuestion = defineModel('selectedQuestion');
const agendaItemTypes = computed(() => getAgendaItemTypes(props.surveyType));

const addAgendaItem = (type) => {
  const newQuestion = initAgendaItem(type);
  agenda.value.push(newQuestion);
  setTimeout(() => {
    selectedQuestion.value = newQuestion.pageId;
  }, 50);
};
const btnIsInTopHalf = ref(true)
const btn = ref(null)
const checkLocation = () => {
  if(!btn.value || !btn.value.$el) return
  const el = btn.value.$el;
  const top = el.getBoundingClientRect().top;
  btnIsInTopHalf.value = top > window.innerHeight / 2
}
</script>
