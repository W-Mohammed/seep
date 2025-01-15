<template>
  <div class="container pt-10 max-w-[120ch] flex-1">
    <div class="border-b border-black mb-4 py-4 flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <div class="text-2xl font-semibold">
          Surveys
        </div>
        <div class="flex flex-row gap-3 pt-6">
          <BadgeBase
            class="bagde-clickable"
            :class="filterColor('all')"
            @click="selectFilter('all')"
          >
            All ({{ countProjectsWithStatus('all') }})
          </BadgeBase>
          <BadgeBase
            class="bagde-clickable"
            :class="filterColor(SURVEY_STATUS.DRAFT)"
            @click="selectFilter(SURVEY_STATUS.DRAFT)"
          >
            Draft ({{ countProjectsWithStatus(SURVEY_STATUS.DRAFT) }})
          </BadgeBase>
          <BadgeBase
            class="bagde-clickable"
            :class="filterColor(SURVEY_STATUS.PUBLISHED)"
            @click="selectFilter(SURVEY_STATUS.PUBLISHED)"
          >
          Published ({{ countProjectsWithStatus(SURVEY_STATUS.PUBLISHED) }})
          </BadgeBase>
          <BadgeBase
            class="bagde-clickable"
            :class="filterColor(SURVEY_STATUS.ARCHIVED)"
            @click="selectFilter(SURVEY_STATUS.ARCHIVED)"
          >
            Archived ({{ countProjectsWithStatus(SURVEY_STATUS.ARCHIVED) }})
          </BadgeBase>
        </div>
      </div>
      <div class="flex gap-2 mt-auto ms-auto text-white">
      <button
        style="font-size: 14px;"
        class="py-2  px-3 rounded bg-white border-2 border-priorb-primary focus:outline-priorb-primary/80 text-priorb-primary  hover:bg-priorb-50 hover:text-priorb-primary font-medium"
        @click="addProject('workshop')"
      >
        Add workshop +
      </button>
      <button
        style="font-size: 14px;"
        class="py-2 px-3 rounded bg-priorb-primary hover:bg-priorb-primary/80  focus:outline-priorb-primary/80   text-base hover:text-white"
        @click="addProject()"
      >
        Add Survey +
      </button>
    </div>
    </div>

    <div class="overflow-x-auto w-full pb-24">
<table class="table-auto w-full">
  <thead>
    <tr class="text-sm text-gray-700 bg-gray-100 whitespace-nowrap h-14 uppercase">
      <th class="w-10"></th>
      <th class=" text-start">Name</th>
      <th class="min-w-14">Experts</th>
      <th class="">Type</th>
      <th class="">Created</th>
      <th class="">Status</th>
      <th class=""></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="survey in surveysFiltered" :key="survey.id" 
    @click="selectSurvey(survey.id, survey.status)"
    class="hover:bg-priorb-50/80 hover:border-priorb-300 cursor-pointer"
    >
    <td @click.stop class="hover:text-black text-gray-500">
      <DropdownMenu v-if="survey.status === SURVEY_STATUS.DRAFT">
        <DropdownMenuTrigger as-child class="h-12 w-12">
            <Icon icon="bi:three-dots-vertical" class=" text-2xl p-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent >
            <DropdownMenuItem
            @click="previewDraftSurvey(survey.id)">
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem 
            @click="publishSurvey(survey.id)">
              Publish
            </DropdownMenuItem>          
            <DropdownMenuItem 
            @click="duplicateDraftSurvey(survey.id)">
              Duplicate
            </DropdownMenuItem>          
            <DropdownMenuItem
            @click="generateCompliance(survey.id, survey.name)">
              Export Questions as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
             @click="deleteDraftSurvey(survey.id)">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu v-if="survey.status != SURVEY_STATUS.DRAFT">
        <DropdownMenuTrigger as-child class="h-12 w-12">
            <Icon icon="bi:three-dots-vertical" class=" text-2xl p-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
            :disabled="false"
            @click="duplicateSurvey(survey.id)">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
            v-if="survey.status === SURVEY_STATUS.PUBLISHED || survey.status === 'Published'"
            @click="generateCompliance(survey.id, survey.name)">
            Export Questions as PDF
            </DropdownMenuItem>
            <DropdownMenuItem 
            v-if="survey.status === SURVEY_STATUS.PUBLISHED || survey.status === 'Published'"
            @click="archiveSurvey(survey.id)">
              Archive
            </DropdownMenuItem>            
            <DropdownMenuItem 
            v-if="survey.status ===  SURVEY_STATUS.ARCHIVED|| survey.status === 'Archived'"
            @click="republishSurvey(survey.id)">
              Publish
            </DropdownMenuItem>            
            <DropdownMenuItem
            v-if="survey.status ===  SURVEY_STATUS.ARCHIVED|| survey.status === 'Archived'"
             @click="deleteSurvey(survey.id)">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

    </td>
      <td class="font-medium leading-tight">
      <div class="overflow-hidden overflow-ellipsis" :title="survey.name">
        {{ survey?.name?.length > 0 ? survey.name : 'Untitled' }}
      </div>
      <div class="text-xs text-gray-500">
        ID: {{ survey.id }}
      </div>

      </td>
      
      <td  class="text-center min-w-14">
        {{ survey?.experts?.length }}
      </td>
      <td class="capitalize">
        {{ survey?.type }}
      </td>
      <td >
        {{timeSinceUpdate(survey.updatedAt)}}
      </td>
      <td >
        <BadgeBase variant="clear-round-sm" :class="statusBadgeMapper(survey.status)">
          {{ capitalizedStatus(survey.status) }}
        </BadgeBase>
      </td>
      <td>
        <Icon icon="radix-icons:chevron-right" class="text-gray-400 text-4xl" />
      </td>
    </tr>
  </tbody>
</table>

    </div>
    
    <CreateProjectModal v-model="showModal" :type="projectType"/>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { getSurveys, getDraftSurvey, generateCompliancePDF } from '@/api/surveys'
import { storeToRefs } from 'pinia'
import BadgeBase from '@/components/admin/BadgeBase.vue'
import ButtonBase from '@/components/survey/ButtonBase.vue'
import { Icon } from '@iconify/vue'
import {useRouter} from 'vue-router'
import { statusBadgeMapper, timeSinceUpdate, SURVEY_STATUS } from '@/lib/utils'
import { toast } from 'vue-sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/admin/ui/dropdown-menu'
import CreateProjectModal from '@/components/admin/CreateProjectModal.vue'

const showModal = ref(false)

const adminStore = useAdminStore()
const { surveys, draftSurveys, isLoggedIn, tenantId } = storeToRefs(adminStore)
const projectFilter = ref('all')
const allSurveys = ref([...surveys.value, ...draftSurveys.value])
const surveysFiltered = computed(() => {
  if (projectFilter.value === 'all') return allSurveys.value
  return allSurveys.value.filter((survey) => survey.status === projectFilter.value)
})

const selectFilter = (filter) => {
  projectFilter.value = filter
}
const filterColor = (filter) => {
  return projectFilter.value === filter ? 'bg-priorb-500 text-white' : 'bg-priorb-50 border text-priorb-500'
}

const selectSurvey = (surveyId, status) => {
  if(status === SURVEY_STATUS.DRAFT) editSurvey(surveyId)
  else adminStore.selectSurvey(surveyId)
}

const countProjectsWithStatus = (status) => {
  if(!allSurveys.value) return 0
  if (status === 'all') return allSurveys.value.length
  else return allSurveys.value.filter((survey) => survey?.status.toLowerCase() === status.toLowerCase()).length
}

const projectType = ref('Survey')
const addProject = (type) => {
  projectType.value = type ? type : 'survey'
  showModal.value = true
}

const deleteDraftSurvey = async (surveyId) => {
  if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      const draftDeleted = await adminStore.deleteDraftSurvey(surveyId)
      if (draftDeleted) {
        allSurveys.value = allSurveys.value.filter((survey) => survey.id !== surveyId)
      }
  }
}

const deleteSurvey = async (surveyId) => {
  if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
    const surveyDeleted = await adminStore.deleteSurvey(surveyId)
    if (surveyDeleted) {
      allSurveys.value = allSurveys.value.filter((survey) => survey.id !== surveyId)
      toast.success('Survey deleted')
    } else {
      toast.error('Failed to delete survey')
    }
  }
}

const viewSurvey = (surveyId) => {
  adminStore.viewTestSurvey(surveyId)
}


const editSurvey = (surveyId, status) => {
  adminStore.selectDraftSurvey(surveyId)
}

const handleSurveyCopy = async (survey) => {
  if (survey) {
    // delete fields that are specific to the original survey
    delete survey._id
    delete survey.id
    delete survey.compositeKey
    delete survey.createdAt
    delete survey.updatedAt
    delete survey.experts
    delete survey.status
    delete survey.__v
  } else {
    console.error('Error, no survey found')
  }
  
  if (survey?.agenda) {
    // deep copy 
    const lockScreen = JSON.parse(JSON.stringify(survey.lockedScreen))
    delete lockScreen._id
    
    const newAgenda = JSON.parse(JSON.stringify(survey.agenda))
    const filteredAgenda = [];
    for (let item of newAgenda) {
      delete item._id 
      filteredAgenda.push(item)
    }

    let name = survey.name + ' Copy'
    let i = 2
    while (allSurveys.value.find((s) => s.name === name)) {
      if(i >100) break // prevent infinite loop
      name = survey.name + ' Copy ' + i
      i++
    }
    try {
      const newSurveyData = {
        name: name,
        description: survey.description,
        studyContact: survey.studyContact,
        lockedScreen: lockScreen,
        agenda: filteredAgenda,
      }
      await adminStore.createDraftSurvey(newSurveyData)
    // update survey list 
    const response = await getSurveys(tenantId.value)
    surveys.value = response.surveys || []
    draftSurveys.value = response.drafts || []
    allSurveys.value = [...surveys.value, ...draftSurveys.value]
    setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
        toast.success('Survey duplicated')
    }, 250)
  } catch (error) {
    console.error('Error duplicating survey', error)
  }
} else {
  alert('Error duplicating survey')
}
}

const duplicateDraftSurvey = async (surveyId) => {
  const { success, survey } = await getDraftSurvey(tenantId.value, surveyId)
  if (success && survey) {
    handleSurveyCopy(survey)
  }
}

const duplicateSurvey = async (surveyId) => {
  const { success, survey } = await adminStore.fetchSurvey(surveyId)
  if (success && survey) {
    handleSurveyCopy(survey)
  }
}

const generateCompliance = async (surveyId, surveyName) => {
  toast.info('PDF is being generated. Download will start automatically when ready.');
  try {
    let pdfData = await generateCompliancePDF(tenantId.value, surveyId);
    if (!pdfData || !pdfData.data) {
      throw new Error('No data returned from server', pdfData);
      return;
    }
    const content = pdfData.data.content;
    const byteArray = new Uint8Array(Object.values(content));
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Survey_Documentation_${surveyId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);
    toast.success('Document generated. Downloading now.');
  } catch (error) {
    console.error('Error generating document', error);
    toast.error('Failed to generate document', {
      description: error.message,
      style: { background: '#fda4af' }
    });
  }
}

const archiveSurvey = async (surveyId) => {
  const response = await adminStore.updateSurveyStatus(surveyId, SURVEY_STATUS.ARCHIVED)
  if (response) {
    allSurveys.value = allSurveys.value.map((survey) => {
      if (survey.id === surveyId) {
        survey.status = SURVEY_STATUS.ARCHIVED
      }
      return survey
    })
  }
}

const republishSurvey = async (surveyId) => {
  const response = await adminStore.updateSurveyStatus(surveyId, SURVEY_STATUS.PUBLISHED)
  if (response) {
    allSurveys.value = allSurveys.value.map((survey) => {
      if (survey.id === surveyId) survey.status = SURVEY_STATUS.PUBLISHED
      return survey
    })
  }
}

const publishSurvey = async (surveyId) => {
  if (
        !confirm(
          'Once a survey is published, the content cannot be changed. Do you want to proceed?'
        )
      )
        return;
  republishSurvey(surveyId)
}


const previewDraftSurvey = (surveyId) => {
  adminStore.previewDraftSurvey(surveyId)
}

const capitalizedStatus = (status) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

onBeforeMount(async () => {
  if (!isLoggedIn.value) return useRouter().push({ name: 'Login' })
  const response = await getSurveys(tenantId.value)
  surveys.value = response.surveys || []
  draftSurveys.value = response.drafts || []
  allSurveys.value = [...surveys.value, ...draftSurveys.value]
})
</script>

<style scoped>
/* .project-card {
  @apply bg-white p-4 m-2 rounded-lg flex flex justify-between items-stretch border border-gray-400 w-[350px] cursor-pointer;
}
.project-card:hover {
  @apply border-priorb-300 bg-priorb-50/30;
} */

th {
  padding: 0 10px;
  white-space: nowrap;
  text-align: left;
}

th .icon-hoverable {
  opacity: 0;
}

th:hover .icon-hoverable {
  opacity: 1;
}

td {
  @apply p-4 whitespace-nowrap max-w-[200px]  text-[14px];
}

.td-sortable {
  @apply h-14 inline-flex items-center gap-1 cursor-pointer w-full hover:text-gray-500 cursor-pointer;
}

input[type='text'],
input[type='email'] {
  @apply border border-gray-300 rounded w-full p-2;
}

.bagde-clickable {
  cursor: pointer;
}
.bagde-clickable:hover {
  @apply bg-priorb-500/80 text-white;
}


/* Tooltips for draft edit and delete icons */
.tooltip {
  position: relative;
}
.tooltip .tooltiptext {
  visibility: hidden;
  opacity: 0.75;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 2px 8px;
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  bottom: 75%;
  left: 50%;
  margin-left: -60px;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
