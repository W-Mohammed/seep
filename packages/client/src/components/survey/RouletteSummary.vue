<template>
  <div class="pt-4 roulette-summary" v-show="thirds.length">
    <div class="font-bold">Summary</div>
    <TransitionGroup name="list" tag="ul" class="list-disc px-8">
      <li v-for="(third, _i) in thirds" :key="_i">
        The probability that the {{ unit }} is between
        <span class="text-priorb-500 font-bold"> {{ third.lowerEdge }} </span>
        and
        <span class="text-priorb-500 font-bold">
          {{ third.upperEdge }}
        </span>
        is
        <span class="text-priorb-500 font-bold"> {{ third.proportion }}% </span>
      </li>
    </TransitionGroup>
    <ul class="list-disc px-8"></ul>

    <div class="text-gray-500 my-4 text-sm">
      Please review the summary and make sure the distribution of chips is as you intended.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { splitChipsIntoEqualParts } from '@/lib/rouletteUtils'
const props = defineProps({
  chipsAllocated: {
    type: Number,
    default: 0
  },
  chips: {
    type: Array,
    default: () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  xMin: {
    type: Number,
    default: 0
  },
  xMax: {
    type: Number,
    default: 100
  },
  xBins: {
    type: Number,
    default: 10
  },
  unit: {
    type: String,
    default: 'proportion'
  }
})

const thirds = computed(() => {
  return splitChipsIntoEqualParts(
    props.chips,
    props.xMin,
    props.xMax,
    3
  )
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>
