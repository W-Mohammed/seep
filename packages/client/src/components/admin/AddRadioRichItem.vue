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
          class="relative border rounded px-3 py-2 mb-3"
        >
          <input type="radio" class="pointer-events-none mb-2" />

          <div class="flex flex-col w-full label">
            <input
              type="text"
              v-model="option.title"
              :name="'title' + index"
              @input="updateOption(index, 'title', $event.target.value)"
              :placeholder="'Option ' + (index + 1) + ' Title'"
              maxlength="20"
              class="mb-1 font-semibold text-lg outline-none ms-3 border-none bg-transparent p-0"
            />
            <input
              type="text"
              v-model="option.description"
              :name="'description' + index"
              @input="updateOption(index, 'description', $event.target.value)"
              :placeholder="'Option ' + (index + 1) + ' Description'"
              maxlength="200"
              class="text-gray-700 leading-snug outline-none ms-3 text-base border-none bg-transparent p-0"
            />
          </div>

          <div
            role="button"
            @click="removeOption(index)"
            class="absolute top-2 right-2 cursor-pointer"
            v-if="qData.options.length > 1"
          >
            <Icon icon="bi:x" class="text-2xl" />
          </div>
        </div>

        <button
          @click="addOption"
          class="flex items-center border rounded px-2 py-2 mb-3 w-full text-gray-700 justify-start"
        >
          <Icon icon="bi:plus" class="text-2xl" />
          <div>Add option</div>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'

const agendaItem = defineModel()
agendaItem.value = initAgendaItem('radiorich', agendaItem.value)
const qData = computed(() => agendaItem.value.content)
const MAX_OPTIONS = 8

const addOption = () => {
  // Limit options to 3
  if (agendaItem.value.content.options.length >= MAX_OPTIONS) {
    alert(`You can only add up to ${MAX_OPTIONS} options for this question type`)
    return
  }

  agendaItem.value.content.options.push({ title: '', description: '' })
  setTimeout(() => {
    const lastOption = agendaItem.value.content.options.length - 1
    const input = document.querySelector(`input[name='title${lastOption}']`)
    input?.focus()
  }, 100)
}


const removeOption = (index) => {
  agendaItem.value.content.options.splice(index, 1)
}

const updateOption = (index, field, value) => {
  agendaItem.value.content.options[index][field] = value
}

onMounted(() => {
  if (agendaItem.value?.content?.options?.length === 0) addOption()
  if (agendaItem.value?.content?.options?.length > MAX_OPTIONS ) {
    agendaItem.value.content.options = agendaItem.value.content.options.slice(0, MAX_OPTIONS)
  }
})
</script>

<style scoped>
.remove-option {
  width: 40px;
  text-align: center;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.label {
  @apply px-6 py-1 cursor-pointer w-full;
}
</style>
