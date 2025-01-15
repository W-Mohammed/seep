<template>
  <div class="task-instructions-container w-full">
    <div
      id="rationaleLabel"
      class="bg-priorb-100 text-priorb-500 text-xs px-2 py-1 rounded-sm inline-block mb-2"
    >
      Rationale
    </div>
    <div class="border-priorb-100 border-l-4 ps-2 pt-1">
    {{ content?.rationaleInstructions ?? 'After placing your chips, please provide a brief explanation for your choices and any additional comments.' }}
    </div>
    <div>
      <textarea
        id="rationale"
        aria-labelledby="rationaleLabel"
        class="w-full mt-4 rounded-lg border px-2 py-1"
        rows="4"
        :placeholder="content?.rationalePlaceholder"
        v-model="value"
        :class="{ 'border-red-500': showStatus && !value && required }"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
const value = defineModel()

defineProps({
  responses: Object,
  content: Object,
  showStatus: Boolean,
  required: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped></style>
