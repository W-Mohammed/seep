<template>
  <header
    class="top-0 left-0 right-0 h-12 border-b-2 border-priorb-100 z-50 overflow-x-hidden"
    style="overflow: visible"
  >
    <div
      class="flex items-center h-full my-0 mx-auto justify-between container 2xl:max-w-[4000px] xl:px-10"
    >
      <div class="flex items-center" @click="goToAdminHomepage()" role="button">
        <img
          src="/priorb-logo.png"
          alt="PRIORB logo"
          class="h-4 cursor-pointer hidden md:block cursor-pointer"
        />
        <img
          src="/favicon.ico"
          alt="PRIORB logo small"
          class="h-8 pb-1 cursor-pointer block md:hidden cursor-pointer"
        />
      </div>

      <!-- AddSurveyPage Controls -->
      <div v-if="draftingSurvey" class="flex me-auto ms-8">
        <div
          v-if="draftSavingError"
          class="text-gray-500 flex items-center gap-1"
        >
          <span class="whitespace-nowrap text-xs"> Network problem </span>
          <Icon icon="bi:cloud-slash" class="text-xl" />
        </div>
        <div
          v-else-if="isSavingDraft || isPretendingToSaveDraft"
          class="text-gray-700 text-sm flex items-center gap-1"
        >
          <Icon icon="bi:arrow-clockwise" class="text-lg animate-spin" />
          <span class="whitespace-nowrap text-xs">Saving</span>
        </div>

        <!-- Saved state -->
        <div
          v-else
          class="text-sm flex items-center gap-1 text-gray-700 whitespace-nowrap"
        >
          <Icon icon="bi:cloud-check" class="text-xl" />
          <span class="text-xs md:hidden temporary"> Saved </span>
          <span class="text-xs hidden md:inline lg:hidden temporary">
            Changes saved
          </span>
          <span class="text-xs hidden lg:inline temporary">
            Changes saved automatically
          </span>
        </div>
      </div>

      <!-- anonymisation toggle -->
      <div
        v-if="isLoggedIn && !draftingSurvey && route.name !== 'ProfilePage'"
        class="me-6 flex text-sm ms-auto text-gray-700"
      >
        <AnonymisationSwitch />
      </div>

      <div>
        <div v-if="isLoggedIn" class="flex items-center ms-2">
          <div v-if="route.name === 'ProfilePage'">
            <button @click="logout" class="text-sm text-priorb-primary">
              Log out
            </button>
          </div>
          <div v-else>
            <Menu as="div" class="relative inline-block text-left">
              <div class="ps-2 lg:ps-4 pe-2 xl:pe-4">
                <MenuButton class="hover:opacity-90 items-center w-full py-2">
                  <div class="text-gray-900 text-sm hidden md:inline">
                    {{firstNameShort}}
                  </div>
                  <Icon
                    icon="bi:chevron-down"
                    class="hidden md:inline text-black-primary text-md ms-1"
                  />
                  <Icon
                    icon="bi:person-circle"
                    class="text-priorb-primary text-2xl ms-2"
                  />
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
                  class="absolute z-10 mt-2 border border-gray-500 origin-top-right rounded bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none right-1 w-40"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }" @click="goToProfilePage()">
                      <span
                        class="hover:bg-gray-100 hover:text-gray-900
                            text-gray-700 block px-4 py-1 text-sm cursor-pointer"
                      >
                        Profile
                      </span>
                    </MenuItem>
                    <MenuItem v-slot="{ active }" @click="logout()">
                      <span
                        class="hover:bg-gray-100 hover:text-gray-900
                            text-gray-700 block px-4 py-1 text-sm cursor-pointer"
                      >
                        Log out
                      </span>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAdminStore } from '@/store/adminStore';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import AnonymisationSwitch from '@/components/admin/AnonymisationSwitch.vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useRouter, useRoute } from 'vue-router';
const adminStore = useAdminStore();
const {
  isLoggedIn,
  draftingSurvey,
  isSavingDraft,
  isPretendingToSaveDraft,
  draftSavingError,
  username,
  name,
} = storeToRefs(adminStore);

const firstNameShort = computed(() => {
  let name
  if(!adminStore.name){
    name = adminStore.name.split(' ')[0];
  } else {
    name = adminStore.username;
  }
  return name.length > 17 ? name.slice(0, 15) + '...' : name;
});

const logout = () => {
  adminStore.logout();
};
const router = useRouter();
const goToAdminHomepage = () => {
  router.push({ name: 'SurveyOverview' });
};

const goToProfilePage = () => {
  router.push({ name: 'ProfilePage' });
};

const route = useRoute();
</script>

<style scoped>
.temporary {
  animation: fadeOut 0.25s;
  animation-fill-mode: forwards;
  animation-delay: 5s;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
