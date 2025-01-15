<template>
  <div>
    <div>
      <TextField
      v-model="qData.questionTitle"
      placeholder="Type question here"
      color="priorb-300"
    />
    <TextField
      v-model="qData.description"
      placeholder="Add description (optional)"
      color="gray-50"
      class="text-sm align-middle py-3"
    />

      <div class="mt-4">
      <div
        v-for="(option, index) in qData.options"
        :key="index"
        class="flex items-center border rounded px-3 py-2 mb-3"
      >
        <input type="checkbox" class="pointer-events-none" />
        <div class="input-wrapper">
          <input
            type="text"
            v-model="option.text"
            :name="'option' + index"
            @input="updateOption(index, $event.target.value)"
            :placeholder="'Option ' + (index + 1)"
            class="ms-2 focus:outline-none w-full"
          />
          <div
          role="button"
            @click="removeOption(index)"
            class="remove-option"
            v-if="qData.options.length > 1"
          >
            <Icon icon="bi:x" class="text-3xl" />
          </div>
        </div>
      </div>

      <div v-if="qData.other" class="">
        <div class="flex items-center border rounded px-3 py-2 mb-3 input-wrapper">
          <input type="radio" class="pointer-events-none" />
          <div class="ms-2 relative grow flex w-full text-black cursor-not-allowed">
            Other
          </div>
            <div role="button" @click="removeOther(index)" class="remove-option">
              <Icon icon="bi:x" class="text-3xl" />
            </div>
        </div>

        <button @click="removeOther()" class="remove-option"></button>
      </div>

      <div class="">
        <button
          @click="addOption"
          class="flex items-center border rounded ps-2 py-2 mb-3 w-full text-gray-700 justify-start"
        >
          <Icon icon="bi:plus" class="text-2xl" />
          <div class="ms-0">Add option</div>
        </button>

        <button
        v-if="!qData.other"
        @click="addOther"
        class="text-priorb-primary font-semibold mt-4 flex flex-col items-start"
      >
        <div class="flex items-center">
          <div class=" items-center flex">
            <div
              class="w-5 h-5 relative flex-col justify-start items-start flex"
            >
              <Icon icon="bi:plus-circle" class="text-3xl text-priorb-500" />
            </div>
          </div>
          <div class="text-semibold ms-2 p-3">Add "Other"</div>
        </div>


      </button>
        <div
      class="flex items-center text-gray-600 border rounded px-2 py-1 border-black w-fit text-sm mt-4"
    >
    <Icon icon="bi:info-circle" class="text-xl me-2" />
    If "Other" is selected, a text field will be displayed
    </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps, ref, watch,computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'

const agendaItem = defineModel()
agendaItem.value = initAgendaItem('checkbox',agendaItem.value)
const qData = computed(() => agendaItem.value.content)

const addOption = () => {
  agendaItem.value.content.options.push({ label: '',value: '' })
  // focus on the last option
  setTimeout(() => {
    const lastOption = agendaItem.value.content.options.length - 1
    const input = document.querySelector(`input[name='option${lastOption}']`)
    input.focus()
  }, 100)
}

const removeOption = (index) => {
  agendaItem.value.content.options.splice(index, 1)
}

const updateOption = (index, value) => {
  agendaItem.value.content.options[index].label = value
  agendaItem.value.content.options[index].value = value
}

const addOther = () => {
  agendaItem.value.content.other = true
}
const removeOther = () => {
  agendaItem.value.content.other = false
}

onMounted(() => {
  if (agendaItem.value?.content?.options?.length === 0) addOption()
})
</script>

<style scoped>
.remove-option {
  width: 40px;
  text-align: center;
  right: 0;
  top:0;
  bottom: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.input-wrapper {
  display: flex;
  position: relative;
  flex-grow: 1;
}
</style>
