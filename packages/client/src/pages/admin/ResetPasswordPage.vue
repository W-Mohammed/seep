<template>
  <div class="container px-3 h-full flex flex-1">
    <div class="py-10 flex mx-auto md:me-auto px-20">
      <div class="max-w-md my-auto min-w-[200px]">
        <div class="w-[416px] pe-8">
          <div class="mb-4">
            <div class="flex justify-start items-end me-auto flex-wrap w-[416px] gap-2 font-semibold text-3xl text-gray-800">
              <div>
                Forgot your password?
              </div>
              <div class="text-sm font-light text-gray-600 text-start mt-2">
                Enter your email address, we'll send you instructions to reset your password.
              </div>
            </div>
          </div>
          <form class="flex flex-col max-w-md gap-6 mb-6">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="border rounded-md py-1 px-2 border-gray-200"
                  autocomplete="off"
                />
              </div>
            </div>
            <button
              type="submit"
              @click.prevent="submitEmail"
              class="bg-priorb-PRIMARY hover:bg-priorb-700 text-white py-2 px-4 rounded me-auto mt-4 w-[188px] h-12 rounded-md py-4 px-6 gap-2"
            >
              Reset Password
            </button>
          </form>
        </div>
        <div class="h-8 w-[416px]">
          <div
            v-if="emailError"
            class=" bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded-md relative mt-1 mb-2 max-w-md mx-auto"
            role="alert"
          >
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ emailError }}</span>
          </div>

          <div
            v-if="emailSuccess"
            class=" bg-green-50 border border-green-400 text-green-700 px-2 py-2 rounded relative mt-1 mb-2"
          >
            <strong class="font-bold">Success: </strong>
            <span class="block sm:inline">{{ emailSuccess }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/store/adminStore'
const adminStore = useAdminStore()
import { requestPasswordReset } from '@/api/users'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

const email = ref('')
const emailError = ref('')
const emailSuccess = ref('')

const submitEmail = async () => {
  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]+$/

  try {
    if (!email.value || email.value.trim() === '') {
      emailError.value = "Please enter your email address"
      return
    }
    if (!emailPattern.test(email.value)) {
      emailError.value = "Please enter a valid email address"
      return
    }
    const { error, success } = await requestPasswordReset(email.value)
    if (error || !success) {
      throw error
    } else {
      emailSuccess.value = "Password reset instructions have been sent to your email. You will be redirected to the login page shortly."
      emailError.value = ''
      setTimeout(() => {
        router.push({ name: 'Login' })
      }, 5000)
    }
  } catch (error) {
    console.log(error)
    emailError.value = 'Something went wrong. Please try again or contact support.'
    emailSuccess.value = ''
  }
}

</script>

<style scoped>
</style>
