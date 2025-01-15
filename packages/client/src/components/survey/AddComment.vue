<template>
  <div class="ms-auto container max-w-[90ch] flex flex-col justify-end items-end"
  v-if="showCommentField"
  :class="{
  'pointer-events-none': !surveyGoingOn
  }"
  >
    <div
    v-if="hasComment"
      class="mx-auto rounded border min-h-[100px] w-full flex flex-col  items-stretch justify-center max-w-[100ch] border-gray-300 p-2 ms-auto mt-4"
    >
    <div class="flex pb-2 items-center gap-1 ps-2">
    <Icon icon="la:comment" class="text-2xl text-gray-500" />
    <div class="font-medium text-gray-700">Notes</div>

    <div class="flex ms-auto gap-4 px-2">
    <Icon icon="bi:trash" class="text-xl text-gray-500 cursor-pointer" title="Delete comment" @click="deleteComment()" />
    
    </div>
    </div>
    <div class="leading-tight px-2 text-gray-700 text-xs pb-1">
    Use this space to add any additional comments or notes.
  </div>
     <div class="w-full grow px-0.5">
     <textarea
        class="w-full bg-[#F8F8F8] p-2 focus:outline-none rounded focus:bg-white"
        ref="commentField"
        rows="4"
        v-model="currentPageValue.comment"
        />
    </div>
  </div>
    <div
    v-else-if="showCommentField && surveyGoingOn"
      class="ms-auto flex gap-1 items-center hover:opacity-80 cursor-pointer"
      @click="addComment()"
    >
      <div
        class="rounded-full border-priorb-primary w-4 h-4 flex items-center justify-center border"
      >
        <Icon icon="bi:plus" class="text-2xl text-priorb-primary" />
      </div>
      <span class="text-priorb-primary font-semibold text-sm">Add Comment</span>

    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
const expertStore = useExpertStore();
const { currentPageValue, surveyGoingOn, currentPageIndex, showCommentField } = storeToRefs(expertStore);
const commentField = ref(null);
const addComment = () => {
    if (!currentPageValue || !currentPageValue.value) return;
    currentPageValue.value.comment = '';
    setTimeout(() => {
      commentField.value.focus();
    }, 0);
};
const hasComment = computed(() => {
    if(!currentPageValue || !currentPageValue.value) return false;
  return currentPageValue.value.comment != null;
});

const deleteComment = () => {
    if (!currentPageValue || !currentPageValue.value) return;
  confirm('Are you sure you want to delete this comment?') &&
    (currentPageValue.value.comment = null);
};

watch(currentPageIndex, () => {
  if (currentPageValue.value?.comment?.trim() === '') {
    currentPageValue.value.comment = null;
  }
});

</script>

<style scoped></style>
