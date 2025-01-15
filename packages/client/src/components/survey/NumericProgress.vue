<template>
  <div class="whitespace-nowrap font-light">
    <span class="lg:inline hidden"> </span>
    <span class="whitespace-nowrap">{{ currentProgressIndex }} / {{ maxProgress }}</span>
  </div>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
const { currentProgressIndex, maxProgress } = storeToRefs(useExpertStore())
</script>

<style scoped></style>
