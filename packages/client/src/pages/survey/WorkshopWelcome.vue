<template>
  <div class="container">
    <div class="max-w-[65ch] mx-auto break-words text-pretty">
      <div class="mb-4">
        <div 
        v-if="currentPage?.content?.title"
        class="text-4xl font-medium text-priorb-primary text-center mt-10 mb-10">
          {{ currentPage.content.title }}
        </div>
      </div>
      <div v-if="currentPage?.content?.body " class="text-center">
        <div v-html="currentPage.content.body"></div>
      </div>

<!-- start the workshop button -->
      <div class="flex justify-center mt-24">
        <button
          class="btn btn-primary  bg-black text-white w-20 h-10 rounded-lg font-semibold hover:bg-gray-800"
          @click="goToNextPageProxy"
        >
          Start
        </button>
        </div>
      
    </div>
  </div>
</template>

<script setup>
import { sharedPropsJs } from '@/lib/utils'
import { onBeforeUnmount } from 'vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
defineProps(sharedPropsJs)
const expertStore = useExpertStore()
const { expertName, studyContact, studyName, studyDescription, currentPage } = storeToRefs(expertStore)
expertStore.hideNavBtns = true
onBeforeUnmount(() => {
  expertStore.hideNavBtns = false
})
const goToNextPageProxy = () => {
  expertStore.goToNextPage()
}
</script>

<style scoped>
p {
  margin-top: 1.2rem;
  font-size: 1.15rem;
}
</style>
