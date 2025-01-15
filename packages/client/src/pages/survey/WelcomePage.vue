<template>
  <div class="container">
    <div class="max-w-[65ch] mx-auto break-words text-pretty">
      <div class="mb-4">
        <div 
        v-if="currentPage?.content?.title"
        class="text-3xl font-light text-priorb-SECONDARY">
          {{ currentPage.content.title }}
        </div>
      </div>

      <div v-if="currentPage?.content?.body != null">
        <div v-html="currentPage.content.body"></div>
      </div>

      <div v-else>
        <p>Thank you for taking the time to participate in this survey!</p>
        <p>
          The survey contains a series of questions to collect your expert opinions and judgements.
        </p>
        <p>
          Please note, you can pause the survey at any time &ndash; just use the 'Pause' button at
          the top of the page and you can return to the survey later. Once you've answered all the
          questions, you can submit your responses on the final page.
        </p>
        <div class="mt-6 mb-2 border p-4 rounded-lg border-gray-700">
          If you have any questions or encounter any issues, please feel free to contact the study
          coordinator {{ studyContact?.name
          }}{{ studyContact?.organisation ? ', ' + studyContact?.organisation : '' }} at
          <a class="text-priorb-500 underline" :href="'mailto:' + studyContact.email">{{
            studyContact.email
          }}</a
          >.
        </div>
        <div class="text-gray-700 text-sm pt-4">
          To start the survey, click the 'Continue' button below.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { sharedPropsJs } from '@/lib/utils'
defineProps(sharedPropsJs)

import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
const expertStore = useExpertStore()
const { expertName, studyContact, studyName, studyDescription, currentPage } = storeToRefs(expertStore)
</script>

<style scoped>
p {
  margin-top: 1.2rem;
  font-size: 1.15rem;
}
</style>
