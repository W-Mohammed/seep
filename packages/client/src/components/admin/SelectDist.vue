<template>
  <SelectBase v-model="selectedModel">
    <SelectTrigger
      class="border-gray-100 focus:ring-0 focus:ring-none focus:ring-offset-1 border-gray-200  py-1 h-8 ms-auto me-0 min-w-[200px] w-fit"
    >
      <SelectValue placeholder="Select Model" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="(model, i) in MODELS" :key="i" :value="model.value" :disabled="model.disabled">
          {{ model.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </SelectBase>
</template>

<script setup>
import {
  SelectBase,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/admin/select'

defineProps({
  viewFitted: Boolean
})
const selectedModel = defineModel()
const MODELS = [
  {value: 'best', label: 'Best fitting model'},
  {value: 'normal', label: 'Normal'},
  {value: "t", label: 'Student t'},
  {value: "skewnormal", label: 'Skew normal'},
  {value: "gamma", label: 'Gamma'},
  {value: "log.normal", label: 'Log normal', disabled: true},
  {value: "logt", label: 'Log student t', disabled: true},
  {value: "beta", label: 'Beta'},
  {value: "mirrorgamma", label: 'Mirror gamma'},
  {value: "mirrorlogt", label: 'Mirror log t'},
  { value: "mirrorlognormal", label: 'Mirror log normal' },
]
</script>

<style scoped>
select {
  width: 100%;
  padding: 0.375rem 0.375rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}
select:focus {
  @apply outline-priorb-200;
}
select:disabled {
  @apply bg-gray-100 text-gray-500;
  @apply cursor-not-allowed;
}
/* move the chevron to the left */
select::-ms-expand {
  display: none;
}
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
