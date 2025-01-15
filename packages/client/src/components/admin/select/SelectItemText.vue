<script setup>
import { SelectItemText } from 'radix-vue'

const props = defineProps()
</script>

<template>
  <SelectItemText v-bind="props">
    <slot />
  </SelectItemText>
</template>
