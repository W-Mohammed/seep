<template>
    <div class="flex w-full flex-col mt-8 justify-center">
          <div class="flex flex-col gap-2 my-8 mx-auto">
            <div class="flex flex-col">
              <div class="text-start me-auto font-medium text-xl pb-2 mb-8">
                What do you think are the lowest and highest plausible values <span v-if="units" class="text-base">({{units}})</span> for this outcome?
              </div>
              <div class="flex flex-col">
              <div class="flex py-4 gap-8 flex-wrap md:flex-nowrap justify-center">
                <div class="flex flex-col">
                  <div class="border-2 h-6 w-6 flex justify-center items-center border-priorb-400 rounded">
                    <Icon icon="radix-icons:arrow-down" class="text-lg text-priorb-500" />
                  </div>
                  <label for="min" class="pt-2 pb-1.5">Lowest plausible value</label>
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
            </div>            
              <div v-if="isSuccessConfirmOnce" class="flex w-full flex-col mt-8 justify-center">
                <div class="flex flex-col gap-8">
                  <QuantileInput
                    :label="label1"
                    :count="1"
                    v-model:value="val25Proxy"
                    v-model:probability="prob25Proxy"
                  />
                  <QuantileInput
                    :label="label2"
                    :count="2"
                    v-model:value="val75Proxy"
                    v-model:probability="prob75Proxy"
                  />
                  <QuantileInput
                   :label="label3"
                    :count="3"
                  v-model:value="val50Proxy"
                  v-model:probability="prob50Proxy"
                />
                </div>
              </div>
              <div class="p-8">
                <div>
                  <span v-if="adjustRangeError" class="text-priorb-500 font-semibold">
                  {{adjustRangeErrorMsg}}
                  </span>
                </div>
              </div>
              <button v-if="!isSuccessConfirmOnce" class="mt-8 px-2 border border-priorb-PRIMARY text-white rounded-md py-2 px-3 bg-priorb-PRIMARY font-semibold ms-auto" @click="adjustRange()"
              >
                Confirm
              </button>


              
            </div>
            
          </div>
        </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import QuantileInput from '@/components/survey/QuantileInput.vue' 
import { useExpertStore } from '@/store/expertStore'
const expertStore = useExpertStore()
const { setCurrentQuestionCompleted } = expertStore

// Props and Model Definitions
const props = defineProps({
  minLimit: { type: Number, default: -Infinity },
  maxLimit: { type: Number, default: Infinity },
  units: { type: String, default: '' }
})

// Models
const min = defineModel('min')
const max = defineModel('max')
const val25 = defineModel('val25')
const prob25 = defineModel('prob25')
const val50 = defineModel('val50')
const prob50 = defineModel('prob50')
const val75 = defineModel('val75')
const prob75 = defineModel('prob75')

// Proxy
const minProxy = ref(min.value)
const maxProxy = ref(max.value)
const val25Proxy = ref(val25.value)  
const val50Proxy = ref(val50.value)  
const val75Proxy = ref(val75.value)  
const prob25Proxy = ref(prob25.value)
const prob50Proxy = ref(prob50.value)
const prob75Proxy = ref(prob75.value)

const isSuccessConfirmOnce = ref(typeof val25Proxy.value === 'number' && val25Proxy.value > 0)

const adjustRangeError = ref(false)
const adjustRangeErrorMsg = ref('')

// Default Quantile Values Calculation
const updateQuantiles = () => {
  if (typeof minProxy.value == 'number' && typeof maxProxy.value == 'number') {
    const range = maxProxy.value - minProxy.value
    val25Proxy.value = minProxy.value + range * 0.25
    val50Proxy.value = minProxy.value + range * 0.5
    val75Proxy.value = minProxy.value + range * 0.75
    val25.value = val25Proxy.value
    val50.value = val50Proxy.value
    val75.value = val75Proxy.value
    prob25Proxy.value = null
    prob50Proxy.value = null
    prob75Proxy.value = null
    prob25.value = null
    prob50.value = null
    prob75.value = null
  }
}

watch([minProxy, maxProxy], updateQuantiles)

const label1 = computed(() => `Probability that the estimate is lower than ${val25Proxy.value} :`)
const label2 = computed(() => `Probability that the estimate is higher than ${val75Proxy.value} :`)
const label3 = computed(() => `Probability that the estimate is lower than ${val50Proxy.value} :`)

const step = computed(() => {
  let min_
  let max_
  if (!isNaN(min.value)) min_ = min.value
  else min_ = 0
  if (!isNaN(max.value)) max_ = Math.abs(max.value)
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

const defaultError = 'Ensure the values are placed as follows: Minimum < Value 1 < Value 3 < Value 2 < Maximum'

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

  if ((typeof val25.value === 'number') && (minProxy.value > val25.value || val25.value > maxProxy.value)) {
    if (val25Proxy.value == null || val25Proxy.value <= minProxy.value || val25Proxy.value >= maxProxy.value) {
      adjustRangeErrorMsg.value = defaultError
      adjustRangeError.value = true
      setCurrentQuestionCompleted(false)
      return false
    }
  }
  
  if ((typeof val75.value === 'number') && (minProxy.value > val75.value || val75.value > maxProxy.value)) {
    if (val75Proxy.value != null && val75Proxy.value > minProxy.value && val75Proxy.value < maxProxy.value) {
      if (val75Proxy.value <= val25Proxy.value) {
        adjustRangeErrorMsg.value = defaultError
        adjustRangeError.value = true
        setCurrentQuestionCompleted(false)
        return false
      } 
    } else {
      adjustRangeErrorMsg.value = defaultError
      adjustRangeError.value = true
      setCurrentQuestionCompleted(false)
      return false
    }
  }

  if ((typeof val50.value === 'number') && (minProxy.value > val50.value || val50.value > maxProxy.value)) {
    if (val50Proxy.value != null && val50Proxy.value > minProxy.value && val50Proxy.value < maxProxy.value) {
      if (val50Proxy.value <= val25Proxy.value || val50Proxy.value >= val75Proxy.value) {
        adjustRangeErrorMsg.value = defaultError
        adjustRangeError.value = true
        setCurrentQuestionCompleted(false)
        return false
      }
    } else {
      adjustRangeErrorMsg.value = defaultError
      adjustRangeError.value = true
      setCurrentQuestionCompleted(false)
      return false
    }
  }

  if (typeof prob25.value === 'number') {
    if (typeof prob75.value === 'number') {
      if (prob25Proxy.value + prob75Proxy.value > 100) {
        adjustRangeErrorMsg.value = 'The sum of probabilities for value 1 and value 2 must be less than or equal to 100'
        adjustRangeError.value = true
        setCurrentQuestionCompleted(false)
        return false
      }
    }

    if (typeof prob50.value === 'number') {
      if (prob75Proxy.value + prob50Proxy.value > 100) {
        adjustRangeErrorMsg.value = 'The sum of probabilities for value 2 and value 3 must be less than or equal to 100'
        adjustRangeError.value = true
        setCurrentQuestionCompleted(false)
        return false
      }

      if (prob25Proxy.value >= prob50Proxy.value) {
        adjustRangeErrorMsg.value = 'The probability for value 1 must be less than or equal to the probability for value 2'
        adjustRangeError.value = true
        setCurrentQuestionCompleted(false)
        return false
      }
    }
  }

  if (!isSuccessConfirmOnce.value) {
    isSuccessConfirmOnce.value = true
  }
  
  adjustRangeErrorMsg.value=""
  adjustRangeError.value = false
  min.value = minProxy.value
  max.value = maxProxy.value
  val25.value = val25Proxy.value
  val50.value = val50Proxy.value
  val75.value = val75Proxy.value
  prob25.value = prob25Proxy.value
  prob50.value = prob50Proxy.value
  prob75.value = prob75Proxy.value
  setCurrentQuestionCompleted(true) //TODO
  return true
}

watch([val25Proxy, val50Proxy,  val75Proxy, prob25Proxy, prob50Proxy, prob75Proxy], (response) => {
  if (isSuccessConfirmOnce.value) {
    setTimeout(() => {
      if (adjustRange()) {
        if (prob25Proxy.value + prob75Proxy.value > 100) {
          adjustRangeErrorMsg.value = 'The sum of probabilities for value 1 and value 2 must be less than or equal to 100'
          adjustRangeError.value = true
          setCurrentQuestionCompleted(false)
          return
        }

        if (prob25Proxy.value > prob50Proxy.value && typeof prob50Proxy.value === 'number') {
          adjustRangeErrorMsg.value = 'The probability for value 1 must be less than or equal to the probability for value 2'
          adjustRangeError.value = true
          setCurrentQuestionCompleted(false)
          return
        }

        if (prob50Proxy.value + prob75Proxy.value > 100) {
          adjustRangeErrorMsg.value = 'The sum of probabilities for value 2 and value 3 must be less than or equal to 100'
          adjustRangeError.value = true
          setCurrentQuestionCompleted(false)
          return
        }

        if (val25Proxy.value > val50Proxy.value || val50Proxy.value > val75Proxy.value) {
          adjustRangeErrorMsg.value = defaultError
          adjustRangeError.value = true
          setCurrentQuestionCompleted(false)
          return
        } else {
          adjustRangeErrorMsg.value = ''
          adjustRangeError.value = false
          val25.value = val25Proxy.value
          val50.value = val50Proxy.value
          val75.value = val75Proxy.value
          prob25.value = prob25Proxy.value
          prob50.value = prob50Proxy.value
          prob75.value = prob75Proxy.value
        }
      }
    }, 400)
  }
})
</script>

<style scoped>
.input-style {
  @apply w-full h-8 px-4 border border-gray-300 rounded;
}
.confirm-button {
  @apply mt-8 px-2 border border-priorb-PRIMARY text-white rounded-md py-2 px-3 bg-priorb-PRIMARY font-semibold ms-auto;
}
</style>
