<template>
  <div class="w-full bg-priorb-200">
    <div class="bg-priorb-primary h-2 transition-all duration-50" :style="{ width: `${progressPercent}%` }"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  progressPercent: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped></style>
