<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 rounded py-2',
        sm: 'h-9 rounded px-3',
        lg: 'h-11 rounded px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const props = defineProps({
  as: {
    type: String,
  },
  variant: {
    type: String,
  },
  size: {
    type: String,
  },
})
</script>

<template>
  <component :is="as" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')">
    <slot />
  </component>
</template>
