<template>
  <div class="w-full text-lg flex flex-col">
    <div class="py-2 text-pretty break-words">
      <div
        v-if="content?.questionTitle || content?.title"
        class="border-l-4 border-priorb-100 ps-4 font-semibold"
      >
        <span v-html="content.questionTitle || content.title"></span>
      </div>
      <div
        v-if="content?.questionDescription || content?.description"
        class="text-sm text-gray-700 mt-4"
      >
        <span
          v-html="content.questionDescription || content.description"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

defineProps({
  content: {
    type: Object,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped></style>
