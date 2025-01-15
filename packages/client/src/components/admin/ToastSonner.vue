<script  setup>
import { Toaster as ToastSonner } from 'vue-sonner'

const props = defineProps()
</script>

<template>
  <ToastSonner
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-black-foreground',
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
      }
    }"
  />
</template>
