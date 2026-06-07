<script setup lang="ts">
definePageMeta({
  middleware: 'trainer-only',
})

const { t } = useI18n()
const { trainer, pending } = useMyTrainerProfile()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
})
</script>

<template>
  <div
    class="-mx-4 pb-28 sm:-mx-6 lg:mx-0 lg:pb-8"
    data-testid="trainer-profile-edit-page"
  >
    <div
      v-if="pending"
      class="space-y-6"
      data-testid="trainer-profile-edit-loading"
    >
      <div class="h-80 animate-pulse bg-slate-100 lg:hidden" />
      <div class="hidden h-72 animate-pulse rounded-3xl bg-slate-100 lg:block" />
      <div class="space-y-3 px-5 lg:px-0">
        <div class="h-4 w-32 animate-pulse rounded bg-slate-100" />
        <div class="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div class="h-6 w-40 animate-pulse rounded bg-slate-100" />
      </div>
    </div>

    <article v-else-if="trainer">
      <FTProfileEditHeader :trainer="trainer" />
    </article>
  </div>
</template>
