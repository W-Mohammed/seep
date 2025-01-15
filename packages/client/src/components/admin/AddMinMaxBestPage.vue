<template>
  <div>
    <div>
      <TextField
        v-model="questionData.content.questionTitle"
        placeholder="Type question here"
        color="priorb-300"
      />
      <TextField
        v-model="questionData.content.description"
        placeholder="Add description (optional)"
        color="gray-50"
        class="text-sm align-middle py-3"
      />
    </div>
    <div
      class="flex items-center text-gray-700 border rounded px-2 py-1 border-black w-fit text-sm mt-2"
    >
    <Icon icon="bi:info-circle" class="text-xl me-2" />
      Click <a @click="openInfo()" target="_blank" class="underline px-1"> here </a> for
      more information on Min-Max-Best questions.
    </div>

    <div class="mt-8 flex flex-col">
    <div class="text-sm font-semibold py-2">Settings</div>

    <div class="bg-gray-50 px-4 py-3 rounded-md w-full">
    <div class="mt-4">
      <div class="pb-2">Units</div>
      <div class="w-[220px]">
        <input
          type="text"
          v-model="questionData.content.units"
          placeholder="Add units here"
          class="text-sm px-2 py-2 focus:border-none focus:outline-none"
        />
      </div>
    </div>

    <div class="flex mt-4 gap-4">
      
      <div>
        <div class="text-gray-400 text-xs">Minimum:</div>
        <div class="flex border rounded px-2 bg-white">
          <div class="border-e pe-2 py-1">
            <input
              type="checkbox"
              v-model="questionData.content.minLimitToggle"
              name="minLimitToggle"
              id="minLimitToggle"
              class="my-1"
            />
          </div>
          <div class="flex items-center">
            <label
              for="minLimitToggle"
              class="ms-2 text-gray-300 w-[140px] text-base"
              v-if="!questionData.content.minLimitToggle"
            >
              Set a minimum
            </label>

            <input
              v-if="questionData.content.minLimitToggle"
              type="number"
              id="minLimit"
              v-model="questionData.content.minLimit"
              placeholder="Set a minimum"
              class="ms-2 focus:outline-none w-[140px]"
              :disabled="!questionData.content.minLimitToggle"
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
              v-model="questionData.content.maxLimitToggle"
              name="maxLimitToggle"
              id="maxLimitToggle"
              class="my-1"
            />
          </div>
          <div class="flex items-center">
            <label
              for="maxLimitToggle"
              class="ms-2 text-gray-300 w-[140px] text-base"
              v-if="!questionData.content.maxLimitToggle"
            >
              Set a maximum
            </label>

            <input
              v-if="questionData.content.maxLimitToggle"
              type="number"
              id="maxLimit"
              v-model="questionData.content.maxLimit"
              placeholder="Set a maximum"
              class="ms-2 focus:outline-none w-[140px]"
              :disabled="!questionData.content.maxLimitToggle"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 mb-2">
      <div class="text-xs text-gray-400">
        Rationale:
        <div class="flex flex-col gap-2 ps-2 pt-1">
          <!-- rationale shown? -->
          <div class="flex items-center">
            <input
              type="checkbox"
              name="rationaleShown"
              id="rationaleShown"
              v-model="questionData.content.rationaleShown"
            />
            <label for="rationaleShown" class="ms-1">Ask for rationale?</label>
          </div>

          <!-- if yes, rationale required? -->
          <div v-if="questionData.content.rationaleShown" class="flex items-center">
            <input
              type="checkbox"
              name="rationaleRequired"
              id="rationaleRequired"
              v-model="questionData.content.rationaleRequired"
            />
            <label for="rationaleRequired" class="ms-1">Rationale required?</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    <div>
      <!-- add PICOT information? checkbox -->
      <div class="flex items-center mt-8">
        <input type="checkbox" v-model="hasPicotInfo" class="me-2" name="picot" id="picot" />
        <label for="picot">Show PICOT Information</label>
      </div>

      <div class="w-full" v-if="hasPicotInfo">
        <div class="text-xs pb-4 text-gray-500 ps-1 mt-1">
          Fields without description will be hidden.
        </div>
        <div
          v-if="questionData?.content?.picot?.populationLabel"
          class="px-2 w-full overflow-hidden transition-max-height"
        >
          <div>
            <div class="picot-badge badge-blue">Population:</div>
            <div class="picot-item">
              <TextField
                v-model="questionData.content.picot.populationDescription"
                placeholder="Population description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-red">Intervention:</div>
            <div class="picot-item">
              <TextField
                v-model="questionData.content.picot.interventionDescription"
                placeholder="Intervention description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-green">Comparison:</div>
            <div class="picot-item">
              <TextField
                v-model="questionData.content.picot.comparisonDescription"
                placeholder="Comparison description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-purple">Outcome:</div>
            <div class="picot-item">
              <TextField
                v-model="questionData.content.picot.outcomeDescription"
                placeholder="Outcome description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-yellow">Time:</div>
            <div class="picot-item">
              <TextField
                v-model="questionData.content.picot.timeDescription"
                placeholder="Time description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'

const questionData = defineModel()
questionData.value = initAgendaItem('minMaxBest', questionData.value)



const hasPicotInfo = ref(questionData?.value?.content?.picot?.populationLabel !== undefined)
const cachedPicot = ref({})
const minLimitToggle = computed(() => questionData.value.content.minLimitToggle)
const maxLimitToggle = computed(() => questionData.value.content.maxLimitToggle)
const minLimit = computed(() => questionData.value.content.minLimit)
const maxLimit = computed(() => questionData.value.content.maxLimit)


watch(hasPicotInfo, (val) => {
  if (!val) {
    cachedPicot.value = questionData.value.content.picot
    questionData.value.content.picot = {}
  } else {
    questionData.value.content.picot = {
      populationLabel: 'Population',
      populationDescription: '',
      interventionLabel: 'Intervention',
      interventionDescription: '',
      comparisonLabel: 'Comparison',
      comparisonDescription: '',
      outcomeLabel: 'Outcome',
      outcomeDescription: '',
      timeLabel: 'Time',
      timeDescription: '',
      ...cachedPicot.value
    }
  }
})

watch(minLimitToggle, (val) => {
  if (!val) {
    questionData.value.content.minLimit = null
  } else {
    setTimeout(() => {
      const input = document.querySelector('#minLimit')
      input.focus()
    }, 100)
  }
})

watch(minLimit, (val) => {
  if (val === '') {
    questionData.value.content.minLimit = null
  } else {
    questionData.value.content.minLimit = val
  }
})

watch(maxLimitToggle, (val) => {
  if (!val) {
    questionData.value.content.maxLimit = null
  } else {
    setTimeout(() => {
      const input = document.querySelector('#maxLimit')
      input.focus()
    }, 100)
  }
})

watch(maxLimit, (val) => {
  if (val === '') {
    questionData.value.content.maxLimit = null
  } else {
    questionData.value.content.maxLimit = val
  }
})


const openInfo = () => {
  window.open('/minmaxbest-info.pdf', '_blank')
}


</script>

<style scoped>
input[type='checkbox'] {
  @apply accent-priorb-500;
}

input[type='checkbox'] {
  width: 16px;
  height: 16px;
  outline: none;
  border: 1px solid gray;
}

input[type='checkbox']:checked {
  border: 1px solid theme('colors.priorb.primary');
}

.control-label {
  @apply cursor-pointer text-base whitespace-nowrap;
}

input[type='checkbox']:disabled {
  border: 1px solid #e2e8f0 !important;
}
input[type='checkbox']:disabled:before {
  background: #e2e8f0 !important;
}


.transition-max-height {
  transition: max-height 0.5s;
}

.picot-note {
  @apply text-xs text-gray-500 mb-4;
  line-height: 1.2;
}

.rotate-chevron {
  transform: rotate(180deg);
  transition: transform 0.5s;
}
.unrotate-chevron {
  transform: rotate(0deg);
  transition: transform 0.5s;
}

</style>
