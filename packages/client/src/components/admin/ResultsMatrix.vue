<template>
  <OverlaySpinner :loadingState="loading" />
  <div v-if="responseByExpert?.length">
    <div class="w-full flex flex-col">
      <div class="flex pt-5 px-4">
        <ButtonDownloadResults
          :statsTableData="rawDataDownloadCSV"
          :questionId="selectedQuestion"
          :tenantId="tenantId"
          :surveyId="currentSurveyId"
          :showPsa="false"
        />
      </div>
    </div>
    <div class="max-w-[100ch] mx-auto">
      <h1 class="text-xl font-semibold">
        Statements ({{ statsByStatement.length }})
      </h1>
      <div class="px-4 pt-2">
      <div v-for="(statement, index) in statsByStatement" class="mb-8 w-full mt-2 border border-gray-300 rounded">
        <div class="w-full">


<div class="bg-gray-100 py-2 px-4 rounded-t flex flex-col">
          <div class="text-sm leading-tight flex w-fit">    
            {{ index + 1 }}. {{ statement.label }}</div>
</div>


<div class="">
          <div class="flex">
          <div class="grow shrink-0 p-4 pe-0">
            <div class="leading-tight   font-semibold ">
              Responses ({{ statement.total }})
            </div>
            <div class="grid gap-0.5 w-fit ps-2 pt-2">
              <div
                class="grid grid-cols-2 gap-4 font-medium text-black "
                v-for="(response, key) in statement.responses"
                :key="key"
              >
                <div >{{ key }}:</div>
                <div >
                  {{ response }} ({{
                    ((response / statement.total) * 100).toFixed(0)
                  }}%)
                </div>
              </div>
            </div>
          </div>
          <div class="w-full">
        <div class="w-full mb-auto p-4 grow">
          <div class="leading-tight mb-2 font-semibold ">
        Comments ({{ statement.comments.length }})
        </div>
        <div class="flex flex-col gap-2 ps-4 max-h-[400px] overflow-y-auto border rounded-md py-2" v-if="statement.comments.length">
          <div
            v-for="(comment, index) in statement.comments"
            :key="index"
            class="bg-gray-10 p-0.5 rounded leading-snug -indent-4 ps-4 pe-2"
          >
            <span class="text-sm bg-gray-50 w-fit rounded me-2 text-gray-900 font-semibold">{{ comment.expert }}</span>
            <span class="text-sm ">{{ comment.comment }}</span>
          </div>
          </div>
          </div>
        
        </div>
</div>
        </div>
      </div>
      </div>
    </div>
  </div>

  <ResultsComments :current-active-experts="currentActiveExperts" :selected-question="selectedQuestion" />
    
  
    <div v-if="rawDataTable.length">
      <ResultsTable
        :statsTableData="rawDataTable"
        :validResponses="validResponses"
      />
    </div>
  </div>
  <ResultsNoResults v-else />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAdminStore } from '@/store/adminStore';
import { storeToRefs } from 'pinia';
import ResultsComments from '@/components/admin/ResultsComments.vue';
import ResultsTable from '@/components/admin/ResultsTable.vue';
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue';
import VChart from 'vue-echarts';
import ResultsNoResults from './ResultsNoResults.vue';
import { viridis } from '@/lib/colors';
import { countByCategory } from '@/lib/formKitUtils';
import { MatrixAgendaItem } from '@/models/AgendaClass'
import ButtonDownloadResults from '@/components/admin/ButtonDownloadResults.vue';
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
    MatrixAgendaItem.getResponse(currentActiveExperts.value, selectedQuestion.value)
);

const validResponses = computed(() => responseByExpert.value.length);

const statsByStatement = computed(() => {
  const questionContent = currentSurveyQuestions.value.find(
    (q) => q._id === selectedQuestion.value
  )?.content;
  if (!questionContent) return null;

  const respOpts = questionContent.columns;
  const statements = questionContent.rows;

  const statsByStatement = [];
  statements.forEach((s) => {
    const statementStats = {
      label: s,
      responses: {},
      total: 0,
      comments: [],
    };
    respOpts.forEach((opt) => {
      statementStats.responses[opt] = 0;
    });
    statementStats.missing = 0;
    statsByStatement.push(statementStats);
  });
  responseByExpert.value.forEach((expert) => {
    expert.value.forEach((resp, respIndex) => {
      const statementIndex = statements.indexOf(resp.row);
      if (statementIndex === -1) return;
      if (resp.value) {
        statsByStatement[statementIndex].total++;
        statsByStatement[statementIndex].responses[resp.value]++;
      } else {
        statsByStatement[statementIndex].missing++;
      }
      if (resp.comment) {
        statsByStatement[statementIndex].comments.push({
          expert: expert.name,
          comment: resp.comment,
          response: resp.value,
        });
      }
    });
  });
  return statsByStatement;
});

const summaryData = computed(() => {
  const columnNames = currentSurveyQuestions.value.filter(
    (q) => q._id === selectedQuestion.value
  )[0].content.columns;
  const responseCounts = {};

  const columnsObj = {};
  columnNames.forEach((column) => (columnsObj[column] = 0));

  responseByExpert.value.forEach((expert) => {
    expert.value.forEach((answer) => {
      const question = answer.row;

      if (!responseCounts[question]) {
        responseCounts[question] = { ...columnsObj, total: 0, missing: 0 };
      }

      if (responseCounts[question][answer.value] !== undefined) {
        responseCounts[question][answer.value]++;
      } else {
        responseCounts[question].missing++;
      }
      responseCounts[question].total++;
    });
  });

  // Convert the map to a table-like array for easier rendering in the template
  const resultTable = [['Statement', ...columnNames, 'Missing']];

  for (const [question, counts] of Object.entries(responseCounts)) {
    const { total, ...responses } = counts;
    const row = [question];

    // Populate each column with the count and percentage
    columnNames.forEach((col) => {
      const count = responses[col] || 0;
      const percentage = total ? ((count / total) * 100).toFixed(1) : 0;
      row.push(`${count} (${percentage}%)`);
    });

    const notAttemptedCount = responses.missing || 0;
    const notAttemptedPercentage = total
      ? ((notAttemptedCount / total) * 100).toFixed(1)
      : 0;
    row.push(`${notAttemptedCount} (${notAttemptedPercentage}%)`);

    resultTable.push(row);
  }
  return resultTable;
});

// Not used in the current implementation
const commentsTableData = computed(() => {
  const commentRows = [['Expert', 'Question', 'Response', 'Comment']];

  responseByExpert.value.forEach((expert) => {
    expert.value.forEach((answer) => {
      if (answer.comment) {
        commentRows.push([
          expert.name,
          answer.row,
          answer.value,
          answer.comment,
        ]);
      }
    });
  });

  return commentRows.length > 1 ? commentRows : [];
});

const rawDataTable = computed(() => {
  const questions = responseByExpert.value[0].value.map((entry) => entry.row);
  const questionColumns = questions.map((entry, i) => `Q${i + 1}: ${entry}`);

  // -&- is used as a delimiter to separate the question from the value or comment
  const headerRow = [
    'name',
    ...questionColumns.flatMap((column) => [
      `${column} -&- response`,
      `${column} -&- comment`,
    ]),
  ];

  const rows = responseByExpert.value.map((expert) => {
    const row = [expert.name];

    questions.forEach((question) => {
      const answer = expert.value.find((entry) => entry.row === question);

      // Add the value and comment for each question, defaulting to placeholders if missing
      row.push(answer ? answer.value : '-');
      row.push(answer && answer.comment ? answer.comment : '-');
    });

    return row;
  });

  // Combine header with data rows
  return [headerRow, ...rows];
});

const rawDataDownloadCSV = computed(() => {
  // Define question labels and create headers for CSV download
  const questions = responseByExpert.value[0].value.map((entry) => entry.row);
  const questionColumns = questions.map((entry, i) => `Q${i + 1}`);

  // Create a header row with clean labels
  const headerRow = [
    'Expert',
    ...questionColumns.flatMap((column) => [
      `${column} Value`,
      `${column} Comment`,
    ]),
  ];

  // Generate rows with empty fields as '' for CSV
  const rows = responseByExpert.value.map((expert) => {
    const row = [expert.name];

    questions.forEach((question) => {
      const answer = expert.value.find((entry) => entry.row === question);

      // Use '' for empty fields instead of '-'
      row.push(answer ? answer.value : '');
      row.push(answer && answer.comment ? answer.comment : '');
    });

    return row;
  });

  // Combine header with data rows for CSV-ready array
  return [headerRow, ...rows];
});
</script>

<style scoped></style>
