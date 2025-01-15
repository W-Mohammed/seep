<template>
  <div class="min-w-[100vw] h-full">
    <div class="flex">
      <!-- Sidebar for Navigation -->
      <div class="w-1/4 max-w-sm min-w-[200px] flex flex-col items-start gap-0.5 border-r pt-4 side-bar-height relative pb-18">
        <div class="w-full overflow-y-auto h-full flex flex-col">
          <div class="flex items-center w-full px-6 font-semibold mt-4 mb-4">
            <div class="flex items-center space-x-2">
              <Icon icon="bi:person-circle" class="text-priorb-primary text-2xl" />
              <div class="text-gray-900 text-xl">Account</div>
            </div>
          </div>                    

          <!-- Sidebar Navigation Items -->
          <div class="text-sm text-gray-700 flex flex-col items-start mb-2 pb-2 ps-2 lg:ps-4 pe-2 xl:pe-4">
            <ul class="w-full list-none">
              <li class="py-2 cursor-pointer flex items-center" @click="selectSection('personalInfo')">
                <span class="hover:text-priorb-500 inline-block" :class="{'font-bold text-priorb-500': currentSection === 'personalInfo'}">Personal Info</span>
              </li>
              <li class="py-2 cursor-pointer flex items-center" @click="selectSection('password')">
                <span class="hover:text-priorb-500 inline-block" :class="{'font-bold text-priorb-500': currentSection === 'password'}">Password</span>
              </li>
              <li class="py-2 cursor-pointer flex items-center" @click="selectSection('collaborators')">
                <span class="hover:text-priorb-500 inline-block" :class="{'font-bold text-priorb-500': currentSection === 'collaborators'}">Collaborators</span>
              </li>
              <li class="py-2 cursor-pointer flex items-center" style="margin-top: 166px;" @click="selectSection('deleteAccount')">
                <span class="hover:text-red-400 inline-block" :class="{'font-bold text-red-500': currentSection === 'deleteAccount'}">Delete Account</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      <!-- Main Panel for Editing Account Info -->
      <div class="pt-10 px-6 pl-8 flex flex-col justify-start w-full container max-w-[800px] main-panel-height">
        <div v-if="currentSection === 'personalInfo'" class="flex flex-col space-y-6">
          <div class="flex flex-col space-y-4">
            <div class="text-gray-600">
              <p class="text-sm font-semibold mb-1">User name:</p>
              <p class="text-base"> {{ user.userId }} </p>
            </div>
            <div class="text-gray-600">
              <p class="text-sm font-semibold mb-1">Full name:</p>
              <p class="text-base"> {{ user.fullName }} </p>
            </div>
            <div class="text-gray-600">
              <p class="text-sm font-semibold mb-1">Organisation:</p>
              <p class="text-base"> {{ user.tenant}} </p>
            </div>
            <div class="text-gray-600">
              <p class="text-sm font-semibold mb-1">Organisation ID:</p>
              <p class="text-base"> {{ user.tenantId }} </p>
            </div>
          </div>
        </div>
                

        <!-- Password Change Section -->
        <div v-if="currentSection === 'password'" class="flex flex-col">
          <div class="max-w-md">
            <form class="flex flex-col gap-6 mb-6">
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                  <label for="new-password" class="text-sm font-semibold">Current Password</label>
                  <input
                    type="password"
                    id="new-password"
                    v-model="password.current"
                    class="border rounded-md py-1 px-2 border-gray-200"
                    autocomplete="off"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label for="new-password" class="text-sm font-semibold">New Password</label>
                  <input
                    type="password"
                    id="new-password"
                    v-model="password.new"
                    class="border rounded-md py-1 px-2 border-gray-200"
                    autocomplete="off"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label for="confirm-password" class="text-sm font-semibold">Repeat Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    v-model="password.confirm"
                    class="border rounded-md py-1 px-2 border-gray-200"
                    autocomplete="off"
                  />
                </div>
              </div>
              <button
                type="submit"
                @click.prevent="handleChangePassword"
                class="bg-priorb-PRIMARY hover:bg-priorb-700 text-white  py-2 px-4 rounded me-auto mt-4 w-[188px] rounded-md  gap-2"
              >
                Change Password
              </button>
            </form>
            <div class="h-8">
              <div
                v-if="changePasswordError"

                class="bg-priorb-100 border border-priorb-400 text-priorb-700 px-2 py-2 rounded-md relative mt-1 mb-2"

                role="alert"
              >
                <strong class="font-bold">Error: </strong>
                <span class="block sm:inline">{{ changePasswordError }}</span>
              </div>
        
              <div
                v-if="changePasswordSuccess"
                class="bg-green-50 border border-green-400 text-green-700 px-2 py-2 rounded-md relative mt-1 mb-2"
              >
                <strong class="font-bold">Success: </strong>
                <span class="block sm:inline">{{ changePasswordSuccess }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Collaborators Section -->
        <div v-if="currentSection === 'collaborators'" class="flex flex-col">
          <p class="text-xl">This page is not implemented yet.</p>
        </div>

        <!-- Delete Account Section -->
        <div v-if="currentSection === 'deleteAccount'" class="flex flex-col gap-6 max-w-md">
          <div class="flex flex-col space-y-4">
            <p class="text-sm text-gray-600">
              Deleting your account is irreversible. All your data will be permanently removed.
            </p>
          </div>
          
          <button 
            @click="confirmDeleteAccount" 
            class="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-md w-[188px] mt-4">
            Confirm Deletion
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { Icon } from '@iconify/vue'
import { useAdminStore } from '@/store/adminStore'
const adminStore = useAdminStore()
import { deleteUser } from '@/api/users'

const user = ref({
  userId: '',
  fullName: '',
  tenant: '',
  tenantId: ''
})

const getUserDetails = async () => {
  try {
    const result = await adminStore.getUserData()
    if (!result || !result.success) {
      throw result.error || 'Error fetching user details'
    } 

    if (result.userDetails) {
      user.value = {
        userId: result.userDetails.userId || '',
        fullName: result.userDetails.name || '',
        tenant: result.userDetails.tenantName || '',
        tenantId: result.userDetails.tenantId || ''
      }
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
  }
}

// Fetch user details on component mount
onBeforeMount(async () => {
  await getUserDetails()
})

const currentSection = ref('personalInfo')

const password = ref({
  current: '',
  new: '',
  confirm: ''
})

const changePasswordError = ref('')
const changePasswordSuccess = ref('')

watch([() => password.value.current, () => password.value.new, () => password.value.confirm], () => {
  changePasswordError.value = ''
})

const handleChangePassword = async () => {
  try {
    if (password.value.current.length < 1 || password.value.current.trim() === "") {
      changePasswordError.value = "Please enter your current password"
      return
    }

    if (password.value.new.length < 1 || password.value.new.trim() === "") {
      changePasswordError.value = "Please enter a new password"
      return
    }

    if (password.value.confirm.length < 1 || password.value.confirm.trim() === "") {
      changePasswordError.value = "Please enter your new password again"
      return
    }

    if (password.value.new !== password.value.confirm) {
      changePasswordError.value = "Passwords do not match"
      return
    }

    if (password.value.current === password.value.new) {
      changePasswordError.value = "New password cannot be the same as the current password"
      return
    }

    const { error } = await adminStore.updatePassword(password.value.current, password.value.new)
    if (error) {
      changePasswordError.value = typeof(error) === 'string' ? error : 'Something went wrong. Please try again or contact support.'
    } else {
      changePasswordSuccess.value = "Password updated"
      setTimeout(() => {
        selectSection('personalInfo')
      }, 1500)
    }
  } catch (error) {
    changePasswordError.value = 'Something went wrong. Please try again or contact support.'
    changePasswordSuccess.value = ''
  }
}

const selectSection = (section) => {
  currentSection.value = section
}

watch(currentSection, (newSection) => {
  if (newSection === 'password') {
    password.value.current = ''
    password.value.new = ''
    password.value.confirm = ''
    changePasswordError.value = ''
    changePasswordSuccess.value = ''
  }
})

const confirmDeleteAccount = async () => {
  const confirmed = confirm('Are you sure you want to delete your account? You may lose access to all your data. This action cannot be undone.')
  if (confirmed) {
    try {
      const { error } = await deleteUser(user.value.tenantId, user.value.userId)
      if (error) {
        console.error('Error deleting account:', error)
        alert('Error deleting account. Please try again or contact support.')
      } else {
        alert('Account deleted! You will be logged out now.')
        adminStore.logout()
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again or contact support.')
    }
  }
}
</script>

<style scoped>
/* Adjust your custom styles here */
.main-panel-height {
  max-height: calc(100vh - 48px - 42px);
}
</style>
