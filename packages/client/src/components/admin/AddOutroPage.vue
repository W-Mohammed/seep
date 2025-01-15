<template>
  <div>    
    <div>
      <div>
        <input
         class="text-lg px-2 border-s-4 border-gray-100  py-2 mb-8 focus:outline-none w-full"
         placeholder="Type title here"
        v-model="lockedScreen.content.title"
        >
        </input>
      </div>
      <div>
        <div class="flex flex-col gap-4 px-3">
          <textarea v-model="lockedScreen.content.body" class="text-base w-full border border-gray-300 rounded px-2 py-2 focus:outline-none leading-base mb-4"
          placeholder="Type here"
          :rows="8"
          />
          <div 
          class="text-sm"> 
          <div class="text-gray-600 text-left text-sm mb-2 font-semibold">Contact Information</div>
          <div class="bg-gray-50 rounded-lg">
            <div class="flex flex-col gap-4 ps-2 pt-2 pb-4 text-left">
              <div>
                <div class="flex justify-between items-center px-2 pt-2 pb-1">
                  <div class="flex flex-col gap-1">
                    <label>Name:</label>
                  </div>
                  <div class="text-priorb-secondary font-semibold cursor-pointer flex items-center gap-1" @click="showModal = true">
                    Edit
                    <Icon icon="bi:pencil" class="me-1 text-lg" />
                  </div>
                </div>
                <label class="flex flex-col gap-1 px-2 text-base">{{ lockedScreen.content.contactPerson }}</label>
              </div>
              <div class="flex flex-col gap-1 px-2">
                <label>Organisation:</label>
                <label class="text-base">{{ lockedScreen.content.contactOrganisation }}</label>
              </div>
              <div class="flex flex-col gap-1 px-2">
                <label>Email:</label>
                <label class="text-base">{{ lockedScreen.content.contactEmail }}</label>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <ContactInfoModal 
    v-model:showModal="showModal"
    v-model:contactName="lockedScreen.content.contactPerson"
    v-model:organisation="lockedScreen.content.contactOrganisation"
    v-model:email="lockedScreen.content.contactEmail"  
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ContactInfoModal from '@/components/admin/ContactInfoModal.vue'

const SubmitPage = defineModel('SubmitPage')
const lockedScreen = defineModel('lockedScreen')
const showModal = ref(false)

</script>

<style scoped>
label {
  font-weight: 500;
}
</style>
