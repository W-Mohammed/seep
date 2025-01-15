<template>
  <div class="flex flex-col items-center justify-center min-h-[40vh] pb-20">
    <div class="md:w-2/3 max-w-[60ch] text-center border px-8 py-6 rounded-lg border-gray-400">
      <div>
        <div v-if="content?.title" class="text-xl font-semibold pb-4">
          {{ content?.title }}
        </div>
      </div>
      <div>
        <div class="flex flex-col gap-4">
          <p v-if="content?.body">{{ content.body }}</p>
          <p v-if="content?.subtitle">{{ content.subtitle }}</p>







          <div class="flex flex-col gap-8 my-4">
<div class="flex flex-col items-center">
  <label class="block font-medium text-gray-700 mb-1">
    The leaderboard will show your responses under this name:
    </label
  >
  <code 
  class="block px-4 py-2 flex gap-2 items-center flex"
  > {{ proxyExpertName}} 
  
  <div class="relative">
      <Icon
        icon="mdi:content-copy"
        v-if="!copiedName"
        class="cursor-pointer"
        @click="copyNameToClipboard(proxyExpertName)"
      />
      <Icon icon="mdi:check" v-else class="text-gray-900" />
      <div
        class="absolute -bottom-1 left-0 w-20 h-10 text-xxs"
        v-if="copiedName"
      >
        copied!
      </div>
    </div>
  </code>
  <div class="text-sm text-gray-700">
  </div>
</div>


<div class="flex flex-col items-center">
  <label class="block font-medium text-gray-700 mb-1">
    Your personal survey URL is:</label
  >
  <code class="block px-4 py-2 flex gap-2 items-center text-sm">
    {{ surveyUrl }}
    <div class="relative">
      <Icon
        icon="mdi:content-copy"
        v-if="!copiedUrl"
        class="cursor-pointer"
        @click="copyUrlToClipboard(surveyUrl)"
      />
      <Icon icon="mdi:check" v-else class="text-gray-900" />
      <div
        class="absolute -bottom-1 left-0 w-20 h-10 text-xxs"
        v-if="copiedUrl"
      >
        copied!
      </div>
    </div>
  </code>
</div>


</div>


          
          <div class="text-gray-700 text-sm">
            <div class="pb-2 text-xs" v-if="content?.contactNote">{{ content.contactNote }}</div>

            <span v-if="content?.contactPerson">
              {{ content.contactPerson }}{{ content?.contactOrganisation ? ', ' : '' }}
            </span>
            <span v-if="content?.contactOrganisation">
              {{ content.contactOrganisation }}
            </span>
            <div>
              <a
                v-if="content?.contactEmail"
                class="underline"
                :href="'mailto:' + content.contactEmail + ''"
              >
                {{ content.contactEmail }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-10 flex bg-priorb-secondaryLight items-center gap-2 max-w-[600px] rounded-md px-4 text-gray-700 border border-gray-300"
      v-if="expertStore.postSubmissionViewOnly"
    >
      <div class="pe-2">
        <Icon icon="mdi:lock-outline" class="text-4xl" />
      </div>
      <div class="leading-tight py-2">
        <div class="font-bold">READ-ONLY</div>
        You can review the survey and your responses, but you cannot make any changes.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import { sharedPropsJs } from '@/lib/utils';
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps(sharedPropsJs);
const expertStore = useExpertStore();
const {expertName,expertId,} = storeToRefs(expertStore);
const host = window.location.host;
expertStore.surveyGoingOn = false
const route = useRoute();
const protocol = window.location.protocol;
const surveyUrl = protocol + "//" +  host + route.path + '?id=' + expertId.value;
const proxyExpertName = expertName.value || 'Anonymous';


const copiedName = ref(false);
const copiedUrl = ref(false);
const copyNameToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  copiedName.value = true;
  setTimeout(() => {
    copiedName.value = false;
  }, 3000);
};
const copyUrlToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  copiedUrl.value = true;
  setTimeout(() => {
    copiedUrl.value = false;
  }, 3000);
};


</script>

<style scoped></style>
