<script setup>
import { cn } from '@/lib/utils'

const props = defineProps()
</script>

<template>
  <thead :class="cn(props.class)">
    <slot />
  </thead>
</template>
