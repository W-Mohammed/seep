<template>
  <div class="flex flex-col" v-if="rouletteItem.content">
    <TextField
      v-model="rouletteItem.content.questionTitle"
      placeholder="Type question here"
      color="priorb-300"
    />
    <TextField
      v-model="rouletteItem.content.description"
      placeholder="Add description (optional)"
      color="gray-50"
      class="text-sm align-middle py-3"
    />

    <div
      class="flex items-center text-black border rounded-md px-2 py-1 border-gray-700 w-fit text-sm mt-2"
    >
      <Icon icon="bi:info-circle" class="text-xl me-2" />
      Click <a @click="openRouletteInfo()" target="_blank" class="underline px-1"> here </a> for
      more information on Roulette / Chips-and-Bins questions.
    </div>

    <div class="mt-8 flex flex-col">
      <div class="text-sm font-semibold py-2">Settings</div>

      <div class="bg-gray-50 px-4 py-3 rounded-md w-full">
        <div class="w-full">
          <div class="w-[200px]">
            <SelectBase v-model="rouletteItem.content.preset">
              <SelectTrigger>
                <SelectValue :class="{
                  'text-gray-400': !rouletteItem.content.preset,
                  'text-black': rouletteItem.content.preset
                }">
                  {{ presets[rouletteItem.content.preset]?.label ?? 'Select Preset' }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="percentage">
                    <div class="text-black">Percentage</div>
                    <span class="text-xs text-gray-400">Range 0% to 100%</span>
                  </SelectItem>
                  <SelectItem value="probabilityPercentage">
                    <div class="text-black">Probability (%)</div>
                    <span class="text-xs text-gray-400">Range 0% to 100%</span>
                  </SelectItem>
                  <SelectItem value="probabilityZeroOne">
                    <div class="text-black">Probability</div>
                    <span class="text-xs text-gray-400">Range 0 to 1</span>
                  </SelectItem>
                  <SelectItem value="utility">
                    <div class="text-black">Utility</div>
                    <span class="text-xs text-gray-400">Range 0 to 1</span>
                  </SelectItem>
                  <SelectItem value="costsEur">
                    <div class="text-black">Costs (&euro;)</div>
                    <span class="text-xs text-gray-400">No limits</span>
                  </SelectItem>
                  <SelectItem value="costsGbp">
                    <div class="text-black">Costs (&pound;)</div>
                    <span class="text-xs text-gray-400">No limits</span>
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectSeparator />
                  <SelectItem value="custom">
                    <div class="text-black">Custom</div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </SelectBase>
          </div>

          <div v-if="rouletteItem.content.preset" class="mt-4">
            <div class="pb-2">Units</div>
            <div class="w-[220px]">
              <input
                type="text"
                v-model="rouletteItem.content.units"
                placeholder="Add units here"
                class="text-sm px-2 py-2 focus:border-none focus:outline-none"
              />
            </div>

            <div class="flex mt-4 gap-4">
              <div>
                <div class="text-gray-400 text-xs">Minimum:</div>
                <div class="flex border rounded px-2 bg-white">
                  <div class="border-e pe-2 py-1">
                    <input
                      type="checkbox"
                      v-model="rouletteItem.content.xMinLimitToggle"
                      name="xMinLimitToggle"
                      id="xMinLimitToggle"
                      class="my-1"
                    />
                  </div>
                  <div class="flex items-center">
                    <label
                      for="xMinLimitToggle"
                      class="ms-2 text-gray-300 w-[140px] text-base"
                      v-if="!rouletteItem.content.xMinLimitToggle"
                    >
                      Set a minimum
                    </label>

                    <input
                      v-if="rouletteItem.content.xMinLimitToggle"
                      type="number"
                      id="xMinLimit"
                      v-model="rouletteItem.content.xMinLimit"
                      placeholder="Set a minimum"
                      class="ms-2 focus:outline-none w-[140px]"
                      :disabled="!rouletteItem.content.xMinLimitToggle"
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
                      v-model="rouletteItem.content.xMaxLimitToggle"
                      name="xMaxLimitToggle"
                      id="xMaxLimitToggle"
                      class="my-1"
                    />
                  </div>
                  <div class="flex items-center">
                    <label
                      for="xMaxLimitToggle"
                      class="ms-2 text-gray-300 w-[140px] text-base"
                      v-if="!rouletteItem.content.xMaxLimitToggle"
                    >
                      Set a maximum
                    </label>

                    <input
                      v-if="rouletteItem.content.xMaxLimitToggle"
                      type="number"
                      id="xMaxLimit"
                      v-model="rouletteItem.content.xMaxLimit"
                      placeholder="Set a maximum"
                      class="ms-2 focus:outline-none w-[140px]"
                      :disabled="!rouletteItem.content.xMaxLimitToggle"
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
                      v-model="rouletteItem.content.rationaleShown"
                    />
                    <label for="rationaleShown" class="ms-1">Ask for rationale?</label>
                  </div>

                  <!-- if yes, rationale required? -->
                  <div v-if="rouletteItem.content.rationaleShown" class="flex items-center">
                    <input
                      type="checkbox"
                      name="rationaleRequired"
                      id="rationaleRequired"
                      v-model="rouletteItem.content.rationaleRequired"
                    />
                    <label for="rationaleRequired" class="ms-1">Rationale required?</label>
                  </div>
                </div>
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
          v-if="rouletteItem?.content?.picot?.populationLabel"
          class="px-2 w-full overflow-hidden transition-max-height"
        >
          <div>
            <div class="picot-badge badge-blue">Population:</div>
            <div class="picot-item">
              <TextField
                v-model="rouletteItem.content.picot.populationDescription"
                placeholder="Population description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-red">Intervention:</div>
            <div class="picot-item">
              <TextField
                v-model="rouletteItem.content.picot.interventionDescription"
                placeholder="Intervention description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-green">Comparison:</div>
            <div class="picot-item">
              <TextField
                v-model="rouletteItem.content.picot.comparisonDescription"
                placeholder="Comparison description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-purple">Outcome:</div>
            <div class="picot-item">
              <TextField
                v-model="rouletteItem.content.picot.outcomeDescription"
                placeholder="Outcome description"
              />
            </div>
          </div>
          <div>
            <div class="picot-badge badge-yellow">Time:</div>
            <div class="picot-item">
              <TextField
                v-model="rouletteItem.content.picot.timeDescription"
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
import {
  SelectBase,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator
} from '@/components/admin/select'
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import {initAgendaItem} from '@/lib/addAgendaItemUtils'
import TextField from '@/components/admin/TextField.vue'
const props = defineProps({
  questionData: Object,
  required: true
})
const rouletteItem = defineModel()
rouletteItem.value = initAgendaItem('roulette', rouletteItem.value)

const hasPicotInfo = ref(rouletteItem?.value?.content?.picot?.populationLabel !== undefined)
const cachedPicot = ref({})
const preset = computed(() => rouletteItem.value.content.preset)
const xMinLimit = computed(() => rouletteItem.value.content.xMinLimit)
const xMinLimitToggle = computed(() => rouletteItem.value.content.xMinLimitToggle)

const xMaxLimit = computed(() => rouletteItem.value.content.xMaxLimit)
const xMaxLimitToggle = computed(() => rouletteItem.value.content.xMaxLimitToggle)

const presets = {
  probabilityZeroOne: {
    label: 'Probability',
    xMinLimit: 0,
    xMaxLimit: 1,
    units: 'Probability'
  },
  probabilityPercentage: {
    label: 'Probability (%)',
    xMinLimit: 0,
    xMaxLimit: 100,
    units: 'Probability (%)'
  },
  percentage: {
    label: 'Percentage',
    xMinLimit: 0,
    xMaxLimit: 100,
    units: 'Percentage (%)'
  },
  utility: {
    label: 'Utility',
    xMinLimit: 0,
    xMaxLimit: 1,
    units: 'Utility'
  },
  costsEur: {
    label: 'Costs (&euro;)',
    xMinLimit: null,
    xMaxLimit: null,
    units: 'Costs (€)'
  },
  costsGbp: {
    label: 'Costs (&pound;)',
    xMinLimit: null,
    xMaxLimit: null,
    units: 'Costs (£)'
  },
  custom: {
    label: 'Custom',
    xMinLimit: null,
    xMaxLimit: null,
    units: ''
  }
}

watch(preset, (val) => {
  if (val) {
    rouletteItem.value.content.units = presets[val].units
    rouletteItem.value.content.xMinLimit = presets[val].xMinLimit
    rouletteItem.value.content.xMinLimitToggle = presets[val].xMinLimit !== null

    rouletteItem.value.content.xMaxLimit = presets[val].xMaxLimit
    rouletteItem.value.content.xMaxLimitToggle = presets[val].xMaxLimit !== null
  }
})

watch(xMinLimitToggle, (val) => {
  if (!val) {
    rouletteItem.value.content.xMinLimit = null
  } else {
    setTimeout(() => {
      const input = document.querySelector('#xMinLimit')
      input.focus()
    }, 100)
  }
})
watch(xMinLimit, (val) => {
  if (val === '') {
    rouletteItem.value.content.xMinLimit = null
  } else {
    rouletteItem.value.content.xMinLimit = val
  }
})

watch(xMaxLimitToggle, (val) => {
  if (!val) {
    rouletteItem.value.content.xMaxLimit = null
  } else {
    setTimeout(() => {
      const input = document.querySelector('#xMaxLimit')
      input.focus()
    }, 100)
  }
})

watch(xMaxLimit, (val) => {
  if (val === '') {
    rouletteItem.value.content.xMaxLimit = null
  } else {
    rouletteItem.value.content.xMaxLimit = val
  }
})

watch(hasPicotInfo, (val) => {
  if (!val) {
    cachedPicot.value = rouletteItem.value.content.picot
    rouletteItem.value.content.picot = {}
  } else {
    rouletteItem.value.content.picot = {
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

const openRouletteInfo = () => {
  window.open('/roulette-info.pdf', '_blank')
}



</script>

<style scoped>
.control-label {
  @apply cursor-pointer text-base whitespace-nowrap;
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
