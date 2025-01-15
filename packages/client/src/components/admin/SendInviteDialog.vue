<template>
  <Dialog 
  :open="emailDialogOpen"
  @close="setIsOpen" class="relative z-50" :unmount="true">
  <div class="fixed inset-0 bg-black/30 mx-auto flex" aria-hidden="true" />
  <div class="fixed inset-0">
    <div
            class=" bg-white  shadow-lg px-8 py-4 rounded mx-auto my-10 w-[80ch] max-w-[100vw] h-[fit-content]"
          >
            <DialogPanel
              class="w-full"
            >
    <div class="">
      <div v-if="currentExpert?.email">
        <div>
          <DialogTitle>Send Survey Invite</DialogTitle>
        </div>
        <div class="grid gap-4 w-full">
          <div class="mt-4">
            <label class="text-gray-700 text-sm"> To: </label>
            <span class="font-semibold text-priorb-primary">
              {{ currentExpert?.email }}
            </span>
          </div>
          <div class="grid gap-1.5 py-2">
            <label for="subject" class="text-gray-700 text-sm">Subject</label>
            <input
              id="subject"
              type="text"
              v-model="emailSubject[currentExpert?._id]"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Email"
            />
          </div>
          <div class="grid w-full items-center gap-1.5">
            <div class="flex">
              <label for="message" class="text-gray-700 text-sm">Message</label>
              <button
                @click="createDefaultEmailMessage(currentExpert, true)"
                class="text-xs text-gray-700 ms-auto self-end"
              >
                Restore default
              </button>
            </div>
            <textarea
              id="message"
              v-model="emailBody[currentExpert?._id]"
              class="w-full border border-gray-300 rounded p-2"
              placeholder="Type the body of the email here."
              rows="18"
            ></textarea>
          </div>
        </div>
        <div class="flex gap-4 mt-4 mb-4 flex align-center justify-end ">
            <button
                  class="bg-white border border-gray-500 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded text-lg"
                  @click="setIsOpen(false)"
                >
                  Cancel
                </button>
            <button
              class="bg-priorb-500 hover:bg-priorb-500/80 text-white px-6 py-1.5 rounded text-lg"
              @click="sendInviteProxy()"
              >Send survey</button
            >
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col">
          <div class="font-semibold text-red-700 flex">
            <Icon
              icon="bi:exclamation-triangle"
              class="text-2xl text-red-700 mb-2 me-1"
            />
            You need to enter a valid email address to send a Survey Invite.
          </div>
          <div class="text-gray-700 leading-snug">
            To share the Survey using another method, click 'Copy URL' in the
            table, or use the URL below:

            <div class="bg-gray-100 border border-gray-200 rounded p-2 mt-4">
              <div class="text-gray-700 text-sm">
                {{ currentExpert?.surveyUrl }}
              </div>
            </div>
          </div>
          <div class="w-full mt-3">
            <div class="w-full flex px-4 mt-4">
              <button @click="setIsOpen(false)" class="ms-auto bg-white border border-gray-500 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </DialogPanel>
    </div>
</div>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import { useEmailStore } from '@/store/emailStore';
import { useAdminStore } from '@/store/adminStore';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { defineModel, ref, watch } from 'vue';
import { set } from 'vue-gtag';
const props = defineProps({
  currentExpert: Object,
});
const emailDialogOpen = defineModel()
const emailStore = useEmailStore();
const adminStore = useAdminStore()
const { createDefaultEmailMessage, sendInvitationEmail } = emailStore;
const { emailSubject, emailBody } = storeToRefs(emailStore);
const { name, username, tenant } = storeToRefs(adminStore)
const setIsOpen = (value) => {
  emailDialogOpen.value = value;
};

watch(() => props.currentExpert, (newVal) => {
    if (newVal) {
    createDefaultEmailMessage(newVal);
  }
});



const sendInviteProxy = async () => {
  const emailSent = await sendInvitationEmail(props.currentExpert);
    if (emailSent) {
        setIsOpen(false);
    }
};






</script>

<style lang="scss" scoped></style>
