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
      class="flex items-center text-black border rounded px-2 py-1 border-gray-700 w-fit text-sm mt-2"
    >
      <Icon icon="bi:info-circle" class="text-xl me-2" />
      A single number input field
    </div>

    <div class="mt-8 flex flex-col">
      <div class="text-sm font-semibold py-2">Settings</div>

      <div class="bg-gray-50 px-4 py-2 rounded-md w-full">
        <div class="w-full">
          <!-- <div class="pb-2">Preset</div> -->

          <div class="mt-4">
            <div class="flex mt-4 gap-4">
              <div>
                <div class="text-gray-400 text-xs">Minimum:</div>
                <div class="flex border rounded px-2 bg-white">
                  <div class="border-e pe-2 py-1">
                    <input
                      type="checkbox"
                      v-model="minCheckbox"
                      name="lowerLimitToggle"
                      id="lowerLimitToggle"
                      class="my-1"
                    />
                  </div>
                  <div class="flex items-center">
                    <label
                      for="lowerLimitToggle"
                      class="ms-2 text-gray-300 w-[140px] text-base"
                      v-if="!minCheckbox"
                    >
                      Set a minimum
                    </label>
  
                    <input
                      v-if="minCheckbox"
                      type="number"
                      id="lowerLimit"
                      v-model="agendaItem.content.min"
                      placeholder="Set a minimum"
                      class="ms-2 focus:outline-none w-[140px]"
                      :disabled="!minCheckbox"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="text-gray-400 text-xs">Maximum:</div>
                <div class="flex border rounded px-2 bg-white">
                  <div class="border-e pe-2 py-1">
                    <input
                      type="checkbox"
                      v-model="maxCheckbox"
                      name="upperLimitToggle"
                      id="upperLimitToggle"
                      class="my-1"
                    />
                  </div>
                  <div class="flex items-center">
                    <label
                      for="upperLimitToggle"
                      class="ms-2 text-gray-300 w-[140px] text-base"
                      v-if="!maxCheckbox"
                    >
                      Set a maximum
                    </label>
  
                    <input
                      v-if="maxCheckbox"
                      type="number"
                      id="upperLimit"
                      v-model="agendaItem.content.max"
                      placeholder="Set a maximum"
                      class="ms-2 focus:outline-none w-[140px]"
                      :disabled="!maxCheckbox"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'

const agendaItem = defineModel()
agendaItem.value = initAgendaItem('number', agendaItem.value)

const min = ref(agendaItem.value.content.min)
const max = ref(agendaItem.value.content.max)


const minCheckbox = ref(min.value !== null && min.value !== undefined)
const maxCheckbox = ref(max.value !== null && max.value !== undefined)

watch(minCheckbox, (value) => {
  if (!value) agendaItem.value.content.min = null
  else agendaItem.value.content.min = 0
})
watch(maxCheckbox, (value) => {
  if (!value) agendaItem.value.content.max = null
  else agendaItem.value.content.max = 100
})

</script>


<style scoped></style>
