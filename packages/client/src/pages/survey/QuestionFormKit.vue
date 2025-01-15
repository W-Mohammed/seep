<template>
  <div class="container flex flex-col max-w-[80ch]">
    <QuestionBlock
      v-if="content?.questionTitle"
      :content="content"
      class="mb-8"
    />
    <FormKit
      v-if="questionToformKitSchema"
      ref="surveyForm"
      type="form"
      v-model="currentPageValue"
      :actions="false"
      class="w-full"
    >
      <FormKitSchema  v-if="questionToformKitSchema" :schema="questionToformKitSchema" />
    </FormKit>
  </div>
</template>

<script setup>
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import { FormKitSchema } from '@formkit/vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import {makeFormKitQuestion} from '@/lib/formKitUtils'

const props = defineProps({
  viewId: String,
  pageId: String,
  content: Object
})

const expertStore = useExpertStore()
const { currentPageValue } = storeToRefs(expertStore)
const { setCurrentQuestionCompleted } = expertStore
const surveyForm = ref(null)

const questionToformKitSchema = computed(() => {
  if (!props.content?.questionType) return null 
  return makeFormKitQuestion(props.content, props.pageId)
})

// @ts-expect-error incomplete FormKit types
const isValid = computed(() => surveyForm?.value?.node?.context.state.valid)

watch(isValid, setCurrentQuestionCompleted)
</script>

<style scoped>
/*  select label that are not inline-flex */
:deep(label:not(.inline-flex)),
:deep(legend) {
  @apply ps-4 border-l-4 border-priorb-50 py-2 text-black;
  color: black !important;
}
:deep(.group) {
  padding-left: 0;
  border-left: none;
}

:deep(.formkit-inner),
:deep(.formkit-message) {
  margin-left: 14px !important;
  max-width: 60ch;
  @apply grow w-fit;
}

/* make input type number and text shorter */
:deep(input[type='number']) {
  max-width: 15ch !important;
  width: 15ch;
}
:deep(input[type='text']) {
  @apply w-[30ch] sm:w-[40ch] md:w-[50ch] lg:w-[60ch] xl:w-[80ch];
}
:deep(.formkit-outer){
  margin-bottom: 20px;
}
:deep(li) {
  list-style-type: none ;
}
:deep(ul) {
  padding-left: 0 !important;
}

/* make input type number and text shorter */
:deep(.group) {
  padding-left: 0;
  border-left: none;
  margin-bottom: 1rem;
}
:deep(input[type="number"]) {
  max-width: 15ch !important;
  width: 15ch;
}
:deep(input[type="text"]) {
  @apply w-[30ch] sm:w-[40ch] md:w-[50ch] lg:w-[60ch] xl:w-[80ch];
}

:deep(textarea){
  @apply w-[80ch] focus:rounded-sm focus:outline-none  focus-visible:ring-2 focus-visible:ring-priorb-100;
}
</style>
