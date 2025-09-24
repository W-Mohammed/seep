<template>
  <header class="sticky top-0 z-50 w-full">
    <div
      class="bg-white h-10 border-b border-gray-300 px-lg-8 px-2 max-w-full w-full overflow-hidden"
    >
      <div class="flex items-center h-full justify-between gap-2 ms-2 md:ms-4 lg:ms-8">
      <!-- image with tooltip saying Dark Peak Analytics -->
        <img
          src="/favicon.ico"
          title="Dark Peak Analytics"
          alt="Dark Peak Analytics logo"
          class="h-8 cursor-pointer"
          @click="goToHomepage"
        />

        <div
          class="w-3/4 flex items-center mx-auto relative"
          v-if="surveyGoingOn || postSubmissionViewOnly"
        >
          <!-- saving progress indicators -->
          <div class="w-[100px] md:w-[200px] flex justify-end ms-auto">
            <div v-if="expertId === 'test'">
              <div class="text-gray-700 flex items-center gap-1 font-semibold">
                <span class="whitespace-nowrap text-xs md:hidden"> Preview </span>

                <span class="whitespace-nowrap text-xs hidden md:inline">
                  Preview - Data will not be saved
                </span>

                <Icon icon="bi:exclamation-triangle" />
              </div>
            </div>
            <div v-else-if="postSubmissionViewOnly">
              <div class="text-priorb-primary flex items-center gap-1 font-semibold">
                <Icon icon="mdi:lock-outline" class="text-xl" />
                <span class="whitespace-nowrap text-xs"> READ-ONLY </span>
              </div>
            </div>
            <div v-else-if="savingError" class="text-gray-500 flex items-center gap-1">
              <span class="whitespace-nowrap text-xs"> Network problem </span>
              <Icon icon="bi:cloud-slash" class="text-xl" />
            </div>
            <div v-else-if="isSaving" class="text-gray-700 text-sm flex items-center gap-1">
              <span class="whitespace-nowrap text-xs">Saving</span>
              <Icon icon="bi:arrow-clockwise" class="text-lg animate-spin" />
            </div>

            <!-- Saved state -->
            <div v-else class="text-sm flex items-center gap-1 text-gray-700 whitespace-nowrap">
              <span class="text-xs md:hidden"> Saved </span>
              <span class="text-xs hidden md:inline lg:hidden"> Changes saved </span>
              <span class="text-xs hidden lg:inline"> Changes saved automatically </span>
              <Icon icon="bi:check-lg" class="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProgressBar v-if="surveyGoingOn" :progressPercent="numericProgress" />
  </header>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import NumericProgress from '@/components/survey/NumericProgress.vue'
import { computed } from 'vue'
import ProgressBar from '@/components/survey/ProgressBar.vue'
import { Icon } from '@iconify/vue'
import {CLIENT_HOST} from '@/api/index'
const expertStore = useExpertStore()
const {
  currentProgressPercentage,
  surveyGoingOn,
  isSaving,
  savingError,
  expertId,
  postSubmissionViewOnly
} = storeToRefs(expertStore)
const goToHomepage = () => {
  window.open(CLIENT_HOST, '_blank')
}

const numericProgress = computed(() => {
  return Number(currentProgressPercentage.value)
})
</script>

<style scoped></style>
