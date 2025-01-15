<template>
  <div
    class="container flex flex-col items-center justify-center max-w-[90ch]"
    v-if="currentPageValue"
  >
    <QuestionBlock :content="content" />

    <PicotDetails :picot="content?.picot" />

    <!-- STEP 1 -->
    <div class="me-auto mt-10">
      <div class="mb-4 font-bold">
        1. Set Lowest and Highest Plausible Values
        <span v-if="content.units">(in {{ content.units }})</span> and Number of
        Splits
      </div>
      <div>
        <div
          class="border-l-4 ps-4 py-2"
          :class="showStep1 ? 'border-priorb-100' : 'border-gray-100'"
        >
          <div
            :class="
              showStep1 ? 'opacity-100' : 'opacity-20 pointer-events-none'
            "
            class="transition-opacity duration-500"
          >
            <div class="flex gap-8">
              <div class="flex flex-col items-center">
                <label
                  for="min"
                  class="text-sm font-semibold text-gray-700 w-24"
                  >Minimum:</label
                >
                <input
                  type="number"
                  v-model="minInit"
                  placeholder=""
                  class="border w-28 py-1 text-center rounded"
                />
              </div>
              <div class="flex flex-col items-center">
                <label
                  for="max"
                  class="font-semibold text-gray-700 text-sm w-24"
                  >Maximum:</label
                >
                <input
                  type="number"
                  v-model="maxInit"
                  placeholder=""
                  class="border w-28 py-1 text-center rounded"
                />
              </div>
              <div class="flex flex-col items-center">
                <label
                  for="numValues"
                  class="font-semibold text-gray-700 text-sm w-24"
                  >Splits:</label
                >
                <input
                  type="number"
                  v-model="numValues"
                  class="border w-28 py-1 text-center rounded"
                />
              </div>
            </div>
            <div class="text-sm text-gray-700">
              <div
                v-if="
                  content.minLimit != null &&
                  content.minLimit > -Infinity &&
                  content.maxLimit != null &&
                  content.maxLimit < Infinity
                "
                class="text-start me-auto text-gray700 text-xs mt-4"
              >
                Values must be between
                {{ content.minLimit }} and {{ content.maxLimit }}
              </div>
              <div
                v-else-if="
                  content.minLimit !== null &&
                  content.minLimit !== undefined &&
                  content.minLimit > -Infinity
                "
                class="text-start me-auto text-gray700 text-xs pb-2"
              >
                Values must be greater than
                {{ content.minLimit }}
              </div>
              <div
                v-else-if="
                  content.maxLimit !== null &&
                  content.maxLimit !== undefined &&
                  content.maxLimit < Infinity
                "
                class="text-start me-auto text-gray700 text-xs pb-2"
              >
                Values must be less than
                {{ content.maxLimit }}
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button
              v-if="!showStep2 && !showStep3"
              class="border bg-black text-white py-2 px-4 ms-auto"
              @click="goToStep2()"
            >
              Confirm
            </button>
            <button
              class="border bg-white border-gray-500 text-black py-0.5 px-4 text-sm hover:bg-gray-700 hover:text-white rounded-sm"
              v-if="showStep2 || showStep3"
              @click="goBackToStep1()"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 2 -->
    <div
      class="me-auto mt-16 transition-all duration-500 overflow-y-hidden"
      :class="showStep2 || showStep3 ? 'max-h-[200px]' : 'max-h-0'"
    >
      <div class="mb-4 font-bold">
        2. For Which Values
        <span v-if="content.units">(in {{ content.units }})</span> Do You Want
        to Elicit Probabilities?
      </div>
      <div
        class="border-l-4 ps-4 py-2"
        :class="showStep2 ? 'border-priorb-100' : 'border-gray-100'"
      >
        <div
          class="flex gap-8 transition-opacity duration-500 items-end"
          :class="showStep3 ? 'opacity-20 pointer-events-none' : 'opacity-100'"
        >
          <div
            class="flex flex-col"
            v-for="(value, index) in currentPageValue.values"
          >
            <label
              for="value"
              class="text-sm font-semibold text-gray-700 w-20 text-center"
              >{{
                index == 0
                  ? 'Lowest'
                  : index == currentPageValue.values.length - 1
                    ? 'Highest'
                    : ''
              }}</label
            >
            <input
              type="number"
              v-model="currentPageValue.values[index]"
              class="border w-20 py-1 text-center rounded ps-2"
            />
          </div>
        </div>

        <div class="mt-4">
          <button
            class="border bg-black text-white py-2 px-4"
            v-if="!showStep3"
            @click="goToStep3()"
          >
            Confirm
          </button>
          <button
            class="border bg-white border-gray-500 text-black py-0.5 px-4 text-sm hover:bg-gray-700 hover:text-white rounded-sm"
            v-if="showStep3"
            @click="goBackToStep2()"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- STEP 3 -->

    <div
      class="me-auto mt-16 transition-all duration-500 overflow-y-hidden"
      :class="showStep3 ? 'max-h-[1000px]' : 'max-h-0'"
    >
      <div class="mb-4 font-bold">3. Elicit Probabilities for Each Value</div>
      <div class="flex flex-col gap-4 border-l-4 border-priorb-100 ps-4 py-2">
        <div class="text-sm text-gray-700">
          How likely is the true value to be less than or equal to each of the
          values below?
        </div>
        <div class="text-xs text-gray-700 flex gap-2 items-center">
          <input type="checkbox" v-model="toggleValOrder" id="toggleValOrder" />
          <label class="font-semibold text-gray-700" for="toggleValOrder"
            >Show in order</label
          >
        </div>
        <div
          class="grid grid-cols-3 gap-4 bg-white px-4 py-2 rounded border"
          v-for="(value, index) in orderOfElicitation(
            currentPageValue.values.length,
            toggleValOrder
          )"
        >
          <div class="inline-flex items-center col-span-2">
            For
            <div
              class="inline-flex text-xl text-priorb-400 font-medium border-priorb-400 min-w-10 px-2"
            >
              <span
                class="pe-1"
                v-html="orderSign(value, currentPageValue.values.length)"
              ></span>
              {{ currentPageValue.values[value] }}
            </div>
            <span v-if="content.units">({{ content.units }})</span>,
            <span class="ps-1.5">the probability is:</span>
          </div>

          <div class="flex items-center gap-2 justify-center">
            <input
              type="number"
              v-model="probabilitiesRaw[value]"
              class="border w-20 py-2 text-center rounded text-lg"
            />
            <span>%</span>
          </div>
        </div>
        <div class="flex flex-col items-start gap-2 justify-between w-full">
          <div class="text-gray-700 text-xs flex gap-1 items-center h-4 my-1">
            <Icon
              icon="bi:exclamation-triangle"
              class="text-base mb-0.5"
              v-if="invalidInputs"
            />
            {{ invalidInputs ? invalidInputs : '' }}
          </div>
          <button
            @click="getFitDist"
            class="border bg-black text-white py-2 px-4"
            :class="invalidInputs ? 'cursor-not-allowed opacity-50' : ''"
          >
            {{
              currentPageValue.xSelected?.length
                ? 'Update Curve'
                : 'Generate Curve'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- STEP 4 -->
    <div
      class="mt-16 overflow-y-hidden transition-all duration-500 w-full"
      :class="
        showStep3 && currentPageValue.xSelected?.length
          ? 'max-h-[640px]'
          : 'max-h-0'
      "
    >
      <div class="font-bold text-lg mb-4">4. Validate Density Functions</div>

      <div class="relative w-full border-l-4 border-priorb-100 ps-4 pb-4">
        <!--  loading animation while fetching data from R server -->
        <div
          class="absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center z-20 opacity-50"
          v-if="loading"
        >
          <div class="text-xl text-priorb-500 font-medium inline-flex z-22">
            <svg
              class="animate-spin -ml-1 mr-3 h-7 w-7 text-priorb-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span></span>
            Loading...
          </div>
        </div>

        <!-- invalid input error overlay -->
        <div
          class="absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center z-10 opacity-50 bg-gray-100 rounded"
          v-if="invalidInputs"
        >
          <div class="text-xl text-gray-500 font-bold">INVALID INPUT DATA</div>
        </div>

        <!-- controls: pdf and select model -->
        <div
          class="flex items-center gap-8 text-sm text-gray-700 justify-end items-center"
        >
          <div class="flex items-center gap-1 my-auto">
            <SimpleSwitch v-model="showDensity" label="CDF/PDF" />
          </div>

          <div class="flex items-center gap-1">
            <label for="model" class="text-base text-gray-700">Model:</label>

            <!-- Select Model -->
            <Listbox v-model="fitSelected">
              <div class="relative mt-1">
                <ListboxButton
                  class="relative rounded bg-white py-1.5 justify-start px-2 focus:outline-none border focus-visible:border-priorb-100 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-priorb-300 sm:text-sm w-44"
                >
                  <Icon
                    icon="heroicons-solid:chevron-down"
                    class="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span class="block truncate">
                    {{ fitSelected }}
                    <span
                      v-if="fitSelected === bestFit"
                      class="text-xs text-priorb-400"
                      >(best fit)</span
                    >
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow ring-1 ring-black/5 focus:outline-none sm:text-sm bg-white z-20 px-2"
                  >
                    <ListboxOption
                      v-slot="{ active, selected }"
                      v-for="m in modelsAvailable"
                      :key="m"
                      :value="m"
                      as="template"
                    >
                      <div
                        class="px-1 rounded cursor-pointer"
                        :class="[
                          active
                            ? 'bg-priorb-100 text-priorb-900'
                            : 'text-gray-900',
                          'relative cursor-default select-none py-1',
                          selected ? 'font-semibold bg-priorb-100' : '',
                        ]"
                      >
                        <span
                          >{{ m }}
                          <span
                            v-if="m === bestFit"
                            class="text-xs text-priorb-400"
                            >(best fit)</span
                          >
                        </span>
                      </div>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
        </div>

        <div class="h-[400px]">
          <v-chart
            v-if="showStep3"
            class="chart"
            ref="chart"
            :option="chartOption"
            style="height: 100%; width: 100%"
            autoresize
          ></v-chart>
        </div>
      </div>
    </div>

    <!-- STEP 5 -->

    <div
      v-if="currentPageValue?.showRationale"
      class="mt-16 overflow-y-hidden transition-all duration-500 w-full"
      :class="
        showStep3 && currentPageValue.xSelected?.length
          ? 'max-h-[640px]'
          : 'max-h-0'
      "
    >
      <div class="font-bold text-lg mb-4">5. Add Rationale / Comments</div>

      <div class="border-l-4 border-priorb-100 ps-4 pt-2 pb-4">
        <div class="flex flex-col gap-4">
          <textarea
            v-model="currentPageValue.rationale"
            rows="4"
            class="border w-full py-2 px-4 rounded"
            :placeholder="content.rationalePlaceholder"
          ></textarea>
        </div>
      </div>
    </div>

    <!--  STEP &: Download Results -->
    <div
      class="mt-16 w-full"
      v-if="showStep3 && currentPageValue.xSelected?.length"
    >
      <div class="font-bold text-lg mb-4">
        {{ currentPageValue?.showRationale ? 6 : 5 }}. Save Results
      </div>
      <div class="border-l-4 border-priorb-100 ps-4 pt-0.5 pb-3">
        <div class="text-sm text-gray-700 mb-2">
          Results are saved automatically, but can also be downloaded here.
        </div>
        <button
          class="border bg-black text-white py-2 px-4 rounded flex items-center gap-2 hover:opacity-80"
          @click="downloadResultsProxy"
        >
          <Icon icon="bi:download" class="text-lg" />
          Download CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import PicotDetails from '@/components/survey/PicotDetails.vue';
import { sharedPropsJs } from '@/lib/utils';
import QuestionBlock from '@/components/survey/QuestionBlock.vue';
import RationaleInput from '@/components/survey/RationaleInput.vue';
import {
  probsToRawProbs,
  checkInputsValidity,
  orderOfElicitation,
  downloadWorkshopProbabilityResults,
  orderSign,
  createChartOpts,
} from '@/lib/probabilityUtils';
import SimpleSwitch from '@/components/admin/SimpleSwitch.vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { WorkshopProbabilityAgendaItem } from '@/models/AgendaClass';
import { Icon } from '@iconify/vue';
import VChart from 'vue-echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';

import { getProbabilityFit } from '@/api/analytics';
import { toast } from 'vue-sonner';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

const props = defineProps(sharedPropsJs);
if (!props.content.rationaleInstructions)
  props.content.rationaleInstructions = 'Add a rationale for the estimates';
const expertStore = useExpertStore();
const { currentPageValue } = storeToRefs(expertStore);
const { setCurrentQuestionCompleted } = expertStore;
WorkshopProbabilityAgendaItem.initialiseResponse(currentPageValue, props);

const minInit = ref(0);
const maxInit = ref(100);
const numValues = ref(3);
const toggleValOrder = ref(false);

const shelfData = ref({});
const loading = ref(false);
const bestFit = ref('');

const showStep3 = ref(false);
const showStep2 = ref(false);
const showStep1 = ref(true);
const showDensity = ref(false);

const throttle = ref(null);
const firstPlotMadeManually = ref(false);

const modelsAvailable = ref([]);
const probabilitiesRaw = ref([]);
const fitSelected = ref(currentPageValue.value?.fitSelected ?? null);

onMounted(() => {
  minInit.value = currentPageValue.value.values?.[0] ?? 0;
  maxInit.value = currentPageValue.value.values?.[currentPageValue.value.values.length - 1] ?? 100;
  showStep3.value = currentPageValue.value.probabilities?.some(
    (p) => p != null
  );
  showStep2.value =
    !showStep3.value && currentPageValue.value.values?.some((v) => v != null);
  showStep1.value = !showStep2.value && !showStep3.value;
  fitSelected.value = currentPageValue.value.fitSelected ?? null;
  probabilitiesRaw.value = probsToRawProbs(
    currentPageValue.value.probabilities
  );
  if (showStep3.value && currentPageValue.value.xSelected?.length) getFitDist();
});


onBeforeUnmount(() => {
  // prevent getFitDist from being called after component has changed
  if (throttle.value) clearTimeout(throttle.value);
});
watch(
  probabilitiesRaw,
  (newVal) => {
    currentPageValue.value.probabilities = newVal.map((p, i) => {
      if (p == null) return null;
      if (i > (newVal.length - 1) / 2) return (100 - p) / 100;
      return p / 100;
    });

    // After the first plot is generated, any change triggers update
    if (!firstPlotMadeManually.value) return;
    if (throttle.value) clearTimeout(throttle.value);
    throttle.value = setTimeout(() => {
      if (invalidInputs.value) return;
      getFitDist();
    }, 1000);
  },
  { deep: true }
);

watch(fitSelected, (newVal) => {
  currentPageValue.value.fitSelected = newVal;
  currentPageValue.value.ySelected = shelfData.value.y[newVal];
  currentPageValue.value.modelParams = shelfData.value.models[newVal];
});

const goToStep2 = () => {
  if (
    minInit.value == null ||
    maxInit.value == null ||
    maxInit.value >= Infinity ||
    minInit.value <= -Infinity
  )
    return alert('Set min and max values');
  if (
    (props.content.minLimit != null &&
      minInit.value < props.content.minLimit) ||
    (props.content.maxLimit != null && maxInit.value > props.content.maxLimit)
  )
    return alert('Values must be between min and max limits');
  if (minInit.value >= maxInit.value)
    return alert('Max value must be greater than min value');
  if (numValues.value < 2) return alert('At least 2 values are required');
  if (numValues.value > 5) return alert('Maximum 5 values are allowed');

  showStep2.value = true;
  showStep1.value = false;
  const step = (maxInit.value - minInit.value) / (numValues.value + 1);
  currentPageValue.value.values = Array.from(
    { length: numValues.value + 2 },
    (_, i) => minInit.value + i * step
  ).map((v) => Math.round(v * 100) / 100);
};

const goToStep3 = () => {
  if (
    currentPageValue.value.values.some((v) => v == null || v === '' || isNaN(v))
  )
    return alert('No empty values allowed');
  if (
    currentPageValue.value.values.some(
      (v, i) => i > 0 && v <= currentPageValue.value.values[i - 1]
    )
  )
    return alert('Values must be in ascending order');

  probabilitiesRaw.value = currentPageValue.value.values.map((_v, i) =>
    i === 0 || i === currentPageValue.value.values.length - 1 ? 0 : null
  );
  showStep3.value = true;
  showStep2.value = false;
};

const resetInitModel = () => {
  currentPageValue.value.xSelected = [];
  currentPageValue.value.ySelected = [];
  currentPageValue.value.modelParams = [];
  currentPageValue.value.fitSelected = null;
  firstPlotMadeManually.value = false;
};

const goBackToStep1 = () => {
  showStep1.value = true;
  showStep2.value = false;
  showStep3.value = false;
  resetInitModel();
};

const goBackToStep2 = () => {
  showStep3.value = false;
  showStep2.value = true;
  resetInitModel();
};

const chartOption = computed(() => {
  return createChartOpts(
    currentPageValue?.value?.values,
    currentPageValue?.value?.probabilities,
    currentPageValue?.value?.ySelected,
    currentPageValue?.value?.xSelected,
    showDensity.value,
    props.content?.units
  );
});

const invalidInputs = computed(() =>
  checkInputsValidity(
    currentPageValue.value.values,
    currentPageValue.value.probabilities,
    probabilitiesRaw.value
  )
);

const chart = ref(null);
const getFitDist = async () => {
  if (invalidInputs.value) return;
  if(!currentPageValue || !currentPageValue.value || !currentPageValue.value.values || !currentPageValue.value.probabilities) return;
  if (!firstPlotMadeManually.value) {
    firstPlotMadeManually.value = true;
    const chartRef = chart.value?.$el;
    if (chartRef) chartRef.scrollIntoView({ behavior: 'smooth' });
  }
  const { values, probabilities, minLimit, maxLimit } = currentPageValue.value;
  const nx = 50;
  try {
    loading.value = true;
    const { data } = await getProbabilityFit(
      values,
      probabilities,
      minLimit,
      maxLimit,
      nx
    );

    if (data.success === false) {
      throw new Error(data.error ?? 'An error occurred');
    }
    shelfData.value = data;
    bestFit.value = data.bestFit;
    modelsAvailable.value = Object.keys(data.y);
    let _fitCurrent = currentPageValue.value.fitSelected;
    fitSelected.value = _fitCurrent ?? data.bestFit;
    currentPageValue.value.fitSelected = fitSelected.value;
    currentPageValue.value.modelParams = data.models[fitSelected.value];

    currentPageValue.value.ySelected = data.y[fitSelected.value];

    currentPageValue.value.xSelected = data.x;
  } catch (error) {
    toast.error(
      'Error: The model fit may have failed to converge or the server may be experiencing issues',
      {
        style: { background: '#fda4af' },
      }
    );
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const downloadResultsProxy = () => {
  downloadWorkshopProbabilityResults(
    currentPageValue.value,
    props.content.questionTitle,
    'workshop'
  );
};

watch(
  currentPageValue,
  (response) => {
    let complete;
    if (!response) {
      setCurrentQuestionCompleted(false);
      return;
    }
    if (response.ySelected?.length && response.xSelected?.length) {
      if (
        response.rationaleRequired &&
        (response.rationale === '' || response.rationale == null)
      ) {
        setCurrentQuestionCompleted(false);
        return;
      }
      setCurrentQuestionCompleted(true);
      return;
    } else {
      setCurrentQuestionCompleted(false);
    }
  },
  { deep: true }
);
</script>

<style scoped></style>
