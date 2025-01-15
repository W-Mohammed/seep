<template>
  <div class="flex gap-2 py-2 mb-2 px-4 mb-2 w-full bg-priorb-white rounded-md">
    <div v-if="currentQuestionNumber">
      <div class="text-sm pb-0.5">
      <span class="font-semibold">
        Question {{ currentQuestionNumber }}
      </span>
      </div>
      <div class="leading-4 text-sm text-gray-700 pe-3" v-if="currentQuestionText" v-html="currentQuestionText">
      </div>
    </div>

    <div v-else class="flex flex-col gap-1 py-3">
      <div class="animate-pulse rounded-md bg-muted h-4 w-[70px]"></div>
      <div class="animate-pulse rounded-md bg-muted h-4 w-[220px]"></div>
    </div>

    <div class="ms-auto flex gap-1 my-auto">
      <button
        class="h-8 w-8 rounded-sm bg-white text-gray-700 flex items-center justify-center border-gray-700 border"
        :disabled="isFirstQuestion"
        @click="handlePreviousQuestion"
      >
        <Icon icon="bi:chevron-left" class="text-xl" />
      </button>

      <button
        class="h-8 w-8 rounded-sm bg-white text-gray-700 flex items-center justify-center border-gray-700 border"
        :disabled="isLastQuestion"
        @click="handleNextQuestion"
      >
        <Icon icon="bi:chevron-right" class="text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
const props = defineProps({
  questions: Array
})

const selectedQuestion = defineModel()

const handleNextQuestion = () => {
  const currentIndex = props.questions.findIndex(
    (question) => question._id === selectedQuestion.value
  )
  const nextQuestion = props.questions[currentIndex + 1]
  const nextQuestionId = nextQuestion?._id
  if (!nextQuestionId) return
  selectedQuestion.value = nextQuestionId
}

const handlePreviousQuestion = () => {
  const currentIndex = props.questions.findIndex(
    (question) => question._id === selectedQuestion.value
  )
  const previousQuestion = props.questions[currentIndex - 1]
  const previousQuestionId = previousQuestion?._id
  if (!previousQuestionId) return
  selectedQuestion.value = previousQuestion?._id
}

const currentQuestionNumber = computed(() => {
  if (!props.questions) return 0
  return props.questions.findIndex((q) => q._id === selectedQuestion.value) + 1
})

const currentQuestionName = computed(() => {
  const currentQuestion = props.questions.find(
    (question) => question._id === selectedQuestion.value
  )
  return currentQuestion.pageId || selectedQuestion.value;
})
const currentQuestionText = computed(() => {
  const currentQuestion = props.questions.find(
    (question) => question._id === selectedQuestion.value
  )
  return currentQuestion?.content?.questionTitle || currentQuestion?.content?.title || 'No question text'
})

const questionsLength = computed(() => {
  return props.questions?.length || 0
})

const isFirstQuestion = computed(() => {
  return currentQuestionNumber.value === 1
})

const isLastQuestion = computed(() => {
  return currentQuestionNumber.value === questionsLength.value
})
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}
</style>
