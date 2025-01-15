<template>
  <div>
    <ToastSonner position="bottom-right" />    
      <HeaderAdmin />
    <main class="flex flex-col mx-auto my-0 w-full min-h-without-header-and-footer">
      <slot />
    </main>
    <footer>
      <FooterAdmin />
    </footer>
  </div>
</template>

<script setup>
import HeaderAdmin from '@/components/admin/HeaderAdmin.vue'
import FooterAdmin from '@/components/admin/FooterAdmin.vue'
import ToastSonner from '@/components/admin/ToastSonner.vue'
</script>

<style scoped>
.min-h-without-header-and-footer {
  min-height: calc(100vh - 48px - 40px);
}
</style>
