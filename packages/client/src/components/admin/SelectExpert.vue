<template>
  <div class="w-full mt-8">
    <div class="h2  text-sm text-gray-900">Select View:</div>
    <div class="checkbox-row checkbox-pool">
    <input
    id="check-pooled"
    class="checkbox-item"
      type="checkbox"
      v-model="selectedExpert"
      name="expert"
      value="linearPool"
    />
    <label for="check-pooled" class="control-label">Pooled</label>
    </div>
    <div v-for="(expert, i) in currentExperts" :key="i" class="checkbox-row ">
      <input
      class="checkbox-item"
        type="checkbox"
        :id="'check' + expert._id"
        :value="expert._id"
        v-model="selectedExpert"
        name="expert"
      />
      <label class="control-label" :for="'check' + expert._id"
      
      >{{ expert.name }}</label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentExperts: Array,
})
const selectedExpert = defineModel()
</script>

<style scoped>
.checkbox-row {
  display: flex;
  align-items: center;
}
.checkbox-pool {
  font-weight: 500;
  font-size: 1.1rem;
  padding-top:2px;
}
.checkbox-item {
  margin-right: 0.5rem;
}

input[type='checkbox'] {
 @apply accent-priorb-100;
 width:20px;
 height:20px;
 outline: none;
 cursor: pointer;
}


input[type='checkbox']:checked {
 outline: 1px solid lightgray;
}

label:hover {
  @apply bg-priorb-50/80;
}

.control-label {
 cursor: pointer;
  flex-grow: 1;
  padding: 0.1rem;
  border-radius: 0.25rem;
}

</style>
