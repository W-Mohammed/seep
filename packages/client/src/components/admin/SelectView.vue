<template>
  <div class="w-full text-sm text-gray-900 mt-6">Filter view:</div>
  <div class="flex items-center space-x-2">
    <input type="radio" id="pooled" value="pooled" v-model="togglePooled" />
    <label for="pooled" class="">Pooled</label>
  </div>
  <div class="flex items-center space-x-2">
    <input type="radio" id="expert" value="expert" v-model="togglePooled" />
    <label for="expert" class="">Expert</label>
  </div>
</template>

<script setup>
const togglePooled = defineModel()
</script>

<style scoped>
input[type='radio'] {
  accent-color: theme('colors.priorb.500');
  color: theme('colors.priorb.500');
  border-color: theme('colors.priorb.500');
  border: 1px solid theme('colors.priorb.500');
}
input[type='radio'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  outline: none;
  border: 2px solid gray;
}

input[type='radio']:before {
  content: '';
  display: block;
  width: 80%;
  height: 80%;
  margin: 10% auto;
  border-radius: 50%;
}

input[type='radio']:checked:before {
  background: theme('colors.priorb.500');
}

input[type='radio']:checked {
  border: 1px solid theme('colors.priorb.500');
}

.control-label {
  cursor: pointer;
  min-width: 60px;
}
</style>
