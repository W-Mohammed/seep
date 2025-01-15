<template>
  <div class="container flex flex-col max-w-[100ch]">
    <QuestionBlock
      v-if="content?.questionTitle"
      :content="content"
      class="mb-8"
    />

    <div v-for="(row, rowIndex) in content.rows" :key="rowIndex" v-if="currentPageValue?.response && content">
      <div class="flex flex-col">
        <div
          class="bg-[#F8F8F8] rounded mb-2 flex items-center text-sm py-6 px-6 flex-wrap"
        >
          <div
            class="w-[340px] grow min-w-[50%] me-4 flex gap-1 leading-snug text-gray-900"
          >
            <div>{{ rowIndex + 1 }}.</div>
            <div>
              {{ row }}
            </div>
          </div>

          <div
            class="flex gap-4 justify-between items-center grow py-5"
          >
            <div
              v-for="(column, columnIndex) in content.columns"
              :key="columnIndex"
            >
              <div class="flex items-center">
                <input
                  type="radio"
                  :name="rowIndex"
                  :value="column"
                  :id="'id' + rowIndex + columnIndex"
                  v-model="currentPageValue.response[rowIndex].value"
                  class="me-1"
                />
                <label :for="'id' + rowIndex + columnIndex">{{ column }}</label>
              </div>
            </div>
          </div>
          <div
            v-if="(currentPageValue.response[rowIndex].value === content.columns[1])
            "
            class="w-full"
          >
            <div class="flex flex-col gap-1 justify-between">
              <textarea
                type="text"
                class="px-3 py-2 w-full border border-gray-300 rounded"
                :id="'id' + rowIndex + 0"
                v-model="currentPageValue.response[rowIndex].comment"
                placeholder="Your comment or alternative estimate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QuestionBlock from '@/components/survey/QuestionBlock.vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { MatrixAgendaItem } from '@/models/AgendaClass';

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

watch(
  currentPageValue,
  (value) => {
    const response = currentPageValue.value.response
    if (!response) return
    const columns = props.content.columns
    for (let i = 0; i < response.length; i++) {
      if (!response[i].value) {
        response[i].completed = false
        continue
      }

      // First Option = YES
      if (response[i].value === columns[0]) {
        response[i].completed = true
        continue
      }

      // Second Option = NO or N/A and comment is required
      if (response[i].value === columns[1]) {
        if (!response[i].comment || response[i].comment.trim() === '') {
          response[i].completed = false
          continue
        }
        response[i].completed = true
        continue
      }

      if (columns.length === 3) {
        // Third Option = N/A and comment is required by default but can be optional through a flag
        if (response[i].value === columns[2]) {
          if (props.content.optionalThirdComment) {
            response[i].completed = true
            continue
          } else {
            if (!response[i].comment || response[i].comment.trim() === '') {
              response[i].completed = false
              continue
            }
            response[i].completed = true
            continue
          }
        }
      }
    }
    setCurrentQuestionCompleted(response.every((r) => r.completed))
  },
  { deep: true }
)

MatrixAgendaItem.initialiseResponse(currentPageValue, props);
</script>

<style scoped>

label {
  cursor: pointer;
  min-width: 20px;
}
</style>
