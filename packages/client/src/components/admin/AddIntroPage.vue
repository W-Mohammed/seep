<template>
  <div v-if="content">
      <TextField
      v-model="content.title"
      placeholder="Type question here"
      color="gray-50"
    />
      <div class="px-2">
    <PellEditor v-model="content.body" />    
      </div>
  </div>
</template>
<script setup>
import { defineProps, ref, watch } from 'vue'
import PellEditor from '@/components/admin/PellEditor.vue'
import TextField from '@/components/admin/TextField.vue'
const content = defineModel()
</script>

<style scoped></style>
