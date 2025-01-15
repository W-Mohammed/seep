<template>
  <div class="flex flex-col" v-if="agendaItem?.content?.abovePdf">
    <div class="">
      <div class="h2">

        <TextField
                v-model="agendaItem.content.abovePdf.title"
          placeholder="Add title here (optional)"
      color="priorb-300"
    />

      </div>
      <div >
        <PellEditor v-model="agendaItem.content.abovePdf.body" />    
      </div>
    </div>

    
    <div class="flex flex-col">
      <div class="rounded mt-4 max-w-[85ch] mx-auto w-full">
        <!-- upload a pdf -->
        
        <div  class="flex items-stretch bg-white my-2 h-10">
          <button class="border px-1 py-0.5 rounded-e-none rounded-s border-gray-500 cursor-pointer bg-priorb-primary text-white">
          <label for="uploadPdf" class="cursor-pointer hover:opacity-75">
          <span
          v-if="!agendaItem.content.pdf"
          class="whitespace-nowrap px-2"
          >Upload PDF</span>
          <span
          v-else
          class="whitespace-nowrap px-2"
          >Change file</span>
          
          </label>
          </button>
          <input
            type="file"
            id="uploadPdf"
            name="uploadPdf"
            accept="application/pdf"
            @change="handleFileUpload"
            class="border-t border-b border-gray-500 focus:outline-none px-1 w-full align-middlep py-1.5 px-4"
          />
          
          <!-- remove file button -->
          <button
            @click="removePdf"
            :disabled="!agendaItem.content.pdf"
            class="bg-white text-black border border-gray-500 px-1 py-0.5 rounded-e rounded-s-none"
            
          >
            <Icon icon="bi:trash" class="text-2xl" :class="{
              'cursor-not-allowed': !agendaItem.content.pdf,
              'text-gray-300': !agendaItem.content.pdf
            }" />
          </button>
        </div>
        <div v-if="agendaItem.content.pdf">
          <iframe
            :src="getPdfURI()"
            width="100%"
            style="height: calc(100vh - 140px)"
            class="overflow-hidden animate-max-h px-6"
            frameborder="100"
            allow="fullscreen"
            :style="{ 'max-height': agendaItem.content.pdf ? 'calc(100vh - 140px)' : '0' }"
          />
        </div>
      </div>
    </div>
    <div
      class="flex items-center text-gray-900 border rounded-md px-2 py-1 border-gray-500 w-fit text-sm my-4 "
    >
      <Icon icon="bi:info-circle" class="text-xl me-2" />
      Upload any Information that you would like to share with the Experts as a PDF (max. 5 MB).
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import PellEditor from '@/components/admin/PellEditor.vue'
import TextField from '@/components/admin/TextField.vue'
import { initAgendaItem } from '@/lib/addAgendaItemUtils'
const agendaItem = defineModel()
agendaItem.value = initAgendaItem('backgroundPage', agendaItem.value)

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    // check if file is pdf
    if (file.type !== 'application/pdf') {
      alert('Please upload a pdf file')
      return
    }
    const pdf = e.target.result
    const pdfBase64 = e.target.result.split(',')[1]
    // check size of pdf, if greater than 10MB, return error
    if (pdfBase64.length > 5000000) {
      alert('File size too large. Please upload a file less than 5MB')
      return
    }
    agendaItem.value.content.pdf = pdfBase64
  }
  reader.readAsDataURL(file)
 
}


const getPdfURI = () => {
  return `data:application/pdf;base64,${agendaItem.value.content.pdf}#view=FitH`
}

const removePdf = () => {
  agendaItem.value.content.pdf = ''
}

</script>

<style scoped>
::-webkit-file-upload-button {
   display: none;
}

</style>
