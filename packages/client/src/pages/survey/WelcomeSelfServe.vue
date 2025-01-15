<template>
  <div class="container">
    <div class="max-w-[65ch] mx-auto break-words text-pretty">
      <div class="mb-4">
        <div
          v-if="currentPage?.content?.title"
          class="text-3xl"
        >
          {{ currentPage.content.title }}
        </div>
      </div>
      <div v-if="currentPage?.content?.body" class="my-8">
        <div v-html="currentPage.content.body"></div>
      </div>
      <div class="flex flex-col gap-8 mt-8">



        <div class="flex flex-col">
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


        <div class="flex flex-col ">
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
    </div>
  </div>
</template>

<script setup>
import { sharedPropsJs } from '@/lib/utils';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
defineProps(sharedPropsJs);
const expertStore = useExpertStore();
const {
  expertName,
  expertId,
  studyContact,
  studyName,
  studyDescription,
  currentPage,
} = storeToRefs(expertStore);
const host = window.location.host;
const route = useRoute();
const protocol = window.location.protocol;
const surveyUrl = protocol + "//" +  host + route.path + '?id=' + expertId.value;
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

const proxyExpertName = expertName.value || 'Anonymous';
</script>

<style scoped>
p {
  margin-top: 1.2rem;
  font-size: 1.15rem;
}
</style>
