<template>
  <div class="flex items-center gap-6 p-4 bg-gray-50 rounded-lg shadow-lg justify-around">
    <div class="flex flex-col items-start gap-1">
      <div class="flex items-center gap-2">
        <label :for="count" class="font-semibold text-lg text-gray-700">Value {{ count }} </label>
        <input
          :id="count"
          type="number"
          :value="value"
          @input="onValueInput"
          :step="step"
          class="input-style"
        />
      </div>
      <span class="error-message">{{ valueError }}</span>
    </div>

    <div class="flex flex-col items-start gap-1">
      <div class="flex items-center gap-2">
        <label for="probability" class="font-semibold text-lg text-gray-700"> {{ label }} </label>
        <input
          type="number"
          id="probability"
          min="0"
          max="100"
          :value="probability"
          @input="onProbabilityInput"
          step="0.1"
          class="input-style"
        />
        <span class="probability-display">%</span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  value: Number,
  probability: Number,
  step: 0.01,
  label: String,
  count: Number
})
const emit = defineEmits(['update:value', 'update:probability'])

// Error messages based on custom conditions
const valueError = computed(() => {
  return ''; // To be used if needed
})

const onValueInput = (event) => {
  const newValue = Number(event.target.value)
  emit('update:value', newValue)
}

const onProbabilityInput = (event) => {
  const newProbability = Number(event.target.value)
  emit('update:probability', newProbability)
}
</script>

<style scoped>
.input-style {
  padding: 0.75em 1em;
  border: 2px solid #ddd;
  border-radius: 6px;
  width: 100px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-style:focus {
  border-color: #4a90e2;
  outline: none;
}

.slider-style {
  width: 150px;
  accent-color: #4a90e2;
}

.probability-display {
  font-weight: bold;
  font-size: 1.1rem;
  color: #4a90e2;
}

.error-message {
  font-size: 0.875rem;
  color: #e53e3e;
  margin-top: 0.25rem;
}
</style>
