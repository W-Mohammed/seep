<template>
  <draggable
    class="dragArea"
    tag="ul"
    :list="agenda"
    :group="{ name: 'g1' }"
    :disabled="false"
    :itemKey="(element) => element.pageId"
    @end="emit('reIndexAgenda')"
    :move="onMove"
  >
    <template #item="{ element, index }">
      <div>
        <input
          :key="element.pageId"
          type="radio"
          :id="element.pageId"
          :value="element.pageId"
          v-model="selectedQuestion"
          class="hidden-radio"
        />

        <div
  class="w-full relative flex items-center cursor-pointer hover:bg-priorb-200 hover:text-black text-black"
  :class="{
    'bg-priorb-100': selectedQuestion === element.pageId,
    'bg-white': selectedQuestion !== element.pageId,
    'ps-4': nestedClass,
    selected: selectedQuestion === element.pageId,
  }"
  @click.stop="updateSelection(element)"
>

          <label
            :for="element.pageId"
            class="flex items-center justify-start w-full cursor-pointer py-2 whitespace-nowrap"
          >
            <Icon
              icon="bi:grip-vertical"
              class="text-2xl overflow-visible text-gray-500 cursor-move"
            />
            <div class="flex flex-col max-w-[220px] overflow-hidden">
            <div v-if="element.section">Section</div>
              <div v-else class="flex flex-col" :title="labelMapperForAgendaItems(element, true)">
              <div class="leading-tight text-black text-sm">
                {{ element.order+1 }}
                {{ labelMapperForAgendaItems(element, false) }}
              </div>
              <div v-if="!element.section" class="text-xs text-gray-600">
                <span :class="{'italic text-gray-500': !labelMapperForAgendaItems(element, true)}"
                > 
                {{
                  labelMapperForAgendaItems(element, true) ?? 'No content'
                }}
                </span>
              </div>
              </div>
            </div>
          </label>
          <div
            class="absolute right-0 lg:right-2 flex items-center ms-auto text-gray-700 text-lg gap-1 ps-1 action-buttons bg-inherit h-8"
            v-if="selectedQuestion === element.pageId"
          >
            <Icon
              icon="bi-copy"
              class="overflow-visible"
              @click="duplicateAgendaItem(element.pageId)"
            />
            <Icon
              icon="bi-trash3"
              class="overflow-visible"
              @click="removeQuestion(element.pageId)"
            />
          </div>

        </div>

        <!-- Render nested children if it's a section -->
        <div v-if="element.section">
          <add-agenda-items-draggable
            v-model:selectedQuestion="selectedQuestion"
            v-model:agenda="element.children"
            :nestedClass="true"
            @end="emit('reIndexAgenda')"
            @click.stop
            class="overflow-scroll"
          >
          </add-agenda-items-draggable>

          <div class="ps-2 lg:ps-4 pe-2 xl:pe-4">
            <button
              @click="addAgendaItemToSection(element.pageId)"
              class="px-1.5 py-1 text-black text-sm flex hover:bg-priorb-50 items-center w-full py-1.5"
            >
              <Icon
                icon="akar-icons:plus"
                class="text-priorb-PRIMARY rounded-full text-xl border border-priorb-PRIMARY p-0.5 h-4 w-4 me-4"
              />
              <span class="font-semibold text-priorb-PRIMARY"> Add Page </span>
            </button>
            <!-- Add Page Button -->
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>
<script setup>
import { ref, defineModel, defineEmits, onMounted, watch } from 'vue';
import { initAgendaItem, setPageId } from '@/lib/addAgendaItemUtils';
import { labelMapperForAgendaItems } from '@/lib/utils';
import draggable from 'vuedraggable';
import { Icon } from '@iconify/vue';

const selectedQuestion = defineModel('selectedQuestion');
const agenda = defineModel('agenda');
const emit = defineEmits(['reIndexAgenda']);
const props = defineProps({
  nestedClass: {
    type: Boolean,
    default: false,
  },
});

const updateSelection = (element) => {
  emit('reIndexAgenda');
  selectedQuestion.value = element.pageId;
};

// to prevent sections from being nested inside sections
const onMove = (event) => {
  const draggedElement = event.draggedContext.element;
  const targetElement = event.relatedContext.element;

  // Prevent sections from being nested inside other items
  // Nested means that the target element is not a section but its parent is
  if (
    draggedElement.section &&
    targetElement &&
    !targetElement.section &&
    targetElement.isChild
  ) {
    return false;
  }
  return true;
};

const removeQuestion = (pageId) => {
  const { mainIndex, subIndex } = searchItemIndex(pageId);
  if (confirm('Are you sure you want to delete this question?')) {
    if (mainIndex !== null) {
      if (subIndex !== null) {
        agenda.value[mainIndex].children.splice(subIndex, 1);
      } else {
        agenda.value.splice(mainIndex, 1);
      }
    }
    setTimeout(() => {
      if (agenda.value.length == 0)
        selectedQuestion.value = 'IntroPage';
      else if (mainIndex === agenda.value.length)
        selectedQuestion.value = agenda.value[mainIndex - 1].pageId;
      else
        selectedQuestion.value = agenda.value[mainIndex].pageId;
    }, 100);
  }
};

const addAgendaItem = (newQuestion = null) => {
  if (!newQuestion) {
    newQuestion = initAgendaItem();
  } else if (!newQuestion.pageId) {
    newQuestion.pageId = setPageId();
  }
  agenda.value.push(newQuestion);
  setTimeout(() => {
    selectedQuestion.value = newQuestion.pageId;
  }, 10);
};

const addAgendaItemToSection = (sectionId) => {
  const newQuestion = initAgendaItem();
  const { mainIndex, subIndex } = searchItemIndex(sectionId);
  if (mainIndex == null) return;
  newQuestion.pageId = setPageId();
  agenda.value[mainIndex].children.push(newQuestion);
  setTimeout(() => {
    selectedQuestion.value = newQuestion.pageId;
  }, 10);
};

const duplicateAgendaItem = (pageId) => {
  const { mainIndex, subIndex } = searchItemIndex(pageId);
  if (mainIndex == null) return;

  const newQ = !subIndex
    ? agenda.value[mainIndex]
    : agenda.value[mainIndex].children[subIndex];
  const newQuestion = JSON.parse(JSON.stringify(newQ));
  newQuestion.pageId = setPageId();
  if (newQuestion.section) {
    newQuestion.children.forEach((child) => {
      child.pageId = setPageId();
    });
  }
  newQuestion.order = agenda.value.length + 1;
  if (subIndex !== null) {
    agenda.value[mainIndex].children.splice(subIndex + 1, 0, newQuestion);
  } else {
    agenda.value.splice(mainIndex + 1, 0, newQuestion);
  }
  setTimeout(() => {
    selectedQuestion.value = newQuestion.pageId;
  }, 10);
};

// DUPLICATE ! COPY IN AddProjectPage.vue
const searchItemIndex = (pageId) => {
  for (let i = 0; i < agenda.value.length; i++) {
    if (agenda.value[i].pageId === pageId) {
      return { mainIndex: i, subIndex: null };
    }
    if (agenda.value[i].section) {
      for (let j = 0; j < agenda.value[i].children.length; j++) {
        if (agenda.value[i].children[j].pageId === pageId) {
          return { mainIndex: i, subIndex: j };
        }
      }
    }
  }
  return { mainIndex: null, subIndex: null };
};

watch(
  () => agenda.value,
  () => {
    emit('reIndexAgenda');
  },
  { deep: true }
);
</script>
<style scoped>
.question-radio-btns input[type='radio'] {
  display: none;
}

.question-radio-btns input[type='radio']:checked + .label-container,
.Checked + .label-container {
  @apply font-semibold;
  @apply bg-priorb-50;
}

input[type='radio']:checked {
  @apply font-semibold;
  @apply bg-priorb-50;
}

.question-radio-btns .label-container {
  padding-right: 4px;
  padding-left: 4px;
  cursor: pointer;
  line-height: 1.4;
}

.question-radio-btns .label-container:hover {
  @apply bg-priorb-50;
}

ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
