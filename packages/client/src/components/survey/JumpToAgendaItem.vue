<template>
  <div
    class="flex flex-col fixed top-[71px] left-1 md:left-4 w-[200px] border rounded border-black bg-white z-10 overflow-x-hidden"
    ref="jumpToAgendaItem"
    v-if="surveyGoingOn || postSubmissionViewOnly"
  >
    <button
      class="rounded z-100 flex items-center justify-start p-2 gap-1 text-left focus:outline-none"
      :class="{
        'bg-priorb-100': showSidebar,
        'rounded-b-none': showSidebar,
      }"
      @click="toggleSidebar()"
    >
      <Icon icon="bi:layout-text-sidebar" />
      <div class="text-sm font-semibold">
        <div class="whitespace-nowrap max-w-[140px] overflow-hidden">
        <!-- Jump to page -->
          {{
            showSidebar
              ? 'Go to page'
              : currentPage?.label?.length > 18
                ? currentPage?.label?.slice(0, 17) + '...'
                : currentPage?.label
          }}
        </div>
      </div>
      <Icon
        icon="bi:caret-up-fill"
        class="ms-auto me-1 pointer-events-none"
        v-if="showSidebar"
      />
      <Icon
        icon="bi:caret-down-fill"
        class="ms-auto me-1 pointer-events-none"
        v-else
      />
    </button>
    <div
      class="overflow-y-hidden w-30 animate-max-h"
      :class="{
        'max-h-0': !showSidebar,
        'max-h-[75vh] overflow-y-scroll': showSidebar,
      }"
    >
      <div v-for="(item, index) in agendaItems" :key="item.label">
        <button
          @click="jumpToSelection(item.label)"
          class="px-2 py-2.5 text-left w-full text-sm flex items-center gap-1 text-gray-800 hover:text-gray-800 hover:bg-priorb-100 transition-colors duration-50 ease-in-out whitespace-nowrap rounded-none inset focus:outline-none overflow-hidden border-t border-gray-100"
          :title="
            item?.labelAlt2 ? index + 1 + ' ' + item.labelAlt2 : item.labelAlt1
          "
          :class="{
            'text-white bg-priorb-PRIMARY hover:bg-priorb-PRIMARY/80 hover:text-white': item.label === currentPage?.label,
            'focus:bg-priorb-100 focus:text-gray-800  ':
              item.label !== currentPage?.label,
          }"
        >
          <div
            class="w-[190px] text-xs flex flex-col overflow-hidden"
          >
            <div
              class="text-sm text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ item.labelAlt1 }}
            </div>
            <div class="text-ellipsis overflow-hidden whitespace-nowrap">
              {{ item.labelAlt2 }}
            </div>
          </div>

          <Icon icon="bi:chevron-right" class="ms-auto text-lg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import SelectInput from '@/components/survey/SelectInput.vue';

const emit = defineEmits(['toggle-sidebar']);
const jumpToAgendaItem = ref(null);
const showSidebar = ref(false);
const expertStore = useExpertStore();
const {
  agendaItems,
  surveyGoingOn,
  currentPageIndex,
  shouldTriggerValidation,
  postSubmissionViewOnly,
} = storeToRefs(expertStore);
const selected = ref('');

const currentPage = computed(() => {
  return agendaItems.value[currentPageIndex.value];
});

const jumpToSelection = async (label) => {
  const index = agendaItems.value.findIndex((item) => item.label === label);
  if (index === -1) return;
  shouldTriggerValidation.value = false;
  await expertStore.goToPageByIndex(index);
};

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
  emit('toggle-sidebar');
};

watch(currentPage, (newVal) => {
  selected.value = newVal.label;
});

watch(selected, (newVal) => {
  jumpToSelection(newVal);
});

const handleClickOutside = (event) => {
  // close sidebar if clicked outside
  if (
    showSidebar.value &&
    jumpToAgendaItem.value &&
    !jumpToAgendaItem.value.contains(event.target)
  ) {
    showSidebar.value = false;
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    showSidebar.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
.animate-max-h {
  transition: max-height 0.4s ease-in-out;
}
</style>
