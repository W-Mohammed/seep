<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

defineProps({
  variant: {
    type: String,
  },
})

const badgeVariants = cva(
  'inline-flex items-center rounded border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground ',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-400 text-white',
        'default-sm': 'border-transparent bg-primary text-primary-foreground text-xs',
        'clear-sm': 'border-transparent text-primary-foreground text-xs',
        'clear-round-sm': 'border-transparent text-primary-foreground text-xs rounded-full px-3',
        'clear-md': 'border-transparent text-primary-foreground text-sm',
        'clear-lg': 'border-transparent text-primary-foreground text-base',
      }
    },
    defaultVariants: {
      variant: 'clear-sm',
    },
  }
)

</script>

<template>
  <div :class="cn(badgeVariants({ variant }), $attrs.class ?? '')">
    <slot />
  </div>
</template>
