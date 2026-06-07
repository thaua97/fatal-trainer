<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.favoritesTitle'),
  description: () => t('seo.favoritesDescription'),
})

const { favoriteIds } = useTrainerBookmakers()
</script>

<template>
  <div class="space-y-6 lg:space-y-8">
    <header
      class="relative overflow-hidden rounded-3xl border border-violet-100/60 bg-gradient-to-br from-[var(--ft-landing-surface)]/70 via-white to-white px-6 py-7 lg:px-10 lg:py-9"
    >
      <div
        class="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-violet-200/20 blur-3xl"
        aria-hidden="true"
      />
      <div class="relative text-center lg:text-left">
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600/80 lg:text-sm"
        >
          {{ $t('favorites.eyebrow') }}
        </p>
        <h1
          class="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl"
        >
          {{ $t('favorites.title') }}
        </h1>
        <p class="mt-3 text-sm text-slate-500 lg:text-base">
          {{ $t('favorites.subtitle') }}
        </p>
        <p
          v-if="favoriteIds.length > 0"
          class="mt-2 text-sm font-medium text-violet-600"
          data-testid="favorites-count"
        >
          {{ $t('favorites.count', { count: favoriteIds.length }) }}
        </p>
      </div>
    </header>

    <FTTrainerList variant="favorites" />
  </div>
</template>
