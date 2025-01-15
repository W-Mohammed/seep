<template>
  <div class="container max-w-[80ch]" v-if="currentPageValue?.response">
    <QuestionBlock
      v-if="content?.questionTitle"
      :content="content"
      class="mb-8"
    />
    <!-- radio btn block block -->
    <div class="w-full">
      <!-- end labels -->
      <div class="flex py-2 gap-2 justify-between sm:justify-evenly">
        <div v-for="(option, index) in content?.options" :key="index">
          <div
            v-if="option?.description"
            class="font-normal text-gray-700 leading-4 whitespace-pre-wrap"
            :class="
              index === 0
                ? 'text-start'
                : index === content.options.length - 1
                  ? 'text-right'
                  : 'text-center'
            "
          >
            {{ option.description }}
          </div>
        </div>
      </div>
      <!-- buttons -->
      <div class="flex flex-col items-center">
        <div
          class="w-fit flex flex-col items-start w-full"
          :style="'max-width: ' + content?.options?.length * 90 + 'px;'"
        >
          <div class="flex justify-center pb-4 mb-4 w-full mx-auto px-0 md:px-4">
            <label
              v-for="(option, index) in content?.options"
              :key="index"
              :for="'option' + index"
              class="cursor-pointer w-full w-max-[70px] items-center justify-center flex flex-col"
            >
              <input
                type="radio"
                :id="'option' + index"
                name="radiolikert"
                :value="option.title"
                v-model="currentPageValue.response.selected"
                class="hidden"
              />
              <div
                :class="[
                  currentPageValue.response.selected === option.title
                    ? 'bg-priorb-100 border-priorb-600 text-black'
                    : 'bg-transparent text-gray-700 border-gray-400'
                ]"
                class="p-2.5 rounded border flex items-center justify-center font-semibold mt-auto transition-colors duration-100 w-[48px] h-[45px] md:w-[57px] md:h-[54px]"
              >
                {{ option.title }}
              </div>
            </label>
          </div>
          <!-- no response opt -->
          <div class="flex items-center gap-1.5 cursor-pointer leading-tight ps-1" v-if="content.showNoResponse">
            <input
              type="radio"
              id="noresponse"
              name="radiolikert"
              value="No Response"
              v-model="currentPageValue.response.selected"
            />
            <label for="noresponse" class="text-gray-800 font-semibold">
              No response
            </label>
          </div>
        </div>
      </div>
    </div>
    <!-- comment block -->
    <div
      class="mt-20 flex flex-col gap-2 w-full"
      v-if="content?.showComment"
    >
        <div class="border-s-4 border-priorb-100 ps-4 font-semibold">
          Additional Comments (optional) 
      </div>
      <textarea
        v-model="currentPageValue.response.comment"
        :rows="3"
        class="w-full px-4 py-2 mt-2 border border-gray-300 rounded font-normal"
        placeholder="Please provide any additional comments here"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import QuestionBlock from '@/components/survey/QuestionBlock.vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { RadioLikertAgendaItem } from '@/models/AgendaClass';

import { sharedPropsJs } from '@/lib/utils';
const props = defineProps(sharedPropsJs);
const expertStore = useExpertStore();
const { currentPageValue } = storeToRefs(expertStore);
const { setCurrentQuestionCompleted } = expertStore;

RadioLikertAgendaItem.initialiseResponse(currentPageValue, props);

const isValid = computed(
  () => currentPageValue.value.response.selected !== null
);

watch(isValid, setCurrentQuestionCompleted);
</script>

<style scoped></style>
