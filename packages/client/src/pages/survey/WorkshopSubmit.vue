<template>
  <div class="flex flex-col items-center justify-center md:mt-10 lg:mt-30 pb-24">
    <div class="max-w-60ch border p-4 sm:rounded border-gray-400">
      <div class="text-2xl pt-4 text-center font-bold break-words text-pretty">
        
        <div>
          {{ currentPage?.content?.title ?? 'Ready to submit your responses?' }}
        </div>
      </div>
      <div class="p-4">
        <div class="flex flex-col gap-4 text-center break-words text-pretty">
          <p class="text-lg">
            {{ currentPage?.content?.body ?? 'You have completed all the questions. Are you ready to submit your responses?' }}
          </p>
          <p class="inline">
            <span class="inline">
              <Icon icon="bi:exclamation-triangle" class="pb-1 text-lg inline-block text-gray-900" />
              {{ currentPage?.content?.note ?? "Note: You won't be able to change your responses afterwards.." }}
            </span>
          </p>
        </div>
      </div>
      <div class="flex justify-center py-2">
        <button v-if="!loading" class="w-40 mt-2 px-1.5 text-white text-sm flex hover:opacity-90 items-center py-3 text-md bg-priorb-primary" @click="submitProxy()">
          Submit
        </button>
        <button
          v-else
          disabled
          class="inline-flex items-center justify-center h-11 rounded-md px-8 w-40 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Icon icon="radix-icons:reload" class="w-4 h-4 mr-2 animate-spin" />
          Sending...
        </button>
        <SubmitAnywayDialog
        :confirm="confirmSubmit"
          v-model="confirmIfNotComplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useExpertStore } from '@/store/expertStore'
import { useRouter } from 'vue-router'
import SubmitAnywayDialog from '@/components/survey/SubmitAnywayDialog.vue'
import { storeToRefs } from 'pinia'

const expertStore = useExpertStore()
const { currentPage } = storeToRefs(expertStore)
const router = useRouter()
const confirmIfNotComplete = ref(false)
const loading = ref(false)
const uncompletedItems = ref(expertStore.getUncompletedItemIndices)
const submitProxy = async () => {
  if (uncompletedItems?.value?.length > 0) {
    confirmIfNotComplete.value = true
    return
  } else {
    confirmSubmit()
  }
}

const confirmSubmit = async () => {
  loading.value = true
  await expertStore.postLockSurvey()
}
</script>

<style scoped></style>
