<script setup lang="ts">
withDefaults(defineProps<{
  limit?: number
}>(), {
  limit: 6,
})
</script>

<template>
  <section
    class="mt-12 lg:mt-20"
    aria-labelledby="landing-trainers-title"
    data-testid="landing-trainers-section"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          {{ $t('landing.trainers.eyebrow') }}
        </p>
        <h2
          id="landing-trainers-title"
          class="font-display mt-2 text-2xl font-bold uppercase tracking-wide text-slate-900 lg:text-3xl"
        >
          {{ $t('landing.trainers.title') }}
        </h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-600 lg:text-base">
          {{ $t('landing.trainers.subtitle') }}
        </p>
      </div>

      <UButton
        to="/personal-trainers"
        color="primary"
        variant="outline"
        block
        class="shrink-0 rounded-full px-6 sm:!w-auto sm:justify-start"
        data-testid="landing-trainers-view-all"
      >
        {{ $t('landing.trainers.viewAll') }}
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </UButton>
    </div>

    <div class="mt-6 overflow-hidden rounded-3xl bg-white px-2 sm:px-4">
      <FTTrainerList
        :limit="limit"
        variant="preview"
      />
    </div>
  </section>
</template>
