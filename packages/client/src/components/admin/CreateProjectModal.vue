<template>
  <Teleport to="#modals">
    <div v-if="show" class="">
      <div class="fixed inset-0"></div>
      <div
        class="fixed inset-0 backdrop-filter backdrop-blur-sm flex items-center justify-center bg-black bg-opacity-20"
        @click="show = false"
      >
        <div
          class="border border-gray-200 text-black min-w-[300px] w-full max-w-[700px] rounded-lg mx-4"
          @click.stop
        >
          <div
            class="bg-priorb-50 border-b border-priorb-200 px-4 py-2.5 rounded-t-lg flex gap-2 items-center"
          >
            <Icon icon="bi:clipboard" class="text-lg text-black" />
            <span class="font-semibold text-black capitalize"> Add {{ type }} </span>
          </div>
          <div
            class="flex justify-evenly px-6 py-8 sm:flex-wrap md:flex-nowrap gap-6 bg-white rounded-b-lg overflow-x-auto"
          >
            <div class="w-1/2 min-w-[200px]">
              <div class="font-semibold mb-2 capitalize">{{type}} setup</div>

              <div class="flex flex-col">
                <div>
                  <label for="projectName" class="text-sm capitalize">{{type}} name</label>
                  <input
                    type="text"
                    id="projectName"
                    class="border border-gray-200 rounded-md px-2 py-1 w-full mt-1"
                    v-model="projectName"
                  />
                  <div class="text-xs text-gray-500 mt-1" v-if="type==='Survey'">Only visible to you</div>
                </div>
              </div>

              <div class="mt-4">
                <label for="surveyId" class="text-sm capitalize">{{type}} ID</label>
                <div class="text-priorb-500 font-semibold">{{ surveyId }}</div>
              </div>
            </div>

            <div class="w-1/2 min-w-[200px]">
              <div class="mb-4">
                <div class="font-semibold">Contact Info</div>
                <div class="text-xs text-gray-500 leading-tight">
                  Contact info will be shown to the participants.
                </div>
              </div>

              <div class="flex flex-col gap-4">
                <div class="">
                  <label for="contactName" class="text-sm capitalize">Contact person's name</label>
                  <input
                    type="text"
                    id="contactName"
                    class="border border-gray-200 rounded-md px-2 py-1 mt-1 w-full"
                    v-model="contactName"
                  />
                </div>
                <div class="">
                  <label for="organisation" class="text-sm">Organisation</label>
                  <input
                    type="text"
                    id="organisation"
                    class="border border-gray-200 rounded-md px-2 py-1 w-full mt-1"
                    v-model="organisation"
                  />
                </div>
                <div class="">
                  <label for="email" class="text-sm">Email</label>
                  <input
                    type="email"
                    id="email"
                    class="border border-gray-200 rounded-md px-2 py-1 w-full mt-1"
                    v-model="email"
                  />
                </div>
              </div>
              <div>
                <div class="flex justify-end gap-4 mt-6">
                  <button
                    class="hover:bg-priorb-50/80 py-1 px-3 rounded-md text-priorb-PRIMARY border border-priorb-PRIMARY"
                    @click="show = false"
                  >
                    Cancel
                  </button>
                  <button
                    class="bg-priorb-primary hover:bg-priorb-primary/80 py-1 px-3 rounded-md text-white border border-priorb-PRIMARY"
                    @click="createProject()"
                  >
                    Create
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdminStore } from '../../store/adminStore'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const show = defineModel()
const props = defineProps({
  type: {
    type: String,
  default: 'Survey',
    required: true
  }

})
const adminStore = useAdminStore()
const { draftSurveyData } = storeToRefs(adminStore)
const router = useRouter()

const handleEsc = (e) => {
  if (!show.value) return
  if (e.key === 'Escape') show.value = false
}

onMounted(() => {
   window.addEventListener('keydown', handleEsc)  
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})  



const surveyId = ref(Math.random().toString(36).substring(2, 7))
const projectName = ref('')
const contactName = ref(adminStore.name ?? '')
const organisation = ref(adminStore.tenant ?? '')
const email = ref(adminStore.username ?? '')

const createProject = async () => {
  if (!projectName.value && !projectName.value.trim()) return alert('Please enter a name')
  if (!contactName.value) return alert('Please enter a contact name')

  const draftSurveyData = {
    id: surveyId.value,
    name: projectName.value,
    type: props.type,
    studyContact: {
      name: contactName.value,
      email: email.value,
      organisation: organisation.value
    }
  }
  show.value = false
  try {
    await adminStore.createDraftSurvey(draftSurveyData)
    router.push({ name: 'AddSurveyPage', params: {} })
  } catch (e) {
    console.log(e)
    toast.error('Failed to create survey')
  }
}
</script>

<style scoped>
label {
  font-weight: 500;
}
</style>
