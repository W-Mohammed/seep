<template>
    <div>
        <textarea
        :rows="props.rows"
        v-model="value"
        :placeholder="props.placeholder"
        class="text-lg px-2 border-s-4 py-2 mb-2 focus:outline-none w-full focus:ring-1 ring-0 focus:border-s-4  focus:rounded-none"
        :class="'border-' + props.color + ' ' + props.class + ' ' + 'focus:border-' + props.color"
        @keyup="textAreaAdjust"
        @click="textAreaAdjust"
      />

    </div>
</template>

<script setup>
import { textAreaAdjust, allTextAreaAdjustOnStart } from '@/lib/utils'
const value = defineModel()
const props = defineProps({
    placeholder: {
        type: String,
        default: ''
    },
    rows: {
        type: Number,
        default: 1
    },
    class: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'priorb-50'
    }
})
allTextAreaAdjustOnStart()
</script>

<style >
/* focus-visible remove outline */
textarea:focus-visible, textarea:focus {
    outline: none !important;
    
}

</style>