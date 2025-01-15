<template>
  <div class="container flex flex-col justify-center items-center">
    <div style="margin: 15vh 0" class="max-w-xl">
      <div class="font-light text-xl">
        Sorry, we couldn't find the page you were looking for...
      </div>
      <div>
        <div v-if="errorMsg" class="text-gray-500 text-sm">
          <div class="mt-5 text-xs pb-0.5 ps-0.5">What went wrong?</div>
          <div class="bg-red-50 px-2 rounded font-mono py-1 fw-bold d-inline-block leading-tight">Error: {{ errorMsg }}</div>
        </div>
      </div>
      <div class="text-start mt-8 text-sm">
        Support:
              <a :href="`mailto:${contactEmail}`" class="underline text-priorb-500">{{ contactEmail }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import {storeToRefs} from 'pinia'
const expertStore = useExpertStore()
const {errorMsg} = storeToRefs(expertStore)
import { ref } from 'vue'
const contactEmail = ref('support@priorb.com')
</script>

<style scoped>
li {
  margin-bottom: 0.25rem;
  list-style-type: disc;
  margin-left: 1.5rem;
}
</style>
