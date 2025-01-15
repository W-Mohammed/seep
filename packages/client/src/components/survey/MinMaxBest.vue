<template>
    <div class="flex w-full flex-col mt-8 justify-center"
        >
          <div class="flex flex-col gap-2 my-8 mx-auto">
            <div class="flex flex-col max-w-[55ch]">
              <div class="text-start me-auto font-medium text-xl pb-2 mb-8">
                What do you think are the lowest and highest plausible values <span v-if="units" class="text-base">({{units}})</span> for this outcome?
              </div>
              <div class="flex flex-col">
              <div class="flex py-4 gap-8 flex-wrap md:flex-nowrap justify-center">
                <div class="flex flex-col">
                  <div
                    class="border-2 h-6 w-6 flex justify-center items-center border-priorb-400 rounded"
                  >
                    <Icon icon="radix-icons:arrow-down" class="text-lg text-priorb-500" />
                  </div>
                  <label for="min" class="pt-2 pb-1.5">Lowest plausible value
                  </label>
                  <div>
                    <input
                      id="min"
                      type="number"
                      v-model="minProxy"
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
                  <label for="max" class="pt-2 pb-1.5">
                  Highest plausible value
                  </label>
                  <div>
                    <input
                      id="max"
                      type="number"
                      v-model="maxProxy"
                      :step="step"
                      class="w-full h-8 text-left px-4 border border-gray-300 rounded me-3"
                      :class="{ 'border-red-500': adjustRangeError }"
                    />
                  </div>
                </div>
              </div>
                <div v-if="minLimit != null && maxLimit != null && minLimit>-Infinity && maxLimit<Infinity" class="text-start me-auto text-gray700 text-xs pb-2">
                  Values must be between
                  {{minLimit}} and {{maxLimit}}
                </div>
                <div v-else-if="minLimit != null && minLimit>-Infinity" class="text-start me-auto text-gray700 text-xs pb-2">
                  Values must be greater than
                  {{minLimit}}
                </div>
                <div v-else-if=" maxLimit != null && maxLimit < Infinity" class="text-start me-auto text-gray700 text-xs pb-2">
                  Values must be less than
                  {{maxLimit}}
                </div>
              <div v-if="isSuccessConfirmOnce">
                <div class="text-center me-auto font-medium text-xl pb-2 mt-10">
                  What is your best estimate for this outcome?
                </div>
                <div class="flex py-4 gap-8">
                  <div class="flex flex-col mx-auto">
                  <div class="flex items-center gap-2">
                    <div
                      class="border-2 h-6 w-6 flex justify-center items-center border-priorb-400 rounded"
                    >
                      <Icon icon="bi:bullseye" class="text-lg text-priorb-500" />
                    </div>
                    <label for="best" class="pt-2 pb-1.5">
                    Best estimate
                    </label>
                  </div>
                    <div>
                      <input
                        id="best"
                        type="number"
                        v-model="bestProxy"
                        :step="step"
                        class="w-full h-8 text-left px-4 border border-gray-300 rounded me-3"
                        :class="{ 'border-red-500': adjustRangeError }"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span v-if="adjustRangeError" class="text-priorb-500 font-semibold">
                  {{adjustRangeErrorMsg}}
                  </span>
                </div>
              </div>
              <button v-if="!isSuccessConfirmOnce" class="mt-8 px-2 border border-black text-white rounded-md py-2 px-3 bg-black font-semibold ms-auto
              hover:bg-black/80" @click="adjustRange()"
              >
                Confirm
              </button>


            </div>
              
            </div>
            
          </div>
        </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useExpertStore } from '@/store/expertStore'

const props = defineProps(
    {
        minLimit: {
            type: Number,
            default: -Infinity
        },
        maxLimit: {
            type: Number,
            default: Infinity
    },
        units: {
            type: String,
            default: ''
        }
    })

const expertStore = useExpertStore()

const min = defineModel('min')
const max = defineModel('max')
const best = defineModel('best')

const minProxy = ref(min.value)
const maxProxy = ref(max.value)
const bestProxy = ref(best.value)

const adjustRangeError = ref(false)
const adjustRangeErrorMsg = ref('Invalid range')
const { setCurrentQuestionCompleted } = expertStore

const isSuccessConfirmOnce = ref(typeof best.value === 'number')

const adjustRange = () => {
  adjustRangeError.value = false

  if (minProxy.value === '' || maxProxy.value === '' || minProxy.value === null || maxProxy.value === null || minProxy.value === undefined || maxProxy.value === undefined) {
    adjustRangeErrorMsg.value = 'Please enter correct minimum, maximum values'
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if (isNaN(minProxy.value) || isNaN(maxProxy.value)) {
    adjustRangeErrorMsg.value = 'Please enter correct minimum, maximum values'
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if (minProxy.value >= maxProxy.value) {
    adjustRangeErrorMsg.value = 'Maximum value must be greater than minimum value'
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  // not necessary as a validation. Added as a better user experience feature
  if ((props.minLimit > -Infinity && props.maxLimit < Infinity) && (minProxy.value < props.minLimit || maxProxy.value > props.maxLimit)) {
    adjustRangeErrorMsg.value = `Values must be between ${props.minLimit} and ${props.maxLimit}`
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if ((props.minLimit == -Infinity && props.maxLimit < Infinity) && (maxProxy.value > props.maxLimit)) {
    adjustRangeErrorMsg.value = `Values must be less than ${props.maxLimit}`
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if ((props.minLimit > -Infinity && props.maxLimit == Infinity) && (minProxy.value < props.minLimit)) {
    adjustRangeErrorMsg.value = `Values must be greater than ${props.minLimit}`
    adjustRangeError.value = true
    setCurrentQuestionCompleted(false)
    return false
  }

  if ((typeof best.value === 'number') && (minProxy.value > best.value || best.value > maxProxy.value)) {
    if (bestProxy.value != null && bestProxy.value > minProxy.value && bestProxy.value < maxProxy.value) {
      adjustRangeErrorMsg.value = ''
      adjustRangeError.value = false
      best.value = bestProxy.value
      setCurrentQuestionCompleted(true)
      return true
    } else {
      adjustRangeErrorMsg.value = 'Your best estimate must be within the range'
      adjustRangeError.value = true
      setCurrentQuestionCompleted(false)
      return false
    }
  }

  if (!isSuccessConfirmOnce.value) {
    isSuccessConfirmOnce.value = true
  }
  
  adjustRangeErrorMsg.value=""
  adjustRangeError.value = false
  min.value = minProxy.value
  max.value = maxProxy.value
  
  return true
}

watch([minProxy, maxProxy, bestProxy], (response) => {
  if (isSuccessConfirmOnce.value) {
    setTimeout(() => {
      if (adjustRange()) {
        if (minProxy.value > bestProxy.value || bestProxy.value > maxProxy.value || typeof (bestProxy.value) !== 'number') { 
          adjustRangeErrorMsg.value = 'The best estimate must be within the range'
          adjustRangeError.value = true
          setCurrentQuestionCompleted(false)
          return
        } else {
          adjustRangeErrorMsg.value = ''
          adjustRangeError.value = false
          best.value = bestProxy.value
           setCurrentQuestionCompleted(true)
        }
      }
    }, 400)
  }
})

const step = computed(() => {
  let min_
  let max_
  if (!isNaN(min.value)) min_ = min.value
  //else if (props.minLimit > -Infinity) min = props.minLimit
  else min_ = 0
  if (!isNaN(max.value)) max_ = Math.abs(max.value)
  //else if (props.maxLimit < Infinity) max = props.maxLimit
  else max_ = 100

  let diff = max_ - min_
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