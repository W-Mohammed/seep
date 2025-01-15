<template>
  <Teleport to="#modals">
    <div v-if="show" class="">
      <div class="fixed inset-0"></div>
      <div
        class="fixed inset-0 backdrop-filter backdrop-blur-sm flex items-center justify-center bg-black bg-opacity-20"
        @click="show = false"
      >
        <OverlaySpinner :loadingState="loadingState" />
        <div
          class="border border-gray-200 text-black min-w-[200px] w-3/4 max-w-[500px] rounded"
          @click.stop
        >
          <div
            class="bg-priorb-50 border-b border-priorb-200 px-4 py-2.5 rounded-t flex gap-2 items-center"
          >
            <Icon icon="bi:clipboard" class="text-lg text-black" />
            <span class="font-semibold text-black"> Edit Survey</span>
          </div>
          <div
            class="flex justify-evenly px-6 py-8 sm:flex-wrap md:flex-nowrap gap-6 bg-white rounded-b"
          >
            <div class="w-full">
              <div class="flex flex-col">
                <div>
                  <label for="projectName" class="text-sm">Survey name</label>
                  <input
                    type="text"
                    id="projectName"
                    class="border border-gray-200 rounded px-2 py-1 w-full mt-1"
                    v-model="nameProxy"
                  />
                  <div class="text-xs text-gray-500 mt-1">Only visible to you</div>
                </div>
              </div>

              <div class="mt-4">
                <label for="surveyId" class="text-sm">Survey ID</label>
                <div class="text-priorb-500 font-semibold">{{ surveyId }}</div>
              </div>
              <div class="flex justify-between mt-6">
                <button
                  class="hover:bg-priorb-50/80 text-sm py-0.5 px-1.5 rounded text-red-600 border border-red-600 flex items-center gap-2"
                  @click="deleteDraftSurvey"
                >
                  <Icon icon="bi:trash" class="text-lg" />
                  Delete Survey
                </button>
                <div class="flex gap-4">
                  <button
                    class="hover:bg-priorb-50/80 py-1 px-3 rounded text-priorb-PRIMARY border border-priorb-PRIMARY"
                    @click="cancel"
                  >
                    Cancel
                  </button>
                  <button
                    class="bg-priorb-primary hover:bg-priorb-primary/80 py-1 px-3 rounded text-white border border-priorb-PRIMARY"
                    @click="confirmName"
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
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
import { useAdminStore } from '@/store/adminStore'
import { useRouter, useRoute } from 'vue-router'

const projectName = defineModel('projectName')
const show = defineModel('showModal')
const nameProxy = ref(projectName.value)
const loadingState = ref(false)
const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()

const props = defineProps(
    {
        surveyId: {
            type: String,
        },
    })

const confirmName = () => {
  projectName.value = nameProxy.value
  show.value = false
}

const cancel = () => {
  nameProxy.value = projectName.value
  show.value = false
}

const deleteDraftSurvey = async () => {
  if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
    try {
      loadingState.value = true
      const success = await adminStore.deleteDraftSurvey()
      if (success) {
        router.push({ name: 'SurveyOverview' })
      } 
    } catch (error) {
      console.error(error)
    } finally {
      loadingState.value = false
    }
  }
}

watch(show, (value) => {
  if (value) {
    nameProxy.value = projectName.value
  }
})
</script>

<style scoped>
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

</style>
