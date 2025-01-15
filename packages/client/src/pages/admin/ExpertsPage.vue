<template>
  <div class="container pt-8 flex-1 max-w-[120ch]">
    <div class="flex gap-2 justify-start pt-1 me-auto mb-6 ps-2">
      <router-link
        class="router-link-class hover:text-priorb-PRIMARY/80"
        v-if="isLoggedIn"
        :to="{
          name: 'SurveyOverview',
        }"
        >Surveys</router-link
      >
      <span class="text-vGray-400">/</span>
      <router-link
        class="router-link-active md:pr-3"
        v-if="isLoggedIn && currentSurveyId"
        :to="{
          name: 'ExpertsPage',
          params: { surveyId: currentSurveyId },
        }"
        >Experts</router-link
      >
    </div>
    <div
      class="border-b border-black mb-[50px] py-4 flex flex-row justify-between items-center"
    >
      <div class="text-2xl font-semibold">
        {{ currentSurveyData?.name }}
      </div>

      <div
        variant="outline"
        class="me-auto text-priorb-secondary font-semibold flex align-center text-sm cursor-pointer hover:text-priorb-secondary/50 px-3"
        @click="() => viewTestSurvey()"
      >
        View Survey
        <Icon icon="bi:box-arrow-in-up-right" class="text-lg ms-1 mt-0.5" />
      </div>

      <div class="flex ms-auto gap-4 items-center">
        <BadgeBase
          class="rounded-xl py-1 px-2 h-fit"
          :class="statusBadgeMapper(currentSurveyData?.status)"
          >{{ currentSurveyData?.status }}</BadgeBase
        >
      </div>
    </div>

    <div class="flex flex-row justify-start mb-6 gap-3">
      <h1 class="text-xl font-semibold">
        Experts ({{ currentExperts?.length }})
      </h1>
      <div class="mx-auto"></div>

      <button
        class="h-10 border-priorb-PRIMARY text-priorb-PRIMARY hover:bg-priorb-PRIMARY/10 hover:text-priorb-900 border-2 px-3 font-medium rounded"
        @click="setIsOpen(true, true)"
      >
        Add Expert +
      </button>
      <NavLink
        label="Responses"
        to="ResultsPage"
        :params="{ surveyId: currentSurveyId, expertId: 'pooled' }"
        class="bg-priorb-PRIMARY text-white text-sm hover:bg-priorb-PRIMARY/80 px-4 py-2 font-medium"
      />
    </div>

    <div class="overflow-x-auto w-full pb-24">
      <table class="w-full">
        <thead>
          <tr class="text-sm text-gray-700 bg-gray-100 whitespace-nowrap h-14">
            <th class="w-10"></th>
            <th
              
            >
            <div class="td-sortable"
              @click="sortBy('expert')"
              >
              EXPERT
              <Icon
                icon="fluent:arrow-sort-20-regular"
                class="transition-opacity duration-100 opacity-50 text-gray-700 text-lg icon-hoverable"
              />
            </div>
            </th>
            <th
            >
            <div class="td-sortable"
            @click="sortBy('email')">
              EMAIL
              <Icon
                icon="fluent:arrow-sort-20-regular"
                class="transition-opacity duration-100 opacity-50 text-gray-700 text-lg icon-hoverable"
              />
            </div>
            </th>
            <th><div class="td-sortable"
            @click="sortBy('update')">
              UPDATED
              <Icon
                icon="fluent:arrow-sort-20-regular"
                class="transition-opacity duration-100 opacity-50 text-gray-700 text-lg icon-hoverable"
              />
            </div></th>
            <th>SURVEY LINK</th>
            <th><div class="td-sortable"
            @click="sortBy('status')">
              STATUS
              <Icon
                icon="fluent:arrow-sort-20-regular"
                class="transition-opacity duration-100 opacity-50 text-gray-700 text-lg icon-hoverable"
              />
            </div></th>
            <th><div class="td-sortable"
            @click="sortBy('progress')">
              PROGRESS
              <Icon
                icon="fluent:arrow-sort-20-regular"
                class="transition-opacity duration-100 opacity-50 text-gray-700 text-lg icon-hoverable"
              />
            </div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expert, index) in expertTableData" :key="expert._id">
            <td class="w-20">
              <Menu
                as="div"
                class="relative inline-block text-left w-full"
                ref="btn"
              >
                <div class="ps-2 lg:ps-4 pe-2 xl:pe-4">
                  <MenuButton>
                    <Icon icon="bi:three-dots-vertical" class="text-2xl" />
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-25"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-25"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute z-10 mt-2 border border-gray-200 rounded bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none font-medium text-black"
                  >
                    <div class="py-1 px-0.5 w-[180px]">
                      <MenuItem
                        v-slot="{ active }"
                        @click="setIsOpen(true, false, expert)"
                      >
                        <span
                          :class="[
                            active
                              ? 'flex bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block p-2 text-sm flex gap-2 cursor-pointer',
                          ]"
                        >
                          <Icon icon="bi:pencil" class="text-xl" />
                          Edit
                        </span>
                      </MenuItem>
                      <MenuItem
                        v-slot="{ active }"
                        @click="openEmailDialog(expert)"
                      >
                        <span
                          :class="[
                            active
                              ? 'flex bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block p-2 text-sm flex gap-2 cursor-pointer',
                          ]"
                        >
                          <Icon icon="bi:envelope" class="text-xl" />
                          Email Survey URL
                        </span>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
            <td class="font-semibold
            overflow-hidden overflow-ellipsis
            ">{{ expert.name }}</td>
            <td class="overflow-hidden overflow-ellipsis">{{ expert.email }}</td>
            <td>{{ expert.updatedAtRelative }}</td>
            <td>
              <button
                class="border border-gray-400 px-1.5 text-xs py-0.5 rounded w-fit flex items-center gap-1 justify-center whitespace-nowrap"
                @click="copyToClipboardProxy(expert.surveyUrl, index)"
              >
                Copy URL
                <Icon
                  v-if="!urlCopiedArray[index]"
                  icon="mdi:clipboard-outline"
                  class="text-lg text-gray-500"
                />
                <Icon
                  v-else
                  icon="mdi:clipboard-check-outline"
                  class="text-lg text-gray-500"
                />
              </button>
            </td>
            <td>
              <BadgeBase
                class="rounded-xl py-1 px-2 h-fit"
                :class="statusBadgeMapper(expert.status)"
              >
                {{ expertStates[expert.status] ?? expert.status }}
              </BadgeBase>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <div class="text-gray-700">
                  <span class="text-xl">{{ expert.completedCount }}</span
                  ><span class="text-sm">/{{ expert.questionCount }}</span>
                </div>
                <div class="w-full">
                  <div class="h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-full bg-priorb-PRIMARY rounded-full"
                      :style="{
                        width: `${(expert.completedCount / expert.questionCount) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="mx-auto">
      <ExpertTable :experts="expertTableData" />
    </div> -->
  </div>

  <!-- send email dialog -->
  <SendInviteDialog v-model="emailDialogOpen" :currentExpert="emailDetails" />

  <!-- expert details dialog -->
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="setIsOpenProxy" class="relative z-50" :unmount="true">
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

      <!-- Full-screen scrollable container -->
      <div class="fixed inset-0 w-screen overflow-y-auto">
        <!-- trasnition: move in from the left , and move out to the left -->

        <TransitionChild
          :show="isOpen"
          enter="transform transition-transform duration-250"
          enter-from="-translate-x-[400px]"
          enter-to="translate-x-0"
          leave="transform transition-transform duration-150"
          leave-from="translate-x-0"
          leave-to="-translate-x-[400px]"
        >
          <div
            class="fixed top-0 bottom-0 left-0 w-[380px] bg-white h-screen shadow-lg"
          >
            <DialogPanel
              class="w-full max-w-sm rounded bg-white p-10 flex flex-col gap-4 h-screen overflow-y-auto"
            >
              <DialogTitle
                >{{ createMode ? 'Add' : 'Edit' }} Expert</DialogTitle
              >

              <div>
                <label class="text-sm text-gray-700"
                  >Name or Alias
                  <span class="text-gray-400">(required)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder=""
                  v-model="prospectExpert.name"
                />
              </div>

              <div>
                <label class="text-sm text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  v-model="prospectExpert.email"
                />
              </div>

              <div v-if="!createMode">
                <label class="text-sm text-gray-700">Consent link</label>
                <input id="consentLink" placeholder="" label="Consent link" />
              </div>

              <div v-if="!createMode">
                <label class="text-sm text-gray-700">Survey link</label>
                <div class="flex relative items-stretch">
                  <div class="border px-3 rounded-s py-2 overflow-hidden">
                    <code
                      class="bg-transparent text-sm whitespace-nowrap overflow-scroll"
                    >
                      {{ prospectExpert.surveyUrl }}
                    </code>
                  </div>
                  <button
                    class="py-3 flex items-center justify-center rounded-none border-e border-t border-b rounded-e"
                    @click="copyToClipboardWithToast(prospectExpert.surveyUrl)"
                  >
                    <Icon
                      icon="mdi:clipboard-outline"
                      class="cursor-pointer text-gray-500 text-xl w-8"
                    />
                  </button>
                </div>
              </div>

              <div v-if="prospectExpert && !createMode">
                <label class="text-sm text-gray-700">Status</label>
                <Listbox v-model="prospectExpert.status">
                  <ListboxButton
                    class="w-full cursor-default rounded bg-white py-1.5 pl-3 pr-10 text-start focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm inline-flex justify-start border relative"
                  >
                    <Icon icon="bi:chevron-down" class="me-2 text-lg" />

                    <BadgeBase
                      :class="statusBadgeMapper(prospectExpert.status)"
                      variant="clear-round-sm"
                    >
                      {{
                        expertStates[prospectExpert.status] ??
                        prospectExpert.status
                      }}
                    </BadgeBase>
                  </ListboxButton>
                  <ListboxOptions
                    class="absolute bg-white w-[300px] border shadow rounded mt-1 z-10 px-2 pt-2"
                  >
                    <ListboxOption
                      v-slot="{ active, selected }"
                      class="cursor-pointer select-none relative list-none"
                      v-for="(value, key) in expertStates"
                      :key="key"
                      :value="key"
                    >
                      <div
                        :class="{ 'bg-gray-100': active }"
                        class="flex items-center gap-2 px-1 py-1 rounded"
                      >
                        <div>
                          <Icon
                            icon="bi:check2"
                            class="text-xl text-gray-900"
                            :class="{ 'opacity-0': !selected }"
                          />
                        </div>
                        <BadgeBase
                          :class="statusBadgeMapper(key)"
                          variant="clear-round-sm"
                        >
                          {{ value }}
                        </BadgeBase>
                      </div>
                    </ListboxOption>
                  </ListboxOptions>
                </Listbox>
              </div>

              <div
                class="text-gray-700 text-xs"
                v-if="
                  prospectExpert?.status &&
                  lockedStatuses.includes(prospectExpert.status)
                "
              >
                The expert cannot access the survey<span
                  v-if="prospectExpert.status === 'archived'"
                >
                  and responses are not included in the analysis</span
                >.
              </div>

              <div class="grid w-full max-w-sm items-center gap-1.5 mt-2">
                <label class="text-gray-700 text-sm">Survey components:</label>
                <div v-for="(q, i) in currentSurveyAgenda" :key="i">
                  <div class="flex items-center ps-2 gap-2">
                    <input
                      type="checkbox"
                      :id="'includeQ-' + q._id"
                      :value="q._id"
                      :disabled="q.mandatory"
                      @change="toggleQuestion(q._id)"
                      :checked="questionsSelected[q._id] !== false"
                    />
                    <label
                      class="text-base whitespace-nowrap disabled:cursor-not-allowed"
                      :class="
                        q.mandatory
                          ? 'cursor-not-allowed text-gray-400'
                          : 'cursor-pointer'
                      "
                      :for="'includeQ-' + q._id"
                    >
                      {{ q.adminLabel }}</label
                    >
                  </div>
                </div>
                <div class="text-xs text-gray-700 leading-snug mt-2">
                  Unselect components to:
                  <ul class="list-disc pl-5 mt-1">
                    <li>Hide the question from the expert</li>
                    <li>Exclude existing responses from the analysis</li>
                  </ul>
                </div>
              </div>

              <div class="flex gap-4 mt-auto flex align-center justify-end">
                <button
                  class="bg-white border border-gray-500 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded text-lg"
                  @click="setIsOpen(false)"
                >
                  Cancel
                </button>
                <button
                  class="bg-priorb-500 hover:bg-priorb-500/80 text-white px-6 py-1.5 rounded text-lg"
                  @click="saveProxy(prospectExpert, createMode)"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useAdminStore } from '@/store/adminStore';
import { computed, onBeforeUnmount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import BadgeBase from '@/components/admin/BadgeBase.vue';
import { Icon } from '@iconify/vue';
import SendInviteDialog from '@/components/admin/SendInviteDialog.vue';
import {
  statusBadgeMapper,
  copyToClipboardWithToast,
  expertStates,
  timeSinceUpdate,
} from '@/lib/utils';
import NavLink from '@/components/admin/NavLink.vue';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
const emailDialogOpen = ref(false);
const emailDetails = ref(null);
const openEmailDialog = (expert) => {
  emailDetails.value = expert;
  emailDialogOpen.value = true;
};
const questionsSelected = ref({});
const hoverIcon = ref([]);
const isOpen = ref(false);
const lockedStatuses = ['withdrawn', 'archived', 'submitted'];
const prospectExpert = ref(null);
const prospectExpertCopy = ref(null);
function setIsOpen(value, openInCreateMode = false, expert) {
  questionsSelected.value = {};
  isOpen.value = value;
  createMode.value = openInCreateMode || false;
  if (value === true) {
    if (expert) {
      prospectExpert.value = expert;
      prospectExpertCopy.value = { ...expert };
      questionsSelected.value = expert.ignoreQuestions.reduce((acc, q) => {
        acc[q] = false;
        return acc;
      }, {});
    } else {
      prospectExpert.value = {
        name: '',
        email: '',
        status: 'notContacted',
        surveyUrl: '',
        consentUrl: '',
        ignoreQuestions: [],
      };
      prospectExpertCopy.value = { ...prospectExpert.value };
    }
  } else {
    setTimeout(() => {
      prospectExpert.value = null;
    }, 300);
  }
}
const setIsOpenProxy = () => {
  if (
    JSON.stringify(prospectExpert.value) !==
    JSON.stringify(prospectExpertCopy.value)
  ) {
    if (confirm('Are you sure you want to discard changes?')) {
      setIsOpen(false);
    }
  } else {
    setIsOpen(false);
  }
};
const toggleQuestion = (id) => {
  questionsSelected.value[id] =
    questionsSelected.value[id] === false ? true : false;
};
const createMode = ref(false);
const adminStore = useAdminStore();
const { createNewExpert } = adminStore;
const {
  currentExperts,
  currentSurveyId,
  currentSurveyData,
  isLoggedIn,
  currentSurveyAgenda,
} = storeToRefs(adminStore);

const urlCopiedArray = ref([]);

const copyToClipboardProxy = (url, index) => {
  copyToClipboardWithToast(url);
  urlCopiedArray.value[index] = true;
  setTimeout(() => {
    urlCopiedArray.value[index] = false;
  }, 3000);
};

// select survey from route, if not already selected
const route = useRoute();
const surveyId = route.params.surveyId;
if (surveyId !== currentSurveyId.value) {
  adminStore.selectSurvey(surveyId);
}

const updateExpertDataInterval = setInterval(() => {
  adminStore.updateExpertData(surveyId);
}, 10000);

onBeforeUnmount(() => {
  clearInterval(updateExpertDataInterval);
});



const expertSort = ref(0);
const emailSort = ref(0);
const statusSort = ref(0);
const progressSort = ref(0);
const updateSort = ref(0);
const sortBy = (column) => {
  if (column === 'expert') {
    expertSort.value = expertSort.value === 0 ? 1 : expertSort.value * -1;
    emailSort.value = 0;
    statusSort.value = 0;
    progressSort.value = 0;
    updateSort.value = 0;
  } else if (column === 'email') {
    emailSort.value = emailSort.value === 0 ? 1 : emailSort.value * -1;
    expertSort.value = 0;
    statusSort.value = 0;
    progressSort.value = 0;
    updateSort.value = 0;
  } else if (column === 'status') {
    statusSort.value = statusSort.value === 0 ? 1 : statusSort.value * -1;
    expertSort.value = 0;
    emailSort.value = 0;
    progressSort.value = 0;
    updateSort.value = 0;
  } else if (column === 'progress') {
    progressSort.value = progressSort.value === 0 ? 1 : progressSort.value * -1;
    expertSort.value = 0;
    emailSort.value = 0;
    statusSort.value = 0;
    updateSort.value = 0;
  } else if (column === 'update') {
    updateSort.value = updateSort.value === 0 ? 1 : updateSort.value * -1;
    expertSort.value = 0;
    emailSort.value = 0;
    statusSort.value = 0;
    progressSort.value = 0;
  }
};

const expertTableData = computed(() => {
  if (!currentExperts.value || !currentExperts.value.length) return [];
  let unsortedData = currentExperts.value.map((expert) => {
    return {
      ...expert,
      name: expert.name,
      email: expert.email,
      surveyUrl: expert.surveyUrl,
      status: expert.status,
      surveyId: expert.surveyId,
      id: expert.id,
      tenantId: expert.tenantId,
      updatedAtRelative: timeSinceUpdate(expert.updatedAt),
      updatedAt: expert.updatedAt,
      questionCount: expert.questionCount,
      completedCount: expert.completedCount,
    };
  });

  if (expertSort.value === 1) {
    unsortedData = unsortedData.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } else if (expertSort.value === -1) {
    unsortedData = unsortedData.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  } else if (emailSort.value === 1) {
    unsortedData = unsortedData.sort((a, b) => {
      return a.email.localeCompare(b.email);
    });
  } else if (emailSort.value === -1) {
    unsortedData = unsortedData.sort((a, b) => {
      return b.email.localeCompare(a.email);
    });
  } else if (statusSort.value === 1) {
    unsortedData = unsortedData.sort((a, b) => {
      return a.status.localeCompare(b.status);
    });
  } else if (statusSort.value === -1) {
    unsortedData = unsortedData.sort((a, b) => {
      return b.status.localeCompare(a.status);
    });
  } else if (progressSort.value === 1) {
    unsortedData = unsortedData.sort((a, b) => {
      return a.completedCount / a.questionCount - b.completedCount / b.questionCount;
    });
  } else if (progressSort.value === -1) {
    unsortedData = unsortedData.sort((a, b) => {
      return b.completedCount / b.questionCount - a.completedCount / a.questionCount;
    });
  } else if (updateSort.value === 1) {
    unsortedData = unsortedData.sort((a, b) => {
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    });
  } else if (updateSort.value === -1) {
    unsortedData = unsortedData.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  return unsortedData;
});

const saveProxy = (expert, createMode) => {
  if (!expert.name.trim()) return alert('Expert name cannot be empty.');

  const questionIgnore = Object.keys(questionsSelected.value).filter(
    (q) => questionsSelected.value[q] === false
  );
  expert.ignoreQuestions = questionIgnore;
  if (createMode) createExpert(expert);
  else updateExpert(expert);
};

const createExpert = async (expert) => {
  if (currentExperts?.value.some((e) => e.name === expert?.name))
    return alert('Expert name must be unique.');

  const expertCreated = await createNewExpert(surveyId, expert);
  if (expertCreated) {
    setIsOpen(false);
  }
};

const updateExpert = async (expert) => {
  const expertDataForUpdate = {
    tenantId: expert.tenantId,
    surveyId: expert.surveyId,
    id: expert.id,
    name: expert.name,
    email: expert.email,
    status: expert.status,
    ignoreQuestions: expert.ignoreQuestions,
  };

  const expertUpdated =
    await adminStore.updateCurrentExpert(expertDataForUpdate);
  if (expertUpdated) {
    setIsOpen(false);
  }
};

const openProjectSettings = () => {
  alert('Not available.');
};

const viewTestSurvey = () => {
  adminStore.viewTestSurvey(currentSurveyData.value?.id);
};
</script>

<style scoped>
th {
  padding: 0 10px;
  text-align: left;
  white-space: nowrap;
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
</style>
