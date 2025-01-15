<script setup>
import { computed } from 'vue'
import { DialogDescription, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
