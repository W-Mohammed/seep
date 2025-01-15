<template>
  <div>
    <LayoutTemplate v-if="adminStoreInitialised">
      <router-view></router-view>
    </LayoutTemplate>
    <OverlaySpinner />
    <div id="modals" class="relative z-20"></div>
  </div>
</template>

<script setup>
import LayoutTemplate from '@/components/admin/LayoutTemplate.vue'
import { useAdminStore } from '@/store/adminStore'
import { ref } from 'vue'
import OverlaySpinner from '@/components/admin/OverlaySpinner.vue'
const adminStoreInitialised = ref(false)
const adminStore = useAdminStore()
setTimeout(async () => {
  // avoid getSurveys calls before tenantId is set
  await adminStore.initialiseAdminStore()
  adminStoreInitialised.value = true
})
</script>

<style scoped></style>
