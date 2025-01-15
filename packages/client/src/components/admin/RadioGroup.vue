<template>
  <RadioGroupRoot v-model="model.value">
    <RadioGroupItem v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
      <RadioGroupIndicator />
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<script setup>
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'radix-vue'
defineProps(['options'])
const model = defineModel()
</script>
