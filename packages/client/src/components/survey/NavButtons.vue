<template>
  <div class="flex flex-col mt-10">
    <div
      class="flex gap-4 w-full justify-end"
      v-if="(surveyGoingOn && !hideNavBtns) || postSubmissionViewOnly"
    >
      <button
        :disabled="!canGoPrevious"
        @click="goToPreviousPage()"
        class="btn-back"
      >
        <div class="icon-btn-back-container">
          <Icon icon="bi:arrow-left" class="text-white icon-btn-back" />
        </div>
        <div class="ms-4 text-lg font-normal">Back</div>
      </button>
      <button
        :disabled="!canGoNext"
        @click="goToNextPageProxy()"
        class="btn-proceed"
      >
        <div class="me-4 text-lg font-normal">Continue</div>

        <div class="icon-btn-proceed-container">
          <Icon icon="bi:arrow-right" class="icon-btn-proceed" />
        </div>
      </button>
    </div>
    <div
      class="min-w-10 max-w-[64ch] ms-auto text-end mb-4 mt-4"
      style="min-height: 56px !important"
    >
    <div v-if="!currentPageIsCompleted && shouldTriggerValidation">
      <div class="text-priorb-600 text-sm  text-right font-medium flex items-start justify-end leading-tight">
        <Icon icon="bi:exclamation-triangle" class="text-priorb-600 me-1 text-lg mb-0.5" />
          Required field(s) missing or incorrect{{ currentPageError ? ':' : '.' }}
          {{ currentPageError }}
        
      </div>
      <div class="text-sm mt-1 text-gray-700">
        Complete the task or click 'Continue' to proceed.
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import ButtonBase from '@/components/survey/ButtonBase.vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';

const expertStore = useExpertStore();
const { goToNextPage, goToPreviousPage } = expertStore;
const {
  canGoNext,
  canGoPrevious,
  surveyGoingOn,
  hideNavBtns,
  currentPageIsCompleted,
  shouldTriggerValidation,
  currentPageError,
  postSubmissionViewOnly,
} = storeToRefs(expertStore);

const goToNextPageProxy = () => {
  if (!currentPageIsCompleted.value && !shouldTriggerValidation.value) {
    shouldTriggerValidation.value = true;
  } else {
    shouldTriggerValidation.value = false;
    goToNextPage();
  }
};

watch(currentPageIsCompleted, () => {
  if (currentPageIsCompleted.value) {
    shouldTriggerValidation.value = false;
  }
});

window.addEventListener('keydown', (e) => {
  if (import.meta.env.DEV) {
    if (e.key === 'ArrowRight' && canGoNext.value) return goToNextPage();
    if (e.key === 'ArrowLeft' && canGoPrevious.value) return goToPreviousPage();
  }
});
</script>

<style scoped>
.btn-back {
  @apply h-10 border border-black bg-white disabled:bg-gray-500 rounded-sm text-black px-2
        hover:bg-gray-100 hover:text-black hover:border-black flex items-center;
}

.icon-btn-back-container {
  @apply bg-black p-1 rounded-full;
}

.btn-proceed {
  @apply h-10 border border-black bg-black disabled:bg-black rounded-sm text-white px-2
        hover:bg-black/80 flex items-center;
}

.icon-btn-proceed-container {
  @apply bg-white p-1 rounded-full;
}

.icon-btn-proceed {
  @apply text-black;
}

.btn-back:disabled {
  @apply hidden;
}
.btn-proceed:disabled {
  @apply hidden;
}
</style>
