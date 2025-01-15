<template>
  <div>
    <div>
      <TextField
      v-model="qData.questionTitle"
      placeholder="Type question here"
      color="priorb-300"
    />
    <TextField
      v-model="qData.description"
      placeholder="Add description (optional)"
      color="gray-50"
      class="text-sm align-middle py-3"
    />
      
    
      <draggable
        :list="qData.rows"
        itemKey="id"
        tag="div"
        class="draggable-rows"
      >
        <template #item="{ element, index }">
          <div
            class="w-full mb-3 min-h-20 pl-2 pr-6 py-3 bg-[#f8f8f8] justify-start items-center gap-px inline-flex"
            :key="index"
          >
            <div class="w-[25px] relative">
              <Icon
                icon="bi:grip-vertical"
                class="text-xl overflow-visible text-gray-400 cursor-move"
              />
            </div>
            <div class="w-full justify-center items-center gap-6 flex">
              <div
                class="grow shrink basis-0 bg-white rounded border border-[#eaecef] justify-start items-start gap-12 flex"
              >
                <div class="w-full justify-between items-center flex" >
                  <input
                    type="text"
                    v-model="qData.rows[index]"
                    :name="'option' + index"
                    placeholder="Statement or estimate to validate"
                    class="text-sm font-normal leading-snug focus:outline-none w-full p-4 rounded"
                  />

                  <button
                    @click="removeStatement(index)"
                    class="p-4"
                    v-if="qData?.rows?.length > 1"
                  >
                    <Icon icon="bi:x-lg" class="overflow-visible" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <div
        @click="addStatement"
        class="self-stretch pl-3.5 pr-6 justify-start items-center gap-2 inline-flex"
      >
        <div class="w-6 h-6 justify-center items-center flex p-2">
          <div class="w-5 h-5 relative flex-col justify-start items-start flex">
            <Icon icon="bi:plus-circle" class="text-3xl text-priorb-500" />
          </div>
        </div>
        <div class="flex-col justify-start items-start inline-flex p-2">
          <button class="text-priorb-500 text-sm font-medium">
            Add Statement
          </button>
        </div>
      </div>

      <div class="pb-10">
        <div class="mt-4 py-4 font-semibold">Response options</div>
        
        <div
          v-for="(option, index) in qData.columns"
          :key="index"
          class="flex items-center border rounded px-3 py-2 mb-3 ms-4"
        >
          <input type="radio" class="pointer-events-none" />
          <div class="flex w-full">
            <input
              type="text"
              v-model="qData.columns[index]"
              :name="'option' + index"
              :placeholder="'Option ' + (index + 1)"
              class="ms-2 focus:outline-none w-full"
            />
            <button
              @click="removeOption(index)"
              class="relative"
              v-if="index >= 2"
            >
              <Icon icon="bi:x" class="absolute text-3xl right-0 bg-white" />
            </button>
          </div>
        </div>
        <div
          @click="addNoResponseOpt"
          class="self-stretch pl-3.5 pr-6 justify-start items-center gap-2 inline-flex"
          v-if="qData.columns?.length < 3"
        >
          <div class="w-6 h-6 p-0.5 justify-center items-center flex">
            <div
              class="w-5 h-5 relative flex-col justify-start items-start flex"
            >
              <Icon icon="bi:plus-circle" class="text-3xl text-priorb-500" />
            </div>
          </div>
          <div class="flex-col justify-start items-start inline-flex">
            <button class="text-priorb-500 text-sm font-medium">
              Allow "No Response"
            </button>
          </div>
        </div>
        

        <div
      class="flex items-center text-gray-900 border rounded px-2 py-1 border-black w-fit text-sm  mt-4 ms-4 mb-2"
    >
      <Icon icon="bi:info-circle" class="text-xl me-2" />
      <div>
        <span v-if="qData.columns">
        If <span v-if="qData.columns[2]"><span class="italic whitespace-nowrap">{{ qData.columns[1] }} </span></span><span v-else class="italic whitespace-nowrap">{{ qData.columns[1] }}</span></span> is selected, expert will be asked to provide a comment.
      </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { initAgendaItem } from '@/lib/addAgendaItemUtils';
import TextField from '@/components/admin/TextField.vue';
import draggable from 'vuedraggable';
const agendaItem = defineModel();
agendaItem.value = initAgendaItem('matrix', agendaItem.value);
const qData = computed(() => agendaItem.value.content);

const addStatement = () => {
  agendaItem.value.content.rows.push('');
};

const removeOption = (index) => {
  agendaItem.value.content.columns.splice(index, 1);
};

const removeStatement = (index) => {
  agendaItem.value.content.rows.splice(index, 1);
};

const addNoResponseOpt = () => {
  agendaItem.value.content.columns.push('No Response');
};
</script>

<style scoped>

.remove-statement {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.input-wrapper {
  position: relative;
  width: 100%;
}
</style>
