<template>
  <div class="container flex flex-col items-center justify-center max-w-[90ch]">
    <QuestionBlock
      :content="content"
    />

    <PicotDetails :picot="content?.picot" />

<div class="flex flex-col w-full">
   <Probability
    v-if="currentPageValue"
      v-model:min="currentPageValue.min"
      v-model:max="currentPageValue.max"
      v-model:val25="currentPageValue.val25"
      v-model:prob25="currentPageValue.prob25"
      v-model:val50="currentPageValue.val50"
      v-model:prob50="currentPageValue.prob50"
      v-model:val75="currentPageValue.val75"
      v-model:prob75="currentPageValue.prob75"
      :minLimit="content?.minLimit ?? -Infinity"
      :maxLimit="content?.maxLimit ?? Infinity"
      :units="content?.units"
  />
  
  <div class="grow min-w-[400px] ps-2 pe-4 h-[500px] mb-20" v-if="currentPageValue?.completed">
    <div class="text-center">
      <p>Check if this is what you roughly have in mind:</p>
    </div>
    <ResultsChart
      :resultsArr="chartPoints"
      v-model:chart="chartRef"
      :xAxisLabel="'Estimated Values'"
      :yAxisLabel="'Probability (%)'"
    />
  </div>

  <RationaleInput
      v-if="currentPageValue?.showRationale"
      v-model="currentPageValue.rationale"
      :content="content"
      :placeholder="content.rationalePlaceholder"
      :showStatus="shouldTriggerValidation"
      :required="currentPageValue.rationaleRequired ?? true"
    />

</div>
</div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import PicotDetails from '@/components/survey/PicotDetails.vue'
import Probability from '@/components/survey/Probability.vue'
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import RationaleInput from '@/components/survey/RationaleInput.vue'
import { WorkshopProbabilityAgendaItem } from '@/models/AgendaClass';
import { sharedPropsJs } from '@/lib/utils';
const props = defineProps(sharedPropsJs)
const expertStore = useExpertStore()
const { currentPageValue,  shouldTriggerValidation } = storeToRefs(expertStore)
const { setCurrentQuestionCompleted } = expertStore
import ResultsChart from '@/components/admin/ResultsChart.vue'
const chartRef = ref(null)
WorkshopProbabilityAgendaItem.initialiseResponse(currentPageValue, props)
// TODO
if (!props.content?.rationaleInstructions) {
  if(!props.content) props.content = {}
  props.content.rationaleInstructions = 'Please provide a rationale for your estimates.'
}

const rationale = computed(() => currentPageValue.value.rationale)
const min = computed(()=>currentPageValue?.value?.min)
const max = computed(()=>currentPageValue?.value?.max)
const val25 = computed(()=>currentPageValue?.value?.val25)
const prob25 = computed(()=>currentPageValue?.value?.prob25)
const val50 = computed(()=>currentPageValue?.value?.val50)
const prob50 = computed(()=>currentPageValue?.value?.prob50)
const val75 = computed(()=>currentPageValue?.value?.val75)
const prob75 = computed(()=>currentPageValue?.value?.prob75)

const chartPoints = computed(() => {
  return [
    { 
      name: 'Logarithmic',
      expertId: 'logarithmic',
      label: {
        show: true,
        position: 'bottom',
        textStyle: {
          fontSize: 20
        }
      },
      showSymbol: false,
      lineStyle: {
        color: '#000000',
        width: 4,
        type: 'solid'
      },
      step: false,
      // if completed, send the REST call to backend.
      data: currentPageValue.value.completed ? [
        [min.value, 0],
        [val25.value, prob25.value],
        [val50.value, prob50.value],
        [val75.value, 100 - prob75.value],
        [max.value, 100]
      ] : [],
    }
  ]
})

watch(
  currentPageValue,
  (response) => {
    if (!response) return
    let rationaleGiven = response.rationale?.length > 0 && response.rationale?.trim() !== ''
    const minMaxProvided = min.value != null && max.value != null
    const quantilesProvided = val25.value != null && val50.value != null && val75.value != null
    const probabilitiesProvided = prob25.value != null && prob50.value != null && prob75.value != null
    setCurrentQuestionCompleted(minMaxProvided && quantilesProvided && probabilitiesProvided && (rationaleGiven || response.showRationale === false || response.rationaleRequired === false))
  },
  { deep: true }
)
</script>

<style scoped></style>
