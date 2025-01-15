<template>
  <div class="flex flex-col max-w-[100ch] my-12" v-if="currentComments.length">
    <h1 class="text-xl font-semibold">
      Comments ({{ currentComments.length }})
    </h1>

    <div class="pt-2 ps-4">
      <div
        v-for="(comment, index) in currentComments"
        :key="index"
        class="mb-4 w-full border border-gray-300 rounded hover:bg-gray-50"
      >
        <div class="w-full">
          <div class="px-2 py-1 leading-snug text-sm">
            <div class="leading-tight font-medium">
              {{ comment.expert }}
            </div>
            <div class="text-gray-700 mt-0.5">{{ comment.comment }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentActiveExperts: Array,
  selectedQuestion: String,
});

const currentComments = computed(() => {
  const comments = [];
  props.currentActiveExperts?.forEach((expert) => {
    if(expert.ignoreQuestions?.includes(props.selectedQuestion)) return;
    const currentResp = expert?.responses?.find(
      (resp) => resp.questionId === props.selectedQuestion
    );
    if (currentResp?.value?.comment) {
      comments.push({
        expert: expert.name,
        comment: currentResp.value.comment,
      });
    }
  });
  return comments;
});
</script>

<style scoped></style>
