<template>
  <div
    class="loading-overlay rounded-lg inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-10 absolute w-full h-full inset-0"
    :class="{
      hidden: !loadingState,
      flex: loadingState
    }"
  >
    <div class="spinner"></div>
  </div>
</template>

<script setup>
defineProps({
  loadingState: Boolean
})
</script>

<style scoped>
.spinner {
  border: 6px solid rgba(255, 255, 255, 0.1);
  border-left-color: theme('colors.priorb.primary');
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: spin 0.85s linear infinite;
}
</style>
