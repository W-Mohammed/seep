<script setup>
import { computed, useSlots } from 'vue'
import { SelectValue } from 'radix-vue'

const props = defineProps()
const slots = useSlots()

const htmlContent = computed(() => {
  const slotContent = slots.default ? slots.default().map(el => el.children).join('') : ''
  return slotContent
})
</script>

<template>
  <SelectValue v-bind="props">
    <span v-if="htmlContent" v-html="htmlContent"></span>
    <slot v-else />
  </SelectValue>
</template>
