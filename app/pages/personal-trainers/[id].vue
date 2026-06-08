<script setup lang="ts">
import { formatTrainerMeta } from '#shared/domain/profile/services/format-trainer-meta'

const { t } = useI18n()
const route = useRoute()
const id = computed(() => route.params.id as string)

const { trainer, pending, error, refresh } = useTrainerProfile(id)

const meta = computed(() =>
  trainer.value ? formatTrainerMeta(trainer.value) : null,
)

useSeoMeta({
  title: () => meta.value?.title ?? t('seo.profileFallbackTitle'),
  description: () => meta.value?.description ?? t('seo.profileFallbackDescription'),
})
</script>

<template>
  <div
    class="-mx-4 pb-28 sm:-mx-6 lg:mx-0 lg:pb-8"
    data-testid="trainer-profile-page"
  >
    <div v-if="pending" class="space-y-6">
      <div class="h-80 animate-pulse bg-slate-100 lg:hidden" />
      <div class="hidden h-72 animate-pulse rounded-3xl bg-slate-100 lg:block" />
      <div class="space-y-3 px-5 lg:px-0">
        <div class="h-4 w-32 animate-pulse rounded bg-slate-100" />
        <div class="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div class="h-6 w-40 animate-pulse rounded bg-slate-100" />
      </div>
    </div>

    <FTErrorState
      v-else-if="error"
      code="404"
      :message="$t('profile.notFound')"
      test-id="trainer-not-found"
    >
      <UButton
        to="/personal-trainers"
        color="primary"
        class="mt-6 rounded-full px-8"
        data-testid="back-to-list"
      >
        {{ $t('profile.backToList') }}
      </UButton>
    </FTErrorState>

    <article v-else-if="trainer">
      <FTProfileHeader
        :trainer="trainer"
        @trainer-updated="refresh"
      />
      <FTHireTrainerModal :trainer="trainer" />
      <FTProfileGalleryViewerModal :trainer="trainer" />
      <FTProfileCta :trainer="trainer" />
    </article>
  </div>
</template>
