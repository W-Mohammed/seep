<template>
  <Teleport to="#modals">
    <div v-if="show" class="">
      <div class="fixed inset-0"></div>
      <div
        class="fixed inset-0 backdrop-filter backdrop-blur-sm flex items-center justify-center bg-black bg-opacity-20"
        @click="show = false"
      >
        <div
          class="border border-gray-200 text-black min-w-[300px] w-3/4 max-w-[500px] rounded-lg"
          @click.stop
        >
          <div
            class="bg-priorb-50 border-b border-priorb-200 px-4 py-2.5 rounded-t-lg flex gap-2 items-center"
          >
            <Icon icon="bi:clipboard" class="text-lg text-black" />
            <span class="font-semibold text-black"> Contact Info </span>
          </div>
          <div
            class="flex justify-evenly px-6 py-8 sm:flex-wrap md:flex-nowrap gap-6 bg-white rounded-b-lg"
          >
            <div class="w-full px-10">
              <div class="flex flex-col gap-4">
                <div class="">
                  <label for="contactName" class="text-sm">Contact person's name</label>
                  <input
                    type="text"
                    id="contactName"
                    class="border border-gray-200 rounded-md px-2 py-1 mt-1 w-full"
                    v-model="nameProxy"
                  />
                </div>
                <div class="">
                  <label for="organisation" class="text-sm">Organisation</label>
                  <input
                    type="text"
                    id="organisation"
                    class="border border-gray-200 rounded-md px-2 py-1 w-full mt-1"
                    v-model="organisationProxy"
                  />
                </div>
                <div class="">
                  <label for="email" class="text-sm">Email</label>
                  <input
                    type="email"
                    id="email"
                    class="border border-gray-200 rounded-md px-2 py-1 w-full mt-1"
                    v-model="emailProxy"
                  />
                </div>
              </div>
              <div>
                <div class="flex justify-end gap-4 mt-6">
                  <button
                    class="hover:bg-priorb-50/80 py-1 px-3 rounded-md text-priorb-PRIMARY border border-priorb-PRIMARY"
                    @click="cancel()"
                  >
                    Cancel
                  </button>
                  <button
                    class="bg-priorb-primary hover:bg-priorb-primary/80 py-1 px-3 rounded-md text-white border border-priorb-PRIMARY"
                    @click="confirm()"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
const contactName = defineModel('contactName')
const email = defineModel('email')
const organisation = defineModel('organisation')
const show = defineModel('showModal')
const nameProxy = ref(contactName.value)
const emailProxy = ref(email.value)
const organisationProxy = ref(organisation.value)

const confirm = () => {
  contactName.value = nameProxy.value
  email.value = emailProxy.value
  organisation.value = organisationProxy.value
  show.value = false
}

const cancel = () => {
  nameProxy.value = contactName.value
  emailProxy.value = email.value
  organisationProxy.value = organisation.value
  show.value = false
}
</script>

<style scoped></style>
