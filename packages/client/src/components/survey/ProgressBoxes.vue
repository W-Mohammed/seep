<template>
  <div class="flex flex-wrap justify-center">
    <div v-for="(box, index) in progressBoxesGetter" :key="index" class="flex items-center grow">
      <div
        @click="goToPage(index)"
        class="rounded-full border flex items-center justify-center cursor-pointer"
        :class="[
          progressBoxesGetter.length > 20 ? 'h-4 w-4' : 'h-5 w-5',
          box.isCurrent ? 'border-2 border-priorb-500' : 'border-gray-400',
          {
            'bg-priorb-200': index < currentPageIndex && !box.isCompleted
          }
        ]"
      >
        <Icon
          v-if="box.type !== 'question'"
          icon="bi:info"
          class="text-gray-900 text-lg overflow-visible"
        />
        <Icon
          v-else-if="box.isCompleted"
          icon="bi:check"
          class="text-gray-500 text-xl overflow-visible"
        />
      </div>
      <div v-if="index < progressBoxesGetter.length - 1" class="h-0.5 grow bg-gray-400"></div>
    </div>

    <div></div>
  </div>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
const expertStore = useExpertStore()
const { progressBoxesGetter, currentPageIndex, shouldTriggerValidation } = storeToRefs(expertStore)

const goToPage = (index) => {
  shouldTriggerValidation.value = false
  expertStore.goToPageByIndex(index)
}
</script>

<style scoped></style>
