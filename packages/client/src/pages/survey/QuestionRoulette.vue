<template>
  <div class="container flex flex-col items-center justify-start max-w-[90ch]">
    <!-- QUESTION -->
    <QuestionBlock
      :content="content"
    />

    <!-- PICOT -->
    <PicotDetails :picot="content?.picot" />

    <!-- TASK 1: inital range -->
<Transition name="fade2" mode="out-in">
    <div v-if="!rangeIsSet" class="task-instructions-container mt-8 w-full" >
      <div class="bg-priorb-100 text-priorb-500 text-xs px-2 py-1 rounded-sm inline-block mb-2">
        Task 1
      </div>

      <div class="border-priorb-100 border-l-4 ps-2 pt-1">
        Please define the range of values you think the outcome will fall within. 
        <div class="text-xs text-gray-500">
          You can still adjust the range afterwards
        </div>
      </div>
    </div>
    


    <!-- TASK 2: allocate chips -->
    <div 
    v-else
    class="task-instructions-container mt-8 w-full">
      <div class="bg-priorb-100 text-priorb-500 text-xs px-2 py-1 rounded-sm inline-block mb-2">
        Task 2
      </div>
      <div class="border-priorb-100 border-l-4 ps-2 pt-1">
        Place 20 chips on the grid. The number of chips in each bin shows how likely you think the
        value is to be in that range.
      </div>
    </div>
</Transition>
<div class="flex flex-col w-full">
<Transition name="fade2" mode="out-in">
<RouletteChartInitRange
      v-if="!rangeIsSet && currentPageValue"
      v-model:xMin="currentPageValue.xMin"
      v-model:xMax="currentPageValue.xMax"
      :xMinLimit="content?.xMinLimit ?? -Infinity"
      :xMaxLimit="content?.xMaxLimit ?? Infinity"
      :units="currentPageValue?.xLabel"
    />

    <div v-else>
    <RouletteChart
    v-if="currentPageValue" 
      v-model:chips="currentPageValue.chips"
      v-model:xMin="currentPageValue.xMin"
      v-model:xMax="currentPageValue.xMax"
      :maxChips="currentPageValue.maxChips"
      :xBins="currentPageValue.xBins"
      :yBins="currentPageValue.yBins"
      :xLabel="currentPageValue.xLabel"
      :showStatus="shouldTriggerValidation"
      :xMinLimit="content?.xMinLimit ?? -Infinity"
      :xMaxLimit="content?.xMaxLimit ?? Infinity"
    />

    <!-- free text justification -->
    <RationaleInput
      v-if="currentPageValue?.showRationale"
      v-model="currentPageValue.rationale"
      :placeholder="content.rationalePlaceholder"
      :showStatus="shouldTriggerValidation"
      :required="currentPageValue.rationaleRequired ?? true"
    />
  </div>
  </Transition>
</div>
  </div>
</template>

<script setup>
import { watch,computed,ref } from 'vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import RouletteChart from '@/components/survey/RouletteChart.vue'
import PicotDetails from '@/components/survey/PicotDetails.vue'
import RationaleInput from '@/components/survey/RationaleInput.vue'
import RouletteChartInitRange from '@/components/survey/RouletteChartInitRange.vue'
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import { sharedPropsJs } from '@/lib/utils';
const props = defineProps(sharedPropsJs)
const expertStore = useExpertStore()
const { currentPageValue, shouldTriggerValidation } = storeToRefs(expertStore)
const { setCurrentQuestionCompleted } = expertStore
import { RouletteAgendaItem } from '@/models/AgendaClass';

RouletteAgendaItem.initialiseResponse(currentPageValue, props)

const rangeIsSet = computed(() => {
  return currentPageValue?.value?.xMin !== undefined && currentPageValue?.value?.xMax !== undefined
})

watch(
  currentPageValue,
  (response) => {
    if(!response) return
    if (!response || !response.chips || !response.maxChips) return
    let chipsTotal = response.maxChips
    let chipsAllocated = response.chips.reduce((acc, curr) => acc + curr, 0)
    let allChipsAllocated = chipsAllocated >= chipsTotal
    let rationaleGiven = response.rationale?.length > 0 && response.rationale?.trim() !== ''

    setCurrentQuestionCompleted(allChipsAllocated && (rationaleGiven || response.showRationale === false || response.rationaleRequired === false))
  },
  { deep: true }
)
</script>

<style scoped>

.fade2-enter-active, .fade2-leave-active {
  transition: opacity 0.25s;
}
.fade2-enter, .fade2-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}



</style>
