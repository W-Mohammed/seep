<template>
  <LayoutTemplate>
    <router-view
      v-slot="{ Component, route }"
      :viewId="currentPage?.viewId"
      :content="currentPage?.content ?? {}"
      :options="currentPage?.options ?? {}"
      :pageId="currentPage?.pageId"
      :questionId="currentPage?._id"
      :isQuestion="currentPage?.isQuestion ?? false"
    >
      <transition :name="'fade'" mode="out-in">
        <component :is="Component" :key="currentPage._id + route" />
      </transition>
    </router-view>
  </LayoutTemplate>
</template>

<script setup>
import LayoutTemplate from '@/components/survey/LayoutTemplate.vue';
import { useExpertStore } from '@/store/expertStore';
import { storeToRefs } from 'pinia';
import { ref, watch, onBeforeUnmount } from 'vue';
import { surveyRoutes } from '@/router';

const autoSaveFunc = () => {
  if (surveyGoingOn.value) expertStore.postExpertResponse();
};

const autoSaveRef = ref(null);
const expertStore = useExpertStore();
expertStore.initialiseStore();

const { currentPage, surveyGoingOn, currentPageIndex, agendaItems } =
  storeToRefs(expertStore);

autoSaveRef.value = setInterval(autoSaveFunc, 5000);
onBeforeUnmount(async () => {
  await expertStore.postExpertResponse();
  if (autoSaveRef.value) clearInterval(autoSaveRef.value);
  
});

const loadNextComponent = (nextComponentName, loadedComponents) => {
  if (!nextComponentName) return;
  if (loadedComponents.includes(nextComponentName)) return; 
  const nextComponent = surveyRoutes.find(
    (route) => route.name === nextComponentName
  );
  if (!nextComponent) return console.error('Component not found:', nextComponentName);
  nextComponent.component();
};

const loadedComponents = [];
watch(
  currentPageIndex,
  () => {
    // on first load, agenda might not be loaded yet, so wait a bit:
    const delay = loadedComponents.length ? 0 : 1000;
    setTimeout(() => {
      const nextComponentName = expertStore.getNextPageComponent();
      loadNextComponent(nextComponentName, loadedComponents);
    }, delay);
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
