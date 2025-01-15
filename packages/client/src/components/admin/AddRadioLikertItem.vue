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

      <div class="mt-8">
        <div class="flex items-center my-4">
          <span class="text-gray-700 font-medium mr-4">Set number of options:</span>

          <button @click="decrementOptions" class="p-2" :disabled="optionCount === MIN_LENGTH">
            <Icon icon="bi:dash-circle" class="text-2xl text-priorb-500"/>
          </button>
          <input
            type="number"
            v-model.number="optionCount"
            min="3"
            max="7"
            class="border w-20 p-2 text-center rounded-lg"
            readonly
          />
          <button @click="incrementOptions" class="p-2" :disabled="optionCount === MAX_LENGTH">
            <Icon icon="bi:plus-circle" class="text-2xl text-priorb-500"/>
          </button>
        </div>
  
        <div class="flex items-center my-4">
          <span class="text-gray-700 font-medium mr-3 w-40 text-left">Set left-most label:</span>
          
          <input
            type="text"
            v-model="leftLabel"
            placeholder="Left label"
            maxlength="8"
            class="w-50 p-2 border border-gray-300 rounded-md text-center"
          />
        </div>
        
        <div class="flex items-center my-4">
          <span class="text-gray-700 font-medium mr-3 w-40 text-left">Set right-most label:</span>
          
          <input
            type="text"
            v-model="rightLabel"
            placeholder="Right label"
            maxlength="8"
            class="w-50 p-2 border border-gray-300 rounded-md text-center"
          />
        </div>
        
        <div class="flex items-center my-4">
          <span class="text-gray-700 font-medium mr-3 w-40 text-left">Set middle label:</span>
          
          <input
            type="text"
            v-model="middleLabel"
            placeholder="Middle label"
            maxlength="8"
            class="w-50 p-2 border border-gray-300 rounded-md text-center"
            :disabled="qData.options.length % 2 == 0"
          />
        </div>

        <div class="flex items-center mt-8 my-4">
          <input type="checkbox" v-model="qData.showNoResponse" class="me-2" name="showNoResponse" id="showNoResponse" />
          <label for="showNoResponse">Allow No Response</label>
        </div>

        <!--button
              class="border bg-white border-gray-500 text-black py-1.5 px-4 text-sm hover:bg-gray-700 hover:text-white rounded-sm mb-5"
                @click="generateOptions(); configureClickedOnce = true"
            >
              Configure
        </button-->

        <!--div
          v-if="configureClickedOnce"
          v-for="(option, index) in qData.options"
          :key="index"
          class="relative border rounded px-3 py-2 mb-3 mt-4"
        >
          <input type="radio" class="pointer-events-none mb-2" />

          <div class="flex flex-col w-full label">
            <input
              type="text"
              v-model="option.title"
              :name="'title' + index"
              @input="updateOption(index, 'title', $event.target.value)"
              :placeholder="'Option ' + (index + 1) + ' Title'"
              maxlength="1"
              class="mb-1 font-semibold text-lg outline-none ms-3 border-none bg-transparent p-0"
            />
            <input
              type="text"
              v-model="option.description"
              :name="'description' + index"
              @input="updateOption(index, 'description', $event.target.value)"
              :placeholder="index == 0 ? 'Left label' : index == qData.options.length - 1 ? 'Right label' : (qData.options.length % 2 != 0 && index == Math.floor(qData.options.length / 2)) ? 'Middle label' : ''"
              maxlength="8"
              :readonly="index !== 0 && index !== qData.options.length - 1 && (qData.options.length % 2 == 0 || index != Math.floor(qData.options.length / 2))"
              class="text-gray-700 leading-snug outline-none ms-3 text-base border-none bg-transparent p-0"
            />
          </div>

          <div
            role="button"
            @click="removeOption(index)"
            class="absolute top-2 right-2 cursor-pointer"
            v-if="qData.options.length > MIN_LENGTH"
          >
            <Icon icon="bi:x" class="text-2xl" />
          </div>
        </div-->

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'

const agendaItem = defineModel()
agendaItem.value = initAgendaItem('radiolikert', agendaItem.value)
const qData = computed(() => agendaItem.value.content)

const TITLE_LENGTH = 1
const MAX_DESCRIPTION_LENGTH = 8
const MIN_LENGTH = 3
const MAX_LENGTH = 9

const optionCount = ref(7) 
const leftLabel = ref('')
const rightLabel = ref('')
const middleLabel = ref('')

const incrementOptions = () => {
  if (optionCount.value < MAX_LENGTH) {
    optionCount.value++
  }
  if (optionCount.value % 2 == 0) {
    middleLabel.value = ''
  }
  generateOptions()
}

const decrementOptions = () => {
  if (optionCount.value > MIN_LENGTH) {
    optionCount.value--
  }
  if (optionCount.value % 2 == 0) {
    middleLabel.value = ''
  }
  generateOptions()
}

const removeOption = (index) => {
  agendaItem.value.content.options.splice(index, 1)
  optionCount.value = agendaItem.value.content.options.length
}

const updateOption = (index, field, value) => {
  agendaItem.value.content.options[index][field] = value
}

const generateOptions = () => {
  const options = []

  for (let i = 0; i < optionCount.value; i++) {
    options.push({
      title: i+1,
      description: i === 0 ? leftLabel.value : i === optionCount.value - 1 ? rightLabel.value : (optionCount.value % 2 != 0 && i == Math.floor(optionCount.value / 2)) ? middleLabel.value : ''
    })
  }

  agendaItem.value.content.options = options
}

watch([leftLabel, rightLabel, middleLabel, optionCount], () => {
  if (agendaItem.value.content.options.length > 0) {
    agendaItem.value.content.options[0].description = leftLabel.value
    agendaItem.value.content.options[agendaItem.value.content.options.length - 1].description = rightLabel.value
    if (optionCount.value % 2 != 0) {
      agendaItem.value.content.options[Math.floor(optionCount.value / 2)].description = middleLabel.value
    }
  }
})

onMounted(() => {
  if (agendaItem.value?.content?.options?.length > 0) {
    // Because an admin could create an agenda item with Extended Single Choice question type and then change it to Radio Likert question type
    if (agendaItem.value.content.options.length > MAX_LENGTH) {
      agendaItem.value.content.options = agendaItem.value.content.options.slice(0, 7)
    }

    if (agendaItem.value.content.options.length < MIN_LENGTH) {
      leftLabel.value = ''
      rightLabel.value = ''
      middleLabel.value = ''
      generateOptions()
    }

    leftLabel.value = agendaItem.value.content.options[0].description 
    rightLabel.value = agendaItem.value.content.options[agendaItem.value.content.options.length - 1].description
    if (optionCount.value % 2 != 0) {
      middleLabel.value = agendaItem.value.content.options[Math.floor(optionCount.value / 2)].description
    }

    agendaItem.value.content.options.forEach((option, index) => {
      if (option.title.length > TITLE_LENGTH) {
        agendaItem.value.content.options[index].title = option.title.slice(0, TITLE_LENGTH)
      }

      if (index != 0 && index != agendaItem.value.content.options.length - 1 && (agendaItem.value.content.options.length % 2 == 0 || index != Math.floor(agendaItem.value.content.options.length / 2))) {
        agendaItem.value.content.options[index].description = ''
      } 

      if (option.description.length > MAX_DESCRIPTION_LENGTH) {
        agendaItem.value.content.options[index].description = option.description.slice(0, MAX_DESCRIPTION_LENGTH)
      }
    })
    optionCount.value = agendaItem.value.content.options.length
  } else {
    generateOptions()
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
