<template>
    <div class="flex items-center gap-3">
        <label class="switch"
        :class="disabled ? 'cursor-not-allowed opacity-40': ''"
        >
          <input type="checkbox" v-model="modelValue" :value="true"
          :disabled="disabled"
          id="switch"
           />
          <span class="slider round"></span>
        </label>
        <label for="switch" :class="disabled ? 'cursor-not-allowed': 'cursor-pointer'">{{ label }}</label>
      </div>
</template>

<script setup>
defineProps({
  label: String,
  disabled: Boolean,
})
const modelValue = defineModel()
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 42px; /* Reduced width by 30% (60px * 0.7) */
  min-width: 42px; 
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
  background-color: theme('colors.priorb.500');
}

input:focus + .slider {
  box-shadow: 0 0 1px theme('colors.priorb.500');
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
