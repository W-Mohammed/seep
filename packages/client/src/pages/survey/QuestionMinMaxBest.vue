<template>
  <div class="container flex flex-col items-center justify-center max-w-[90ch]">
    <!-- QUESTION -->
    <QuestionBlock
      :content="content"
    />

    <!-- PICOT -->
    <PicotDetails :picot="content?.picot" />

<div class="flex flex-col w-full">
   <MinMaxBest
    v-if="currentPageValue"
      v-model:min="currentPageValue.min"
      v-model:max="currentPageValue.max"
      v-model:best="currentPageValue.bestEstimate"
      :minLimit="content?.minLimit ?? -Infinity"
      :maxLimit="content?.maxLimit ?? Infinity"
      :units="content?.units"
  />
  
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
import { onBeforeMount, ref, computed, watch } from 'vue'
import { useExpertStore } from '@/store/expertStore'
import { storeToRefs } from 'pinia'
import PicotDetails from '@/components/survey/PicotDetails.vue'
import MinMaxBest from '@/components/survey/MinMaxBest.vue'
import QuestionBlock from '@/components/survey/QuestionBlock.vue'
import RationaleInput from '@/components/survey/RationaleInput.vue'
import { MinMaxBestAgendaItem } from '@/models/AgendaClass';
import { sharedPropsJs } from '@/lib/utils';
const props = defineProps(sharedPropsJs)
const expertStore = useExpertStore()
const { currentPageValue,  shouldTriggerValidation } = storeToRefs(expertStore)
const { setCurrentQuestionCompleted } = expertStore

MinMaxBestAgendaItem.initialiseResponse(currentPageValue, props)

if (!props.content?.rationaleInstructions) {
  if(!props.content) props.content = {}
  props.content.rationaleInstructions = 'Please provide a rationale for your estimate.'
}

const rationale = computed(() => currentPageValue.value.rationale)
const min = computed(()=>currentPageValue?.value?.min)
const max = computed(()=>currentPageValue?.value?.max)
const best = computed(()=>currentPageValue?.value?.bestEstimate)

watch(
  currentPageValue,
  (response) => {
    if (!response) return
    let rationaleGiven = response.rationale?.length > 0 && response.rationale?.trim() !== ''
    const minMaxBestProvided = min.value != null && max.value != null && best.value != null
    setCurrentQuestionCompleted(minMaxBestProvided && (rationaleGiven || response.showRationale === false || response.rationaleRequired === false))
  },
  { deep: true }
)

</script>

<style scoped></style>
