<template>
  <div @click="anonymiseExpertsProxy">
    <div class="flex items-center gap-2 py-2 px-2"
          style="pointer-events: none; border-radius: 16px;;"
    
    >
        <div class="switch"
        :class="{
          'cursor-not-allowed': disabled,
          'opacity-40': disabled}"
        >
          <input type="checkbox" 
          id="anonymise"
          v-model="anonymiseExperts" :value="true"
          :disabled="disabled"
           />
          <span class="slider round"></span>
        </div>
        <label for="anonymise" class="text-md hidden md:block
        pt-0.5
        ">{{ label }}</label>
        <Icon icon="bi:incognito" class="block md:hidden text-lg" />
        
      </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
const adminStore = useAdminStore()
const { anonymiseExperts } = storeToRefs(adminStore)
import {Icon } from '@iconify/vue'
defineProps({
  label: {
    type: String,
    default: 'Anonymise',
  },
  disabled: Boolean,
})

// check change in anonymiseExperts, if ig goes from true to false, ask for confirmation
const anonymiseExpertsProxy = () => {
  const value = !anonymiseExperts.value
  adminStore.anonymiseExperts = value
}


</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 42px; /* Reduced width by 30% (60px * 0.7) */
  height: 24px; /* Reduced height by 30% (34px * 0.7) */
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px; /* Reduced size by 30% (26px * 0.7) */
  width: 18px; /* Reduced size by 30% (26px * 0.7) */
  left: 4px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  /* background-color: rgb(239 68 68); */
  /* background-color: #005F89; */
  @apply bg-priorb-secondary; 
}

.text-secondary {
  color: #005F89;
}

input:focus + .slider {
  box-shadow: 0 0 1px rgb(239 68 68);
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px); /* Adjusted based on new width */
  -ms-transform: translateX(18px);
  transform: translateX(18px); /* Adjusted based on new width */
}

/* Rounded sliders */
.slider.round {
  border-radius: 17px; /* Reduced based on new height */
}

.slider.round:before {
  border-radius: 50%;
}
</style>
