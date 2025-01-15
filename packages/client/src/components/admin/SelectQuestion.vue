<template>
    <div class="w-full mt-6  overflow-y-auto h-full">
        <div class="h2 mb-2 text-sm text-gray-900">Questions:</div>



        <div class="question-radio-btns">
          <div
            v-for="(question, qIndex) in agenda"
            :key="question.pageId"
            class="flex items-center border-b"
          >
            <input
              :key="question.pageId"
              type="radio"
              :id="question.pageId"
              :value="question._id"
              v-model="selectedQuestion"
              :disabled="!question.isQuestion && !question.isValidation"
            />
            <label
              :for="question.pageId"
              class="flex items-center w-full cursor-pointer hover:bg-priorb-100 bg-white h-12  flex  overflow-hidden relative text-gray-700"
          :title="
          !question.isQuestion ? 'This is not a question' :
          (question?.labelAlt2 ? qIndex + 1 + ' ' + question.labelAlt2 : question.labelAlt1)
          " 
            >

            
          <div
            class="text-xs flex flex-col overflow-hidden overflow-hidden w-full flex flex-col"
          >
            <div
              class="text-sm text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ question.labelAlt1 }}
            </div>
            <div class="text-ellipsis overflow-hidden whitespace-nowrap">
              {{ question.labelAlt2 }}
            </div>
          </div>

          <Icon icon="bi:chevron-right" class="ms-auto text-lg bg-inherit" />
        
              
            </label>
          </div>
        </div>
      </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
const adminStore = useAdminStore()
defineProps({
    agenda: Array,
})
const selectedQuestion = defineModel()
</script>

<style scoped>
.question-radio-btns input[type='radio'] {
  display: none;
}

.question-radio-btns input[type='radio']:checked + label,
.Checked + label {
  @apply bg-priorb-50;  
}

.question-radio-btns label {
  padding: 8px 4px;
  cursor: pointer;
  line-height: 1.4;
}

/* disabled state */
.question-radio-btns input[type='radio']:disabled + label {
  @apply opacity-50;
  @apply text-gray-400;
  cursor: not-allowed;
}

.question-radio-btns input[type='radio']:disabled + label:hover {
  @apply bg-white;
}


</style>