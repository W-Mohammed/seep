<template>
  <div v-if="show" class="alert-dialog-backdrop">
    <div class="alert-dialog-content flex flex-col">
      <div>
        <p class="text-black font-semibold min-w-[400px] ">
          The following questions are incomplete:
        </p>
        <ul class="list-none mt-4">
          <li v-for="(item, index) in incompleteItems" :key="index" class="ps-8">
            <span
              class="a text-priorb-primary underline cursor-pointer text-black hover:text-priorb-primary/70"
              @click="navigateToItem(item)"
            >
              {{ item.label }}
            </span>
          </li>
        </ul>
        <p class="mt-12 text-gray-700 text-sm text-center">
        Do you want to submit anyway?
        </p>
      </div>

      <div class="flex mt-auto items-center mx-auto gap-3">
        <button class="btn-cancel" @click="cancel">Cancel</button>
        <button class="btn-confirm" @click="confirm">Submit</button>
      </div>
    </div>
  </div>
</template>

<script  setup>
import { onBeforeUnmount, computed } from 'vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'

defineProps({
  confirm: Function
})

const expertStore = useExpertStore()
const { agendaItems } = storeToRefs(expertStore)
const show = defineModel()
const cancel = () => {
  show.value = false
}

const navigateToItem = (item) => {
  expertStore.goToPageByIndex(item.index)
}

const incompleteItems = computed(() => {
  return expertStore.getUncompletedItemIndices.map((itemIndex) => agendaItems.value[itemIndex])
})

const listenToClick = (event) => {
  if (
    event.target instanceof HTMLElement &&
    event.target.classList.contains('alert-dialog-backdrop')
  ) {
    show.value = false
  }
}

const listenToEscape = (event) => {
  if (event.key === 'Escape') {
    show.value = false
  }
}

window.addEventListener('click', listenToClick)
window.addEventListener('keydown', listenToEscape)

onBeforeUnmount(() => {
  window.removeEventListener('click', listenToClick)
  window.removeEventListener('keydown', listenToEscape)
})
</script>

<style scoped>
.alert-dialog-backdrop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 300;
}

.alert-dialog-content {
  @apply bg-white pt-6 pb-4 px-8 sm:rounded mb-40;
  top: 50%;
  min-width: 320px;
  max-width: 60ch;
  min-height: 120px;
}

.btn-cancel {
  @apply h-10 border border-black bg-white disabled:bg-gray-500 rounded-sm text-black px-2
        hover:bg-gray-100 hover:text-black hover:border-black;
}

.btn-confirm {
  @apply h-10 border border-black bg-black disabled:bg-priorb-500 rounded-sm text-white px-2
        hover:bg-gray-900/80;
}
</style>
