<template>
  <div>
    <div>
      <TextField
      v-model="agendaItem.content.questionTitle"
      placeholder="Type question here"
      color="priorb-300"
    />
    <TextField
      v-model="agendaItem.content.description"
      placeholder="Add description (optional)"
      color="gray-50"
      class="text-sm align-middle py-3"
    />
    </div>
    <div
      class="flex items-center text-gray-700 border rounded-md px-2 py-1 border-black w-fit text-sm mt-2"
    >
      <Icon icon="bi:info-circle" class="text-xl me-2" />
      {{ "Users can answer up to " + textLength + " characters (" + Math.round(textLength / 100) + " paragraphs)" }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'
const agendaItem = defineModel()
const props = defineProps({
  textLength: Number
})
agendaItem.value = initAgendaItem('textarea', agendaItem.value, props?.textLength)
</script>

<style scoped>
.remove-option {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

</style>
