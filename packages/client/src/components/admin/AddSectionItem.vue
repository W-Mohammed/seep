<template>
  <div>
    <div>
      <textarea
        rows="1"
        v-model="agendaItem.content.sectionTitle"
        placeholder="Type question here"
        class="text-lg px-2 border-s-4 border-priorb-50 py-2 mb-2 focus:outline-none w-full"
        @keyup="textAreaAdjust"
        @click="textAreaAdjust"
      />
      <textarea
        rows="1"
        v-model="agendaItem.content.sectionDescription"
        placeholder="Add description (optional)"
        class="d-block w-full mb-4 text-sm px-2 py-2 border-s-4 mt-1 focus:outline-none"
        @keyup="textAreaAdjust"
        @click="textAreaAdjust"
      />
    </div>
    <div
      class="flex items-center text-priorb-SECONDARY border rounded-md px-2 py-1 border-priorb-SECONDARY w-fit text-sm mt-2"
    >
      <Icon icon="bi:info-circle" class="text-xl me-2" />
      {{
        'Users can answer up to ' +
        textLength +
        ' characters (' +
        Math.round(textLength / 100) +
        ' paragraphs)'
      }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { initAgendaItem } from '@/lib/addAgendaItemUtils';
import { textAreaAdjust, allTextAreaAdjustOnStart } from '@/lib/utils';
const agendaItem = defineModel();
const props = defineProps({
  textLength: Number,
});
agendaItem.value = initAgendaItem('section', agendaItem.value, { 'textLength': props?.textLength })
allTextAreaAdjustOnStart();
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
