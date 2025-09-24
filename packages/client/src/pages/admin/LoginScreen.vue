<template>
  <div class="h-full flex flex-col flex-1 md:bg-priorb-white">
      <div class="my-auto lg:my-40 mx-auto md:border px-8 pt-8 pb-4 rounded  border-gray-400 w-[500px] max-w-[100vw] bg-white ">
        <div class="mb-4">

            <div class="text-xl md:text-2xl font-plex font-normal text-nowrap font-regular">
              Sign in to your account
            </div>
        </div>
        <form class="flex flex-col max-w-md  mt-8" >
          <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-1.5">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="border rounded py-2 px-2 border-gray-300"
                autocomplete="off"
              />
            </div>
            <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-end">
              <label for="password">Password</label>
              <a class="text-priorb-500 underline hover:text-priorb-700 text-sm"

               href="#"  @click.prevent="goToForgetPassword"
            >
              Forgot password?
            </a>

            </div>
              <input
                type="password"
                id="password"
                v-model="password"
                class="border rounded py-2 px-2 border-gray-300"
                autocomplete="off"
              />
            </div>
          </div>
          <!-- error -->
          <div class="h-12 flex flex-col justify-center">
          <div
          v-if="loginError"
          class="text-red-600 font-medium  rounded text-sm"
          role="alert"
        >
        <Icon icon="bi:exclamation-triangle" class="inline-block w-4 h-4 me-2 mb-1" />
          <span class="block sm:inline">{{ loginError }}</span>
          </div>
          <div
          v-if="loginSuccess"
          class="text-priorb-500  rounded text-sm"
          role="alert"
        >
          <span class="block sm:inline">
          Success! Logging in...
          </span>
          </div>
        </div>
          <div class="flex flex-col  items-start gap-4">
          <button
            type="submit"
            @click.prevent="login"
            class="bg-priorb-PRIMARY hover:bg-priorb-700 text-white font-bold py-2 px-6 rounded"
          >
            Log in
          </button>
          <div class="flex justify-between w-full items-center mt-4">

            
            <a class="ms-auto text-priorb-500 underline hover:text-priorb-700 text-sm"

               href="mailto:contact@darkpeakanalytics.com?subject=Request Access"
            >
              Request an account
            </a>
          </div>
          </div>
        </form>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/store/adminStore'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

import { storeToRefs } from 'pinia'
import {Icon } from '@iconify/vue'
const adminStore = useAdminStore()
const email = ref('')
const password = ref('')
const { loginError, loginSuccess } = storeToRefs(adminStore)
const login = () => {
  adminStore.login(email.value, password.value)
}

const goToForgetPassword = () => {
  router.push({ name: 'ResetPasswordPage' })
}
</script>

<style scoped>
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}
</style>
