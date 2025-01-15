<template>
  <router-link
    :to="{
      name: to,
      params
    }"
    :class="
      cn(
        'flex items-center gap-1 p-2 rounded w-fit bg-vGray-100 text-priorb-SECONDARY hover:bg-gray-200',
        props.class
      )
    "
  >
    <Icon v-if="direction === 'left'" icon="bi:chevron-left" class="w-5 h-5" />
    {{ label }}
    <Icon v-if="direction === 'right'" icon="bi:chevron-right" class="w-5 h-5" />
  </router-link>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => ({}) // Default value for params
  },
  direction: {
    type: String,
    default: 'right' // Default value for direction
  },
  class: {
    type: String,
    default: '' // Default value for class
  }
})
</script>
