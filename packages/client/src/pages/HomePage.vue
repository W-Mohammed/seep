<template>
  <div class="">
    <header class="sticky top-0 z-50 w-full">
      <div
        class="bg-white h-10 border-b border-gray-300 px-lg-8 px-2 max-w-full w-full overflow-hidden flex items-center container"
      >
        <a :href="homePage">
          <img src="/favicon.ico" alt="PRIORB logo" class="h-8" role="button" />
        </a>
        <router-link
          to="/admin"
          class="ms-auto btn btn-primary text-sm flex items-center rounded text-white px-2 py-1.5 bg-priorb-PRIMARY transition-colors duration-200 ease-in-out text-sm hover:bg-priorb-PRIMARY/80 font-semibold w-fit me-2"
        >
          <span class="text-xs"> Sign in </span>
        </router-link>
      </div>
    </header>
    <div
      class="container mx-auto px-4 my-0 flex flex-col items-start justify-start max-w-80ch pt-12 md:pt-24 pb-20"
      style="min-height: calc(100vh - 80px)"
    >
      <div class="">
        <div class="text-2xl md:text-4xl font-plex font-normal font-regular">
          The Structured Expert Elicitation Platform
        </div>
        <div
          class="text-xs font-medium text-gray-700 text-start flex items-end gap-2 mt-2"
        >
          by
          <img src="/priorb-logo.png" alt="PRIORB logo" class="h-4" />
        </div>
      </div>

      </div>
      </div>
</template>

<script setup>
import { ref } from 'vue';
import { CLIENT_HOST } from '@/api';
import FooterAdmin from '@/components/admin/FooterAdmin.vue';
const email = ref('');
const emailInvalid = ref(false);
const emailListJoined = ref(false);
const homePage = CLIENT_HOST;
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 40px);
  padding-bottom: 60px;
}
</style>
