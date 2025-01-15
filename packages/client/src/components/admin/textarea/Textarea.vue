<script setup>
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

/**
 * Props definition:
 * @property {string} [class] - CSS class for the component.
 * @property {string|number} [defaultValue] - The default value for the input.
 * @property {string|number} [modelValue] - The bound value for v-model.
 */
 const props = defineProps({
  class: String,
  defaultValue: [String, Number],
  modelValue: [String, Number],
})

const emits = defineEmits({
  'update:modelValue': (payload) => typeof payload === 'string' || typeof payload === 'number',
})

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <textarea v-model="modelValue" :class="cn('flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', props.class)" />
</template>
