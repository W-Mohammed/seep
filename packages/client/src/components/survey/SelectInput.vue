<script setup>
import { Icon } from '@iconify/vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'radix-vue'

const selected = defineModel({
  type: String,
  default: ''
})

defineProps({
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Jump to page'
  },
  currentPage: {
    type: Number,
    default: null
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  labelHidden: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <SelectRoot :name="name" v-model="selected">
    <SelectTrigger
      class="inline-flex min-w-[160px] items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-grass11 hover:bg-priorb-50/80 data-[placeholder]:text-black outline-none border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer"
      aria-label="Customise options"
    >
      <SelectValue :placeholder="placeholder" />
      <Icon icon="radix-icons:chevron-down" class="h-3.5 w-3.5" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="min-w-[160px] bg-white rounded will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left] border :animate-slideRightAndFade z-[100]"
        :side-offset="5"
      >
        <SelectScrollUpButton
          class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default"
        >
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="p-[5px]">
          <SelectLabel
            :class="[{ 'sr-only': labelHidden }, 'px-[25px] text-xs leading-[25px] text-gray-400']"
          >
            {{ label }}
          </SelectLabel>
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              :class="{
                'data-[highlighted]': option === selected,
                'bg-priorb-100': index === currentPage
              }"
              :disabled="index === currentPage"
              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 cursor-pointer"
              :value="option"
            >
              <SelectItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon icon="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton
          class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default"
        >
          <Icon icon="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
