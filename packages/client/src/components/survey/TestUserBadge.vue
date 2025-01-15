<template>
  <div
    :class="{ hidden: expertId !== 'test' || hideTestUserMsg }"
    style="position: absolute; top: 48px"
    class="text-center text-sm font-light text-white px-2.5 py-1 right-1/2 transform translate-x-1/2 z-50 rounded-b min-w-[300px] bg-priorb-secondary flex items-center leading-4 opacity-85"
  >
    <Icon icon="ic:baseline-warning" class="inline-block text-white text-xl me-1 pb-0.5" />

    Review mode – data will not be saved
    <!-- <Icon
      icon="bx:bx-x"
      class="cursor-pointer text-xl hover:text-gray-300 ms-auto"
      @click="hideTestUserMsg = true"
    /> -->
    <div></div>
  </div>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
const { expertId } = storeToRefs(useExpertStore())
const hideTestUserMsg = ref(false)
</script>

<style lang="scss" scoped></style>
