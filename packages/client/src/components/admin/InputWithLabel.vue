<template>
  <div class="flex flex-col w-full items-start justify-end gap-1.5">
    <label :for="id" class="text-sm text-gray-700">{{ label }}</label>
    <input
      :class="withIcon ? 'pr-10' : ''"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      autocomplete="off"
      :disabled="disabled"
      v-model="model"
      :defaultValue="defaultValue"
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground "
    />
    <slot></slot>
  </div>
</template>

<script setup>


const props = defineProps({
  id: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  disabled: Boolean,
  label: String,
  withIcon: Boolean,
  defaultValue: [String, Number]
})

const model = defineModel()
</script>

<style scoped>
</style>
