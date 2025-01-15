<template>
  <div class="flex flex-col pb-20">
    <ToastSonner position="bottom-right" /> 
    <HeaderSurvey />
    <JumpToAgendaItem />
    <main
      class="flex flex-col flex-grow mx-auto my-0 max-w-[1140px] w-full min-h-[50vh] pt-20"
      :class="{ 'pointer-events-none': expertStore.postSubmissionViewOnly }"
    >
      <slot />
    </main>
    <div class="w-full flex pt-4">
    <AddComment />
    </div>
    <footer class="container max-w-[90ch] flex flex-col justify-end">
      <NavButtons />
    </footer>
  </div>
</template>

<script setup>
import HeaderSurvey from '@/components/survey/HeaderSurvey.vue';
import NavButtons from '@/components/survey/NavButtons.vue';
import JumpToAgendaItem from './JumpToAgendaItem.vue';
import AddComment from '@/components/survey/AddComment.vue';
import ToastSonner from '@/components/admin/ToastSonner.vue'
import { useExpertStore } from '@/store/expertStore';
const expertStore = useExpertStore();
</script>

<style scoped></style>
