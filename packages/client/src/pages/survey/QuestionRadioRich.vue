<template>
  <div class="container flex flex-col items-center justify-start max-w-[80ch]">
    <QuestionBlock
      v-if="content?.questionTitle"
      :content="content"
      class="mb-8"
    />
    <div class="flex flex-col justify-start items-start gap-4 w-full" v-if="currentPageValue?.response && content">
      <label
        v-for="(option, index) in content.options"
        :for="'option' + index"
        :class="
          currentPageValue.selected == option.title
            ? 'border-priorb-primary'
            : 'border-gray-300'
        "
      >
        <div class="flex items-center">
          <input
            type="radio"
            :id="'option' + index"
            name="radiorich"
            :value="option.title"
            v-model="currentPageValue.response.selected"
          />
          <div class="ms-3 text-base font-semibold">
            {{ option.title }}
          </div>
        </div>
        <div
          class="ps-8 mt-1 leading-snug text-gray-700 whitespace-normal break-words"
          v-if="option.description"
        >
          {{ option.description }}
        </div>
      </label>

      <div class="mt-10 flex flex-col gap-2 w-full" v-if="content.showComment">
        <div class="gap-2 inline-flex">
          <div class="w-1 h-6 bg-priorb-100"></div>
          <div class="text-[#2b2b2b] text-base font-semibold font-['Inter']">
            Additional Comments (optional)
          </div>
        </div>
        <textarea
          v-model="currentPageValue.response.comment"
          class="w-full h-24 px-4 py-2 mt-2 border border-gray-300 rounded font-normal"
          placeholder="Please provide any additional comments here"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import QuestionBlock from '@/components/survey/QuestionBlock.vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { RadioRichAgendaItem } from '@/models/AgendaClass';

const props = defineProps({
  viewId: String,
  pageId: String,
  questionId: String,
  options: Object,
  content: Object,
});
const expertStore = useExpertStore();
const { currentPageValue } = storeToRefs(expertStore);
const { setCurrentQuestionCompleted } = expertStore;

RadioRichAgendaItem.initialiseResponse(currentPageValue, props);

const isValid = computed(() => currentPageValue.value.response.selected !== null);

watch(isValid, setCurrentQuestionCompleted);
</script>

<style scoped>
input[type='radio'] {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
label {
  @apply px-6 py-4 rounded-lg border cursor-pointer  w-full;
}
</style>
