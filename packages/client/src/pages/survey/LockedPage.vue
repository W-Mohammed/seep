<template>
  <div class="flex flex-col items-center justify-center min-h-[40vh] pb-20">
    <div class="md:w-2/3 max-w-[60ch] text-center border px-8 py-6 rounded-lg border-gray-400">
      <div>
        <div v-if="content?.title" class="text-xl font-semibold pb-4">
          {{ content?.title }}
        </div>
      </div>
      <div>
        <div class="flex flex-col gap-4">
          <p v-if="content?.body">{{ content.body }}</p>
          <p v-if="content?.subtitle">{{ content.subtitle }}</p>
          <div class="text-gray-700 text-sm">
            <div class="pb-2 text-xs" v-if="content?.contactNote">{{ content.contactNote }}</div>

            <span v-if="content?.contactPerson">
              {{ content.contactPerson }}{{ content?.contactOrganisation ? ', ' : '' }}
            </span>
            <span v-if="content?.contactOrganisation">
              {{ content.contactOrganisation }}
            </span>
            <div>
              <a
                v-if="content?.contactEmail"
                class="underline"
                :href="'mailto:' + content.contactEmail + ''"
              >
                {{ content.contactEmail }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-10 flex bg-priorb-secondaryLight items-center gap-2 max-w-[600px] rounded-md px-4 text-gray-700 border border-gray-300"
      v-if="expertStore.postSubmissionViewOnly"
    >
      <div class="pe-2">
        <Icon icon="mdi:lock-outline" class="text-4xl" />
      </div>
      <div class="leading-tight py-2">
        <div class="font-bold">READ-ONLY</div>
        You can review the survey and your responses, but you cannot make any changes.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useExpertStore } from '@/store/expertStore'
import { Icon } from '@iconify/vue'
import { sharedPropsJs } from '@/lib/utils';
const props = defineProps(sharedPropsJs)
const expertStore = useExpertStore()
expertStore.surveyGoingOn = false
</script>

<style scoped></style>
