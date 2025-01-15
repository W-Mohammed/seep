<script setup>
import { computed } from 'vue'
import { DialogDescription } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogDescription
    :class="cn('text-sm text-muted-foreground', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogDescription>
</template>
