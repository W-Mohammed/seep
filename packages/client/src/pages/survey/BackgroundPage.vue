<template>
  <div class="my-8 break-words text-pretty">
  <div v-if="content.sectionTitle">
    {{ content.sectionTitle }}
  </div>
  <div v-if="content.sectionDescription">
    {{ content.sectionDescription }}
  </div>
    <div v-if="content?.abovePdf?.body || content.abovePdf?.title" class="para-project-bg">
      <div class="h2">{{ content.abovePdf?.title }}</div>
      <div  v-html="content?.abovePdf?.body"></div>
    </div>

    <div v-if="content.pdf" class="flex flex-col">
      <div
        class="rounded-none md:rounded lg:rounded-lg border max-w-[85ch] mx-auto w-full"
        style="background-color: #313639"
      >
        <button
          @click="showPdf = !showPdf"
          class="text-white px-0.5 py-0.5 mx-1 my-1 text-sm flex gap-1"
        >
          <Icon :icon="showPdf ? 'bi:chevron-down' : 'bi:chevron-right'" class="w-4 h-4" />
          {{ showPdf ? 'Hide' : 'Show' }} Document
        </button>

        <div
          :class="{
            border: true,
            'overflow-hidden': !showPdf,
            'overflow-auto': showPdf,
            'animate-max-h': true,
            'max-h-[calc(100vh - 1040px)]': showPdf
          }"
          :style="{
            'max-height': showPdf ? 'calc(100vh - 240px) !important' : '0'
          }"
        >
          <VuePdfEmbed :source="getPdfURI()" ref="pdfElement" />
        </div>
      </div>
    </div>

    <div v-if="content?.belowPdf?.body || content.belowPdf?.title" class="para-project-bg mt-8">
      <div class="h2">{{ content.belowPdf?.title }}</div>
      <div class="p">{{ content.belowPdf?.body }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import VuePdfEmbed from 'vue-pdf-embed'
// import 'vue-pdf-embed/dist/style/index.css'
import { sharedPropsJs } from '@/lib/utils';
const props = defineProps(sharedPropsJs)
const getPdfURI = () => {
  return `data:application/pdf;base64,${props.content.pdf}#view=FitH`
}
const showPdf = ref(true)
</script>

<style scoped>
.para-project-bg {
  background-color: #f9f9f9;
  padding: 20px;
  @apply max-w-[85ch] mx-auto rounded-none md:rounded lg:rounded-lg mb-8;
}

.para-project-bg .h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.para-project-bg .p {
  font-size: 1rem;
  line-height: 1.5;
}

.animate-max-h {
  transition: max-height 0.5s;
}
</style>
