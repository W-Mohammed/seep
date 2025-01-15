<template>
    <div class="flex w-full flex-col absolute h-[584px] rounded-t-lg animate-bottom"
        :class="{
          'bottom-0': openAdjustRange,
          'bottom-[-538px]': !openAdjustRange
        }"
        >
          <div
            class="mt-4 rounded-t-lg bg-gray-100 mx-auto text-sm font-semibold  text-black hover:text-gray-700/80 text-center pt-0.5 px-4 pt-2 cursor-pointer"
            role="button" @click="openAdjustRange = !openAdjustRange"
          >
            <div >
              <Icon icon="bi:chevron-up" class="inline-block me-2 text-2xl" />
              Change range
            </div>
          </div>
          <!-- animate min-height -->
          <div class="flex flex-col gap-2 justify-center items-center opaque-bg h-[538px] z-4">
            <div class="max-w-[600px] flex flex-col">
              <div class="text-start me-auto font-semibold text-lg">Change range</div>
              <div class="flex pt-4 pb-2 gap-8">
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
                      :placeholder="xMin"
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
                      :placeholder="xMax"
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

              <div class="w-full  grow-0 bg-priorb-white py-4 px-4 flex rounded-lg  gap-2 justify-evenly items-center mt-4">
              <div class="font-semibold  pe-8 leading-tight">Would you like to <br> adjust the range</div>
              <div class="flex gap-2">
              <button class="px-2 border border-black text-black rounded-md py-2 px-3 font-semibold hover:bg-gray-100 bg-white" 
              @click="cancelAdjustRange()">
                Cancel
              </button>
              <button class="px-2 border border-black text-white rounded-md py-2 px-3 bg-black font-semibold hover:bg-black/80"
               @click="adjustRange()"
              >
                Confirm
              </button>
              </div>

              </div>
            </div>
            
          </div>
        </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
const emit = defineEmits(['resetChips'])
const props = defineProps(
    {
        xMinLimit: {
            type: Number,
            default: -Infinity
        },
        xMaxLimit: {
            type: Number,
            default: Infinity
        }
    })


    const openAdjustRange = ref(false)
    const xMin = defineModel('xMin')
    const xMax = defineModel('xMax')
    
    const xMinProxy = ref(null)
const xMaxProxy = ref(null)
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

  if (xMinProxy.value < props.xMinLimit || xMaxProxy.value > props.xMaxLimit) {
    adjustRangeErrorMsg.value = `Values must be between ${props.xMinLimit} and ${props.xMaxLimit}`
    adjustRangeError.value = true
    return
  }

  if (xMinProxy.value === xMin.value && xMaxProxy.value === xMax.value) {
    setTimeout(() => {
    openAdjustRange.value = false
  }, 250)
    return
  }

  resetChips()
  adjustRangeError.value = false
  xMin.value = xMinProxy.value
  xMax.value = xMaxProxy.value
  setTimeout(() => {
    openAdjustRange.value = false
    xMinProxy.value = null
    xMaxProxy.value = null
  }, 0)
}

const cancelAdjustRange = () => {
  xMinProxy.value = xMin.value
  xMaxProxy.value = xMax.value
  openAdjustRange.value = false
}


const resetChips = () => {
  emit('resetChips')
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
.opaque-bg {
  background-color: rgba(255, 255, 255, .9);
}

/* if backdrop support: very transparent and blurred */
@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
  .opaque-bg {
    background-color: rgba(255, 255, 255, 0.5);
    -webkit-backdrop-filter: blur(2em);
    backdrop-filter: blur(2em);
  }
}
</style>