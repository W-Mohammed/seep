<template>
    <div class="flex w-full flex-col mt-8 justify-center"
        >
          <div class="flex flex-col gap-2 my-8 mx-auto">
            <form class="flex flex-col" @submit.prevent="adjustRange()">
              <div class="text-start me-auto font-medium text-xl pb-2 max-w-[45ch]">
                What do you think are the lowest and highest plausible values <span v-if="units" class="text-base">({{units}})</span> for this outcome?
              </div>
              <div class="flex py-4 gap-8 flex-wrap md:flex-nowrap justify-center md:justify-start">
                <div class="flex flex-col">
                  <div
                    class="border-2 h-6 w-6 flex justify-center items-center border-priorb-400 rounded"
                  >
                    <Icon icon="radix-icons:arrow-down" class="text-lg text-priorb-500" />
                  </div>
                  <label for="xMin" class="pt-2 pb-1.5 leading-tight">
                  Lowest plausible value
                  </label>
                  <div>
                    <input
                      id="xMin"
                      type="number"
                      v-model="xMinProxy"
                      :step="step"
                      class="w-full h-8 text-left px-4 border border-gray-300 rounded me-3"
                      :class="{ 'border-red-500': adjustRangeError }"
                    />
                  </div>
                </div>
                <div class="flex flex-col">
                  <div
                    class="border-2 h-6 w-6 flex justify-center items-center border-priorb-400 rounded"
                  >
                    <Icon icon="radix-icons:arrow-up" class="text-lg text-priorb-500" />
                  </div>
                  <label for="xMax" class="pt-2 pb-1.5 leading-tight">Highest plausible value</label>
                  <div>
                    <input
                      id="xMax"
                      type="number"
                      v-model="xMaxProxy"
                      :step="step"
                      class="w-full h-8 text-left px-4 border border-gray-300 rounded me-3"
                      :class="{ 'border-red-500': adjustRangeError }"
                    />
                  </div>
                </div>
              </div>
              

              <div v-if="xMinLimit>-Infinity && xMaxLimit<Infinity" class="text-start me-auto text-gray700 text-xs pb-2">
                Values must be between
                {{xMinLimit}} and {{xMaxLimit}}
              </div>
              <div v-else-if="xMinLimit !== null && xMinLimit !== undefined && xMinLimit>-Infinity" class="text-start me-auto text-gray700 text-xs pb-2">
                Values must be greater than
                {{xMinLimit}}
              </div>
              <div v-else-if=" xMaxLimit !== null && xMaxLimit !== undefined && xMaxLimit < Infinity" class="text-start me-auto text-gray700 text-xs pb-2">
                Values must be less than
                {{xMaxLimit}}
              </div>




              <div>
                <span v-if="adjustRangeError" class="text-priorb-500 font-semibold">
                {{adjustRangeErrorMsg}}
                </span>
              </div>
              <button class="mt-8 px-2 border border-black text-white rounded-md py-2 px-3 bg-black font-semibold ms-auto hover:bg-black/80" @click="adjustRange()"
              >
                Confirm
              </button>

              
              

              
            </form>
            
          </div>
        </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
const props = defineProps(
    {
        xMinLimit: {
            type: Number,
            default: -Infinity
        },
        xMaxLimit: {
            type: Number,
            default: Infinity
    },
      units: {
        type: String,
        default: ''
      },
    })



const xMin = defineModel('xMin')
const xMax = defineModel('xMax')

const xMinProxy = ref(xMin.value)
const xMaxProxy = ref(xMax.value)
const adjustRangeError = ref(false)
const adjustRangeErrorMsg = ref('Invalid range')

const adjustRange = () => {
  adjustRangeError.value = false
  if (xMinProxy.value === '' || xMaxProxy.value === '' || xMinProxy.value === null || xMaxProxy.value === null || xMinProxy.value === undefined || xMaxProxy.value === undefined) {
    adjustRangeErrorMsg.value = 'Please enter minimum and maximum values'
    adjustRangeError.value = true
    return
  }

  if (isNaN(xMinProxy.value) || isNaN(xMaxProxy.value)) {
    adjustRangeErrorMsg.value = 'Please enter minimum and maximum values'
    adjustRangeError.value = true
    return
    
  }

  if (xMinProxy.value >= xMaxProxy.value) {
    adjustRangeErrorMsg.value = 'Maximum value must be greater than minimum value'
    adjustRangeError.value = true
    return
  }

  // not necessary as a validation. Added as a better user experience feature
  if ((props.xMinLimit > -Infinity && props.xMaxLimit < Infinity) && (xMinProxy.value < props.xMinLimit || xMaxProxy.value > props.xMaxLimit)) {
    adjustRangeErrorMsg.value = `Values must be between ${props.xMinLimit} and ${props.xMaxLimit}`
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if ((props.xMinLimit == -Infinity && props.xMaxLimit < Infinity) && (xMaxProxy.value > props.xMaxLimit)) {
    adjustRangeErrorMsg.value = `Values must be less than ${props.xMaxLimit}`
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if ((props.xMinLimit > -Infinity && props.xMaxLimit == Infinity) && (xMinProxy.value < props.xMinLimit)) {
    adjustRangeErrorMsg.value = `Values must be greater than ${props.xMinLimit}`
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }


  adjustRangeError.value = false
  xMin.value = xMinProxy.value
  xMax.value = xMaxProxy.value
}

const step = computed(() => {
  let min
  let max
  if (!isNaN(xMin.value)) min = xMin.value
  else if (props.xMinLimit > -Infinity) min = props.xMinLimit
  else min = 0
  if (!isNaN(xMax.value)) max = Math.abs(xMax.value)
  else if (props.xMaxLimit < Infinity) max = props.xMaxLimit
  else max = 100

  let diff = max - min

    if (diff <= 0.5) return 0.01
    if (diff <= 1) return 0.05
    if (diff <= 10) return 0.1
    if (diff <= 100) return 1
    if (diff <= 1000) return 10
    if (diff <= 10000) return 100
    if (diff <= 100000) return 1000
    return 1
})


</script>

<style scoped>
input:focus {
  @apply outline-priorb-100;
}
</style>