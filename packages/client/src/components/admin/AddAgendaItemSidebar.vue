<template>
    <div class="w-1/4 max-w-sm min-w-[220px] flex flex-col items-start gap-0.5  border-r pt-4 side-bar-height relative pb-18 bg-white">
        <router-link :to="{ name: 'SurveyOverview' }" :params="{}">
          <div
            class="flex items-center gap-1 p-2 w-fit text-sm cursor-pointer hover:text-gray-700/50 px-3 text-gray-700 font-semibold"
          >
            <Icon icon="bi:chevron-left" class="w-5 h-5" />
            Back to Surveys
          </div>
        </router-link>
        <div class="w-full overflow-y-auto h-full flex flex-col">
          <div class="flex items-end justify-between w-full px-6 font-semibold mt-4 mb-4">
            <span class="lg:hidden text-black leading-tight" :title="draftSurveyData?.name">
              {{
                draftSurveyData?.name?.length > 13
                  ? draftSurveyData?.name?.slice(0, 12) + '...'
                  : draftSurveyData?.name
              }}</span
            >
            <span class="hidden lg:inline text-black leading-tight" :title="draftSurveyData?.name">
              {{
                draftSurveyData?.name?.length > 23
                  ? draftSurveyData?.name?.slice(0, 20) + '...'
                  : draftSurveyData?.name
              }}</span
            >

            <div
              class="text-gray-700 cursor-pointer flex items-center text-xxs cursor-pointer hover:text-gray-700/60"
              @click="showModal = true"
            >
              <Icon icon="bi:three-dots-vertical" class="text-base ms-1" />
            </div>
          </div>
          <!-- Intro page item -->
          <div
            class="text-sm text-gray-900 flex flex-col items-start border-b mb-2 pb-2 ps-2 lg:ps-4 pe-2 xl:pe-4"
          >
            <div
              class="flex items-center me-auto w-full py-2 hover:bg-priorb-50"
              role="button"
              :tabindex="1"
              :class="{ 'bg-priorb-50': selectedQuestion === introPage.pageId }"
              @click="selectedQuestion = introPage.pageId"
            >
              <Icon icon="bi:journal-text" class="text-2xl text-black mx-2" />
              1 Welcome Note
            </div>
          </div>

          <!-- agenda items -->
            <div class="question-radio-btns ps-2 lg:ps-4 pe-2 lg:pe-4  overflow-y-visible">
            <AddAgendaItemsDraggable 
            v-model:agenda="agenda" 
            v-model:selectedQuestion="selectedQuestion"
            @reIndexAgenda="reIndexAgenda"
             />
            <!-- Add Page Button -->
          <AddAgendaItemBtn
          v-model:agenda="agenda" 
            v-model:selectedQuestion="selectedQuestion"
            :surveyType="draftSurveyData.type"
          />
            </div>

        
          



          <div class="border-b mb-2 pt-2"></div>

          <!-- outro page -->
          <div
            class="text-sm text-gray-900 flex flex-col items-start ps-2 lg:ps-4 pe-2 xl:pe-4 pb-10 mb-10"
          >
            <div
              class="flex items-center me-auto w-full py-2 hover:bg-priorb-50"
              role="button"
              :tabindex="agenda.length + 1"
              :class="{ 'bg-priorb-50': selectedQuestion === submitPage.pageId }"
              @click="selectedQuestion = submitPage.pageId"
            >
              <Icon icon="solar:list-check-bold" class="text-2xl text-black mx-2" />
              {{ agenda.length + 2 }} Completion Note
            </div>
          </div>

          <!-- Publish and Preview buttons -->
          <div
            class="mt-auto py-2 flex justify-end gap-2 border-t px-2 absolute bottom-0 right-0 left-0 border-priorb-primary flex-wrap md:flex-nowrap 
            flex-col-reverse md:flex-row bg-white"
          >
            <button
              class="flex items-center px-2 py-1 border-2 rounded-md border-priorb-primary font-semibold text-white hover:opacity-80 bg-priorb-primary grow md:grow-0"
              @click="publishSurvey()"
            >
              Publish
              <Icon icon="bi:chevron-right" class="text-lg ms-2" />
            </button>

            <button
              class="flex items-center px-2 py-1 border-2 rounded-md border-priorb-primary font-semibold text-priorb-primary hover:opacity-80 grow md:grow-0"
              @click="previewDraftSurvey()"
            >
              Preview
              <Icon icon="bi:eye" class="text-lg ms-2" />
            </button>
          </div>
        </div>
      </div>

      <EditSurveyModal
      v-model:showModal="showModal"
      v-model:projectName="draftSurveyData.name"
      :surveyId="draftSurveyData.id"
    />
</template>

<script setup>
import { ref, defineModel } from 'vue'
import { Icon } from '@iconify/vue'
import AddAgendaItemsDraggable from '@/components/admin/AddAgendaItemsDraggable.vue';
import EditSurveyModal from '@/components/admin/EditSurveyModal.vue'
import { useAdminStore } from '@/store/adminStore'
import AddAgendaItemBtn from '@/components/admin/AddAgendaItemBtn.vue'

import {useRouter} from 'vue-router'


const props = defineProps({
  draftSurveyData: Object,
  introPage: Object,
  submitPage: Object
})

const adminStore = useAdminStore()
const agenda = defineModel('agenda')
const selectedQuestion = defineModel('selectedQuestion')
const showModal = ref(false)
const router = useRouter()


const reIndexAgenda = () => {
  if (!agenda || !agenda.value || !agenda.value.length) return;

  let _agenda = props.referenceAgenda ? props.referenceAgenda : agenda.value;
  
  let index = 1;
  for (let i = 0; i < agenda.value.length; i++) {
    if (agenda.value[i].section) {
      agenda.value[i].order = undefined;
      if(!agenda.value[i].children || !agenda.value[i].children.length) continue;
      for (let j = 0; j < agenda.value[i].children.length; j++) {
        agenda.value[i].children[j].order = index;
        agenda.value[i].children[j].isChild = true
        index++;
      }
    } else {
      agenda.value[i].order = index;
      agenda.value[i].isChild = false
      agenda.value[i].parent = null
      index++;
    }
  }
};

const previewDraftSurvey = () => {
  adminStore.previewDraftSurvey(null, true)
}
const publishSurvey = async () => {
  await adminStore.publishSurvey(props.draftSurveyData.id)
  router.push({ name: 'SurveyOverview' })

}


</script>

<style scoped>
.side-bar-height {
  height: calc(100vh - 48px - 42px);
}


</style>