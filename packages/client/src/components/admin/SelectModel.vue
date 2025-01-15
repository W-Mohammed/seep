<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center space-x-2">
      <label
        :class="{
          'chip-selected': showCharts === 'histogram',
          'chip-unselected': showCharts !== 'histogram'
        }"
        class="chip-label"
        for="histogram"
        >Histogram</label
      >
      <input type="radio" id="histogram" value="histogram" v-model="showCharts" class="hidden" />
    </div>
    <div class="flex items-center space-x-2">
      <label
        :class="{
          'chip-selected': showCharts === 'fitted',
          'chip-unselected': showCharts !== 'fitted'
        }"
        class="chip-label"
        for="fitted"
        >Fitted</label
      >
      <input type="radio" id="fitted" value="fitted" v-model="showCharts" class="hidden" />
    </div>
    <div class="flex items-center space-x-2">
      <label
        :class="{
          'chip-selected': showCharts === 'both',
          'chip-unselected': showCharts !== 'both'
        }"
        class="chip-label"
        for="bothCharts"
        >Both</label
      >
      <input type="radio" id="bothCharts" value="both" v-model="showCharts" class="hidden" />
    </div>
  </div>
</template>

<script setup>
const showCharts = defineModel()
</script>

<style scoped>
.chip-label {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}
.chip-unselected {
  background-color: theme('colors.priorb.50');
  color: theme('colors.priorb.500');
}
.chip-selected {
  background-color: theme('colors.priorb.500');
  color: white;
}


</style>
