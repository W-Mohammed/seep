<template>
  <div class="container px-3 h-full flex flex-1">
    <div class="py-10 flex mx-auto md:me-auto px-20">
      <div class="max-w-md my-auto min-w-[200px]">
        <div class="w-[416px] pe-8">
        <div class="mb-4">
          <div class="flex justify-start items-end me-auto flex-wrap w-[416px] gap-2 font-semibold text-3xl text-gray-800">
            <div>
              Change your password
            </div>
            <div class="text-sm font-light text-gray-600 text-start mt-2">
              Please update your password to continue using the platform.
            </div>
          </div>
          <div class="text-xs font-normal text-gray-600 text-start">
          </div>
          <div></div>
        </div>
        <form class="flex flex-col max-w-md gap-6 mb-6">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                v-model="newPassword"
                class="border rounded-md py-1 px-2 border-gray-200"
                autocomplete="off"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label  for="confirm-password">Repeat Password</label>
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                class="border rounded-md py-1 px-2 border-gray-200"
                autocomplete="off"
              />
            </div>
          </div>
          <button
            type="submit"
            @click.prevent="changePassword"
            class="bg-priorb-PRIMARY hover:bg-priorb-700 text-white  py-2 px-4 rounded me-auto mt-4 w-[188px] h-12 rounded-md py-4 px-6 gap-2"
          >
            Change Password
          </button>
        </form>
        </div>
        <div class="h-8 w-[416px]">
        <div
          v-if="changePasswordError"
          class="bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded-md relative mt-1 mb-2 max-w-md mx-auto"
          role="alert"
        >
          <strong class="font-bold">Error: </strong>
          <span class="block sm:inline">{{ changePasswordError }}</span>
        </div>


        <div
          v-if="changePasswordSuccess"
          class="bg-green-50 border border-green-400 text-green-700 px-2 py-2 rounded relative mt-1 mb-2"
        >
          <strong class="font-bold">Success: </strong>
          <span class="block sm:inline">{{ changePasswordSuccess }}</span>
        </div>
      </div>
        <div>
            <div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminStore } from '@/store/adminStore'
const adminStore = useAdminStore()
import { storeToRefs } from 'pinia'
const { username } = storeToRefs(adminStore)
const newPassword = ref('')
const confirmPassword = ref('')
const changePasswordError = ref('')
const changePasswordSuccess = ref('')

watch([newPassword, confirmPassword], () => {
  changePasswordError.value = ''
})

const changePassword = async () => {
  try {
    if (newPassword.value !== confirmPassword.value) {
      changePasswordError.value = "Passwords do not match"
      return
    }
    if(newPassword.value.length < 1 || newPassword.value.trim() === "") {
      changePasswordError.value = "Please enter a new password"
      return
    }
    const { error } = await adminStore.updatePasswordFirstTime(newPassword.value)
    if (error) {
      changePasswordError.value = typeof(error) === 'string' ? error : 'Something went wrong. Please try again or contact support.'
    } else {
      changePasswordSuccess.value = "Password updated"
      await adminStore.login(username.value, newPassword.value)
    }
  } catch (error) {
    changePasswordError.value = 'Something went wrong. Please try again or contact support.'
    changePasswordSuccess.value = ''  
  }
}
</script>

<style scoped>
</style>
