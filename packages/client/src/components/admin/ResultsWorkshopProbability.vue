<template>
  <div v-if="responseByExpert?.length">
    <div class="w-full flex flex-col">
      <div
        class="flex pt-5 px-4 NOT-bg-vGray-100 w-full text-priorb-SECONDARY me-auto rounded-b-lg rounded-r-lg"
      >
        <!-- <ButtonDownloadResults
          :statsTableData="statsTableDataForDownload"
          :chart="chartRef"
          :questionId="selectedQuestion"
          :tenantId="tenantId"
          :surveyId="currentSurveyId"
          :showPsa="false"
        /> -->
      </div>
    </div>


    <div class="inline-flex items-center text-sm bg-priorb-100 px-2 py-4 rounded-lg leading-tight mb-5">
    
    <Icon icon="bi:info-circle" class="text-xl me-2" /> Workshop responses are not aggregated, but shown individually.
    </div>

    <!-- main panel -->
    <div>
      <div v-for="(expert, i) in responseByExpert" :key="i" class="mb-10 pb-10 border-b-2">
        <h3 class="font-semibold mb-2 inline-flex">
        {{ expert.name }}
        <button @click="downloadExpert(expert)" class="text-black text-sm ms-2">
          <Icon icon="bi:download" class="text-lg" />
        </button>
        
        </h3>

        <div class="flex 
        flex-wrap md:flex-nowrap
        items-top justify-evenly text-sm">


        <div class="me-8">
        <table class="table-auto w-full max-w-[600px]">
          
          <tbody>
          <tr>
            <td class="font-semibold pt-8 pb-1 border-b"
            :colspan="expert.value.values.length + 1"
            >Elicited Values <span v-if="expert.value.units" class="text-sm text-gray-400"> ({{ expert.value.units }})</span> and Probabilities
            </td>
          </tr>
            <tr>
              <td class="ps-2">Values:</td>
              <td v-for="(val, j) in expert.value.values" :key="j" class="w-20 text-right">
                {{ val }}
              </td>
            </tr>
          
            <tr>
              <td class="ps-2">Probabilities:</td>
              <td v-for="(prob, k) in expert.value.probabilities" :key="k" class="text-right">
                {{ prob }}
              </td>
            </tr>
            <tr>
            <td class="pb-1 font-semibold pt-8 border-b"
            :colspan="expert.value.values.length + 1"
            >Model</td>
            </tr>
            <tr>
            <td class="ps-2">Selected Fit:</td>
            <td :colspan="expert.value.values.length" class="text-left align-bottom">
              {{ expert.value.fitSelected }}
            </td>
            </tr>
            <tr v-for="(value, key) in expert.value.modelParams" :key="key">
              <td class="ps-2">{{ key }}:</td>
              <td :colspan="expert.value.values.length" class="text-left align-bottom">
                {{ value }}
              </td>
            </tr>
            <tr>
              <td class="pb-1 font-semibold pt-8 border-b"
              :colspan="expert.value.values.length + 1"
              >Rationale</td>
            </tr>
            <tr>
              <td :colspan="expert.value.values.length" class="text-left align-bottom ps-4">
                {{ expert.value.rationale || 'No rationale provided' }}
              </td>
            </tr>
            <tr>
              <td class="pb-1 font-semibold pt-8 border-b"
              :colspan="expert.value.values.length + 1"
              >Comment</td>
            </tr>
            <tr>
              <td :colspan="expert.value.values.length" class="text-left align-bottom ps-4">
                {{ expert.value.comment || 'No comment provided' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <div class="h-[400px] mb-4 w-full">
<div class="flex items-center justify-end text-sm">
      <SimpleSwitch v-model="showDensity[i]" label="CDF/PDF" />
    </div>
    <v-chart
      class="chart"
      ref="chart"
      :option="createChartOpts(expert.value.values, expert.value.probabilities, expert.value.ySelected, expert.value.xSelected, showDensity[i], expert.value.units)"
      style="height: 100%; width: 100%"
      autoresize
    ></v-chart>
  </div>











      </div>




      
    


        </div>
    </div>

  

    
    <!-- stats table -->
    <!-- <ResultsTable
      :statsTableData="statsTableData"
      :validResponses="responseByExpert?.length || '0'"
    /> -->
  </div>
  <ResultsNoResults v-else />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAdminStore } from '@/store/adminStore';
import { storeToRefs } from 'pinia';
import ResultsTable from '@/components/admin/ResultsTable.vue';
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue';
import SimpleSwitch from '@/components/admin/SimpleSwitch.vue';
import VChart from 'vue-echarts';
import ResultsNoResults from './ResultsNoResults.vue';
import { viridis } from '@/lib/colors';
import { WorkshopProbabilityAgendaItem } from '@/models/AgendaClass'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue';
import { createChartOpts, downloadWorkshopProbabilityResults } from '@/lib/probabilityUtils';
import {Icon} from '@iconify/vue';

const selectedQuestion = defineModel({ type: String, default: null });
const adminStore = useAdminStore();
const {
  currentActiveExperts,
  currentSurveyId,
  tenantId,
  currentSurveyQuestions,
  loading,
} = storeToRefs(adminStore);

const chartRef = ref(null);

const responseByExpert = computed(() =>
   WorkshopProbabilityAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value)
);

const showDensity = ref([]);

const responseStats = computed(() => {
  return responseByExpert.value;
});

const statsTableDataForDownload = computed(() => {
  return []
});

const statsTableData = computed(() => {
  if (!responseStats.value) return [];
  return []
});



const downloadExpert = (expert) => {
  const questionText = currentSurveyQuestions.value.find(
    (q) => q._id === selectedQuestion.value
  ).content.questionTitle;
  downloadWorkshopProbabilityResults(expert.value, questionText,expert.name);
};
</script>

<style scoped></style>
