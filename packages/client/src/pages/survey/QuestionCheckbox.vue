<template>
  <div class="container flex flex-col items-center justify-start max-w-[80ch]">
    <QuestionBlock
      v-if="content?.questionTitle"
      :content="content"
      class="mb-8"
    />
    <div  v-if="currentPageValue?.response && content" class="flex flex-col justify-start items-start gap-4 w-full">
      <label
        v-for="(option, index) in content.options"
        :for="'option' + index"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            :id="'option' + index"
            name="checkbox"
            :value="option.label"
            v-model="currentPageValue.response.selected"
          />
          <div class="ms-3 text-base">
            {{ option.label }}
          </div>
        </div>
      </label>
      <label v-if="content.other" for="optionOther">
        <div class="flex items-center">
          <input
            type="checkbox"
            id="optionOther"
            name="checkbox"
            value="Other"
            v-model="currentPageValue.response.isOtherSelected"
            @change="toggleOther"
          />
          <div class="ms-3 text-base">Other</div>
        </div>
      </label>
      <div v-if="currentPageValue.response.isOtherSelected" class="items-center w-full py-2 px-3 rounded border bg-white formkit-inner focus-within:ring-1 focus-within:!ring-priorb-50 focus-within:!border-priorb-500">
        <input
        v-model="currentPageValue.response.other"
        @input="checkOtherValidity"
        class="w-full text-base text-neutral-700 grow placeholder:text-neutral-400 formkit-input border-none p-0 focus-visible:outline-none"
        placeholder="Please specify"
      ></input>
      </div>
      <p v-if="!isOtherUnique" class="text-red-500 text-sm mt-1">
        This option is already available in the list.
      </p>
      <br>
      <div class="mt-10 flex flex-col gap-2 w-full" v-if="content.showComment">
        <div class="gap-2 inline-flex">
          <div class="w-1 h-6 bg-priorb-100"></div>
          <div class="text-[#2b2b2b] text-base font-semibold font-['Inter']">
            Additional Comments (optional)
          </div>
        </div>
        <textarea
          v-model="currentPageValue.response.comment"
          class="w-full h-24 px-4 py-2 mt-2 border border-gray-300 rounded font-normal focus-none"
          placeholder="Please provide any additional comments here"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { CheckboxAgendaItem } from '@/models/AgendaClass';

const props = defineProps({
  viewId: String,
  pageId: String,
  questionId: String,
  options: Object,
  content: Object,
})

const expertStore = useExpertStore()
const { currentPageValue } = storeToRefs(expertStore)
const { setCurrentQuestionCompleted } = expertStore

CheckboxAgendaItem.initialiseResponse(currentPageValue, props)

const isOtherUnique = ref(true)
const isValid = computed(() => {
  const hasSelectedOptions = currentPageValue.value.response.selected.length > 0
  const hasValidOtherText =
    currentPageValue.value.response.isOtherSelected &&
    currentPageValue.value.response.other &&
    isOtherUnique.value

  // Return true only if:
  // - There are selected options and "Other" is either not selected or has valid text
  // - OR, "Other" is selected with valid text and no other options are selected
  return (
    (hasSelectedOptions && (!currentPageValue.value.response.isOtherSelected || hasValidOtherText)) ||
    (!hasSelectedOptions && hasValidOtherText)
  )
})

function toggleOther() {
  if (!currentPageValue?.response?.isOtherSelected) {
    currentPageValue.value.response.other = ''
    isOtherUnique.value = true
  }
}

watch(isValid, setCurrentQuestionCompleted)

function checkOtherValidity() {
  const otherText = currentPageValue.value.response.other?.trim().toLowerCase()
  isOtherUnique.value = !props.content.options.some(
    (option) => option.label.toLowerCase() === otherText
  )
}

</script>

<style scoped>
</style>
