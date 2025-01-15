<script setup>
import { Primitive } from 'radix-vue'
import { buttonVariants } from '.'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
