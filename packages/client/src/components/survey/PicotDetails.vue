<template>
  <div class="w-full" v-if="hasPicotInfo">
    <div class="flex border-b-2 pb-4 mt-10 mb-3 cursor-pointer" @click="showPicot = !showPicot">
      <div class="flex items-center text-md text-gray-700 me-auto">
        <Icon icon="bi:info-circle" class="text-gray-900 me-1" />
        Show PICOT Information
      </div>
      <div class="flex items-center text-md text-gray-700">
        <Icon
          icon="bi:chevron-down"
          class="text-gray-900 me-1"
          :class="{
            'rotate-chevron': showPicot,
            'unrotate-chevron': !showPicot
          }"
        />
      </div>
    </div>
    <div
      :style="{
        'max-height': showPicot ? '1000px' : '0'
      }"
      class="px-2 w-full overflow-hidden transition-max-height"
    >
      <div class="picot-note" v-if="picot?.note">
        {{ picot.note }}
      </div>
      <div v-if="picot?.populationDescription">
        <div class="picot-badge badge-blue">{{ picot.populationLabel ?? 'Population:' }}</div>
        <div class="picot-item">
          {{ picot.populationDescription }}
        </div>
      </div>
      <div v-if="picot?.interventionDescription">
        <div class="picot-badge badge-red">
          {{ picot.interventionLabel ?? 'Intervention:' }}
        </div>
        <div class="picot-item">
          {{ picot.interventionDescription }}
        </div>
      </div>
      <div v-if="picot?.comparisonDescription">
        <div class="picot-badge badge-green">
          {{ picot.comparisonLabel ?? 'Comparison:' }}
        </div>
        <div class="picot-item">
          {{ picot.comparisonDescription }}
        </div>
      </div>
      <div v-if="picot?.outcomeDescription">
        <div class="picot-badge badge-purple">
          {{ picot.outcomeLabel ?? 'Outcome:' }}
        </div>
        <div class="picot-item">
          {{ picot.outcomeDescription }}
        </div>
      </div>
      <div v-if="picot?.timeDescription">
        <div class="picot-badge badge-yellow">
          {{ picot.timeLabel ?? 'Time:' }}
        </div>
        <div class="picot-item">
          {{ picot.timeDescription }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
const props = defineProps({
  picot: {
    type: Object || Boolean,
    required: false,
    default: () => ({})
  }
})

const hasPicotInfo = computed(() => {
  return props.picot && (props.picot.populationDescription || props.picot.interventionDescription || props.picot.comparisonDescription || props.picot.outcomeDescription || props.picot.timeDescription)
})

// props.picot && Object.keys(props.picot).length > 0
const showPicot = ref(false)
</script>

<style scoped>
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
