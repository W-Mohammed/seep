<template>
  <div class="min-w-[100vw] h-full">
    <div class="flex">
      
      
      
      
      <!-- side column 1 with agenda items -->
      <AddAgendaItemSidebar 
      v-model:agenda="agenda"
      v-model:selectedQuestion="selectedQuestion"
      :introPage="introPage"
      :submitPage="submitPage"
      :draftSurveyData="draftSurveyData"
      />
      <!-- MAIN PANEL: edit agendaItems -->

      <div
        class="pt-10 px-6 flex flex-col justify-start w-full overflow-x-auto  main-panel-height"
      >
        <div class="flex items-end container max-w-[1080px]">
          <div class="">
            <div
              v-if="selectedQuestion == introPage.pageId"
              class="bg-gray-100 w-fit px-1.5 py-1 rounded text-sm text-gray-900 mb-3"
            >
              Intro
            </div>
            <div
              v-else-if="selectedQuestion == submitPage.pageId"
              class="bg-gray-100 w-fit px-1.5 py-1 rounded text-sm text-gray-900 mb-3"
            >
              Outro
            </div>
            <div
              v-else-if="!checkIfItemIsSection()"
              class="bg-priorb-50 w-fit px-1.5 py-1 rounded text-sm text-priorb-PRIMARY mb-3"
            >
              Question {{ selectedAgendaItem?.order }}
            </div>
            <div
              v-else
              class="bg-priorb-50 w-fit px-1.5 py-1 rounded text-sm text-priorb-PRIMARY mb-3"
            >
              Section
            </div>
          </div>

          <div v-if="currentQuestionType" class="w-60 ms-auto my-2">
            <AddAgendaItemSelect v-model="agenda" :selectedQ="selectedQuestion" :surveyType="draftSurveyData.type" />
          </div>
        </div>
        <div class="w-full container max-w-[1080px]">
        <AddIntroPage v-if="selectedQuestion === introPage.pageId" v-model="introPage.content" />
        <AddOutroPage
          v-else-if="selectedQuestion == submitPage.pageId"
          v-model:SubmitPage="submitPage"
          v-model:lockedScreen="lockedScreen"
        />
        <AddSectionItem
          v-else-if="checkIfItemIsSection()"
          v-model="selectedAgendaItem"
          :textLength="150"
        />

        <div v-else :key="selectedQuestion">
          <AddRadioItem
            v-if="currentQuestionType === 'radio'"
            v-model="selectedAgendaItem"
          />
          <AddRadioLikertItem
            v-else-if="currentQuestionType === 'radiolikert'"
            v-model="selectedAgendaItem"
          />
          <AddRadioRichItem
            v-else-if="currentQuestionType === 'radiorich'"
            v-model="selectedAgendaItem"
          />
          <AddRouletteItem
            v-else-if="currentQuestionType === 'roulette'"
            v-model="selectedAgendaItem"
          />
          <AddNumberItem
            v-else-if="currentQuestionType === 'number'"
            v-model="selectedAgendaItem"
          />
          <AddCheckboxItem
            v-else-if="currentQuestionType === 'checkbox'"
            v-model="selectedAgendaItem"
          />
          <AddTextItem
            v-else-if="currentQuestionType === 'text'"
            v-model="selectedAgendaItem"
            :textLength="150"
          />
          <AddTextareaItem
            v-else-if="currentQuestionType === 'textarea'"
            v-model="selectedAgendaItem"
            :textLength="500"
          />
          <AddMinMaxBestPage
            v-else-if="currentQuestionType === 'minMaxBest'"
            v-model="selectedAgendaItem"
          />
          <AddProbabilityQuestionPage
            v-else-if="currentQuestionType === 'workshopprobability'"
            v-model="selectedAgendaItem"
          />
          <AddMatrixQuestionItemPage
            v-else-if="currentQuestionType === 'matrix'"
            v-model="selectedAgendaItem"
          />
          <AddBackgroundPage
            v-else-if="currentQuestionType === 'backgroundPage'"
            v-model="selectedAgendaItem"
          />
          <div v-else-if="currentQuestionType === 'validation'">
            <div class="text-center text-2xl text-red-300 mt-20">
              This question type is not supported in the editor. <br>Contact support for help.
            </div>
          </div>
          <div v-else>
            <div class="text-center text-2xl text-red-500">No question selected</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, watch, onBeforeMount } from 'vue'
import AddAgendaItemSelect from '@/components/admin/AddAgendaItemSelect.vue'
import AddAgendaItemSidebar from '@/components/admin/AddAgendaItemSidebar.vue'

import AddIntroPage from '@/components/admin/AddIntroPage.vue'
import AddOutroPage from '@/components/admin/AddOutroPage.vue'
import AddRadioItem from '@/components/admin/AddRadioItem.vue'
import AddRadioLikertItem from '@/components/admin/AddRadioLikertItem.vue'
import AddRadioRichItem from '@/components/admin/AddRadioRichItem.vue'
import AddCheckboxItem from '@/components/admin/AddCheckboxItem.vue'
import AddRouletteItem from '@/components/admin/AddRouletteItem.vue'
import AddTextItem from '@/components/admin/AddTextItem.vue'
import AddTextareaItem from '@/components/admin/AddTextareaItem.vue'
import AddNumberItem from '@/components/admin/AddNumberItem.vue'
import AddBackgroundPage from '@/components/admin/AddBackgroundPage.vue'
import AddMinMaxBestPage from '@/components/admin/AddMinMaxBestPage.vue'
import AddProbabilityQuestionPage from '@/components/admin/AddProbabilityQuestionPage.vue'
import AddMatrixQuestionItemPage from '@/components/admin/AddMatrixQuestionItemPage.vue'
import AddSectionItem from '@/components/admin/AddSectionItem.vue'

import { Icon } from '@iconify/vue'
import { useAdminStore } from '@/store/adminStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { initDraftSurvey } from '@/lib/addAgendaItemUtils'

const adminStore = useAdminStore()
adminStore.draftingSurvey = true
// show spinner quickly, save a bit slower 
const autoSaveCheckRef = ref(null)
const autoSaveRef = ref(null)

onBeforeUnmount(async () => {
  if (autoSaveRef.value) clearInterval(autoSaveRef.value)
  if (autoSaveCheckRef.value) clearInterval(autoSaveCheckRef.value)
  await adminStore.saveDraftSurvey()
  adminStore.draftingSurvey = false
  draftSurveyData.value = {}
})
const { draftSurveyData } = storeToRefs(adminStore)

const selectedQuestion = ref('')
const agenda = ref([])
const introPage = ref({})
const submitPage = ref({})
const lockedScreen = ref({})

const selectedAgendaItem = computed({
  get() {
    return getItemByPageId(selectedQuestion.value)
  },
  set(newValue) {
    const { mainIndex, subIndex } = searchItemIndex(selectedQuestion.value);
    if (mainIndex !== null) {
      if (subIndex !== null) {
        agenda.value[mainIndex].children[subIndex] = newValue;
      } else {
        agenda.value[mainIndex] = newValue;
      }
    }
  },
});


let surveyIdParam
const route = useRoute()
if (draftSurveyData.value.id && !route.params.surveyId) {
  window.history.pushState({}, '', `/admin/add-survey/${draftSurveyData.value.id}`)
} else {
  // ! this is only used to grab survey from database
  surveyIdParam = route.params.surveyId
}

onBeforeMount(async () => {
  if (surveyIdParam) {
    draftSurveyData.value = await useAdminStore().selectDraftSurvey(surveyIdParam, true);
  }
  
  agenda.value = draftSurveyData.value.agenda ?? []

  introPage.value = draftSurveyData.value.introPage
  submitPage.value = draftSurveyData.value.submitPage
  lockedScreen.value = draftSurveyData.value.lockedScreen

  selectedQuestion.value = introPage.value.pageId ?? agenda.value[0].pageId
  if (!surveyIdParam) adminStore.saveDraftSurvey()
})

const autoSaveFunc = () => {
  adminStore.saveDraftSurvey()
}
const autoSaveCheckFunc = () => {
  adminStore.checkDraftSync()
}
autoSaveRef.value = setInterval(autoSaveFunc, 5000)
autoSaveCheckRef.value = setInterval(autoSaveCheckFunc, 1000)


const getItemByPageId = (pageId) => {
  if(!pageId) return null
  if (!agenda.value) return null
  for(let i = 0; i < agenda.value.length; i++) {
    if (agenda.value[i].pageId === pageId) return agenda.value[i]
    if (agenda.value[i].section) {
      for(let j = 0; j < agenda.value[i].children.length; j++) {
        if (agenda.value[i].children[j].pageId === pageId) return agenda.value[i].children[j]
      }
    }
  }
}
  

// DUPLICATE ! COPY IN AddAgendaItemSidebar.vue
const searchItemIndex = (pageId) => {
  for (let i = 0; i < agenda.value.length; i++) {
    if (agenda.value[i].pageId === pageId) {
        return { mainIndex: i, subIndex: null }
    }
    if (agenda.value[i].section) {
      for (let j = 0; j < agenda.value[i].children.length; j++) {
        if (agenda.value[i].children[j].pageId === pageId) {
          return { mainIndex: i, subIndex: j }
        }
      }
    } 
  }
  return { mainIndex: null, subIndex: null }
}




const currentQuestion = computed(() => {
  return agenda.value.filter((item) => item.pageId === selectedQuestion.value)[0]
})

const currentQuestionType = computed(() => {
  const item = getItemByPageId(selectedQuestion.value)
  if(!item) return null
  if (item.content?.questionType) return item.content.questionType
  if (item.viewId === 'QuestionRoulette') return 'roulette'
  if (item.page) return item.page
  if (item.type) return item.type
  if (item.pageType) return item.pageType
  return null
})

const checkIfItemIsSection = () => {
  const item = getItemByPageId(selectedQuestion.value)
  return item?.section;
};
</script>

<style scoped>
.main-panel-height {
  max-height: calc(100vh - 48px - 42px);
}


</style>
