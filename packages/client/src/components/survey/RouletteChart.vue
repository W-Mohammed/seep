<template>
  <div class="my-10 w-full bg-white border rounded-lg border-gray-300 overflow-hidden"
  :class="{'border-priorb-500': showStatus && !allChipsAllocated}"
  >
    <div class="flex flex-col grow relative overflow-y-hidden pt-4">
      <!-- remaining chips at top -->
      <div class="px-4">
        <div class="flex justify-between items-center">
          <div>Chips:</div>
          <div class="ms-auto mb-1">
            <span class="text-priorb-500 text-2xl">{{ chipsLeft }}</span>
            /
            <span class="text-gray-500 font-light">{{ maxChips }}</span>
          </div>
        </div>
        <div class="mb-4">
          <div class="flex justify-stretch flex-row-reverse" style="width: 100%; max-width: 100%">
            <div
              v-for="(chip, chipIndex) in maxChipsArray"
              :key="chipIndex"
              class="grow border-l border-r border-t border-b border-gray-100 h-4 grow bg-gray-300"
              :class="{
                'rounded-r-lg': chipIndex === 0,
                'rounded-l-lg': chipIndex === maxChips - 1
              }"
            >
              <div
                :class="{
                  chip: isStackChipLeft(maxChips - chipIndex),
                  'chip-ghost': isStackChipDiff(maxChips - chipIndex),
                  'rounded-r-lg': chipIndex === 0,
                  'rounded-l-lg': chipIndex === maxChips - 1
                }"
              ></div>
            </div>
          </div>
          <div class="text-xs pt-1 w-full text-end">
            <span class="text-gray-700 hover:text-gray-700/80" role="button" @click="resetChips()"
              >Reset</span
            >
          </div>
        </div>
      </div>

      <div class="pb-[38px] overflow-y-hidden">
        <!-- roulette table chart -->
        <div class="flex items-center grow h-[360px] overflow-hidden mb-4 mx-3">
          <div
            style="
              width: 20px;
              transform: rotate(-90deg) translateY(-100%) translateX(-50%);
              white-space: nowrap;
              position: absolute;
              z-index: 2;
            "
            v-if="yLabel"
          >
            {{ yLabel }}
          </div>
          <table
            style="border-collapse: collapse !important"
            class="grow w-full"
            @mouseleave="asyncGhostDestroy()"
          >
            <tr v-for="(yBin, yIndex) in yBinsArr" :key="yIndex">
              <td
                v-for="(xBin, xIndex) in xBinsArr"
                :key="xIndex"
                class="bin-cell"
                :style="{
                  width: 100 / xBins + '%',
                  height: 100 / yBins + '%'
                }"
                @mouseenter="createGhostChip(xIndex, yBins - yIndex)"
                @click="fillChipsIntoBin(xIndex, yBins - yIndex)"
              >
                <div
                  :class="{
                    chip: hasChip(xIndex, yBins - yIndex),
                    'chip-ghost': toggleGhostChip(xIndex, yBins - yIndex),
                    'rounded-tl-md': xIndex === 0 && yIndex === 0,
                    'rounded-bl-md': xIndex === 0 && yIndex === yBins - 1,
                    'rouned-tr-md': xIndex === xBins - 1 && yIndex === 0,
                    'rounded br-md': xIndex === xBins - 1 && yIndex === yBins - 1
                  }"
                ></div>
              </td>
            </tr>
            <!-- add axis labels 0, 10, ... 100 -->
            <tr style="border: none !important; height: 0; margin-top: -10px">
              <th v-for="(xBin, xBinIndex) in xAxisLabels" :key="xBinIndex">
                <div
                  class="text-xs text-gray-500"
                  style="transform: translateX(-50%) translateY(5%); position: absolute; z-index: 0"
                >
                  {{ xBin }}
                </div>
              </th>
            </tr>
          </table>
          <div style="width: 10px" v-if="yLabel"></div>
        </div>
        <div v-if="xLabel">
          <div class="text-center text-sm text-black hover:text-gray-700/80">
            {{ xLabel }}
          </div>
        </div>


        <!-- adjust range -->
        <RouletteChartAdjRange
          v-model:xMin="xMin"
          v-model:xMax="xMax"
          :xMinLimit="xMinLimit"
          :xMaxLimit="xMaxLimit"
          @resetChips="resetChips"
        />

        
      </div>
    </div>

    <div
      class="flex flex-col grow px-4 border-gray-300 border-t"
      :class="{ 'border-t': chipsAllocated > 0, 'border-t-0': chipsAllocated === 0 }"
    >
      <RouletteSummary
        :chipsAllocated="chipsAllocated"
        :chips="chips"
        :xMin="xMin"
        :xMax="xMax"
        :xBins="xBins"
        :unit="xLabel"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import RouletteSummary from '@/components/survey/RouletteSummary.vue'
import RouletteChartAdjRange from '@/components/survey/RouletteChartAdjRange.vue'
const props = defineProps({
  xBins: {
    type: Number,
    default: 10
  },
  yBins: {
    type: Number,
    default: 10
  },
  maxChips: {
    type: Number,
    default: 20
  },
  yLabel: {
    type: String,
    default: ''
  },
  xLabel: {
    type: String,
    default: ''
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  xMinLimit: {
    type: Number,
    default: -Infinity
  },
  xMaxLimit: {
    type: Number,
    default: Infinity
  }
})

const xMin = defineModel('xMin')
const xMax = defineModel('xMax')
const chips = defineModel('chips', { default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })
const chipsLeft = ref(props.maxChips - chips.value.reduce((a, b) => a + b, 0))

if (!chips.value || chips.value.length === undefined || chips.value.length !== props.xBins) {
  chips.value = Array.from({ length: props.xBins }, (_) => 0)
}
const yBins = ref(props.yBins)

watch(
  chips,
  (val) => {
    // change yBins, to allow fitting all chips, if needed
    let mostChipsInBin = Math.max(...val)
    if (mostChipsInBin > yBins.value - 1) {
      yBins.value = mostChipsInBin + 1
    } else {
      yBins.value = Math.max(props.yBins, mostChipsInBin + 1)
    }
  },
  { immediate: true, deep: true }
)

const xBinsArr = computed(() => {
  return Array.from({ length: props.xBins }, (_, i) => i)
})

const xAxisLabels = computed(() => {
  let decimals
  const diff = xMax.value - xMin.value
  if (diff >= 50) decimals = 0
  else if (diff >= 10) decimals = 1
  else if (diff >= 1) decimals = 2
  else decimals = 3
  return Array.from({ length: props.xBins + 1 }, (_, i) =>
    (xMin.value + (diff / props.xBins) * i).toFixed(decimals)
  )
})

const yBinsArr = computed(() => {
  return Array.from({ length: yBins.value }, (_, i) => i)
})

const ghostChipIndex = ref([])

const hasChip = (x, y) => {
  return chips.value[x] >= y
}

const chipDiff = ref(0)

const isStackChipLeft = (chipIndex) => {
  return chipIndex <= chipsLeft.value
}
const isStackChipDiff = (chipIndex) => {
  if (chipIndex === undefined) return false
  let diff = -chipDiff.value
  let indexDiff = chipsLeft.value - chipIndex

  if (diff == 0) return false
  if (diff > 0) {
    if (indexDiff >= 0 && indexDiff < diff) {
      return true
    }
  } else {
    if (indexDiff < 0 && indexDiff >= diff) {
      return true
    }
  }

  return false
}

const getChipDiff = (x, y, currentChipsX) => {
  let temp = currentChipsX - y
  if (temp >= 0) temp = temp + 1
  chipDiff.value = temp

  return -temp
}

const toggleGhostChip = (x, y) => {
  let ghostX = ghostChipIndex.value[0]
  if (x !== ghostX) return false

  let chipY = chips.value[x]
  let cursorY = ghostChipIndex.value[1]

  let diff = cursorY - chipY
  if (diff > 0) {
    if (diff > chipsLeft.value) cursorY = chipY + chipsLeft.value
    if (y <= cursorY && y > chipY) return true
    else return false
  } else if (diff < 0) {
    if (y >= cursorY && y <= chipY) return true
    else return false
  } else {
    return y === cursorY
  }
}

const createGhostChip = (xIndex, yIndex) => {
  getChipDiff(xIndex, yIndex, chips.value[xIndex])
  ghostChipIndex.value = [xIndex, yIndex]
}

const maxChipsArray = computed(() => {
  return Array.from({ length: props.maxChips }, (_, i) => i)
})
const fillChipsIntoBin = (x, y) => {
  let currX = chips.value[x]
  let diff = getChipDiff(x, y, currX)
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      if (chipsLeft.value <= 0) return
      chips.value[x] = chips.value[x] + 1
      chipsLeft.value = chipsLeft.value - 1
    }
  } else if (diff < 0) {
    for (let i = 0; i < -diff; i++) {
      if (chips.value[x] <= 0) return
      chips.value[x] = chips.value[x] - 1
      chipsLeft.value = chipsLeft.value + 1
    }
  } else {
    return
  }
}

const asyncGhostDestroy = () => {
  setTimeout(() => {
    chipDiff.value = 0
    ghostChipIndex.value = []
  }, 0)
}

const resetChips = () => {
  chips.value = Array.from({ length: props.xBins }, (_) => 0)
  chipsLeft.value = props.maxChips
}

const chipsAllocated = computed(() => {
  return chips.value.reduce((a, b) => a + b, 0)
})

const allChipsAllocated = computed(() => {
  return chipsAllocated.value >= props.maxChips
})
</script>

<style scoped>
.bin-cell {
  padding: 0;
}

table {
  height: 100%;
  border-collapse: separate;
  border: none;
  border-radius: 16px;
}

td {
  border: solid 1px #e2e8f0;
  padding: 0;
}
tr {
  border: none;
  width: 100%;
  padding: 0;
}
.chip {
  width: 100%;
  height: 100%;
  @apply bg-priorb-500;
  position: relative;
  animation: ghost 0.5s;
}
.chip-ghost {
  width: 100%;
  height: 100%;
  background-color: theme('colors.priorb.300');
  position: relative;
  animation: ghost 0.5s;
}

@keyframes ghost {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-bottom {
  transition: bottom 0.25s;
}

</style>
