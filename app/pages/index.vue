<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.homeTitle'),
  description: () => t('seo.homeDescription'),
})

const filtersOpen = ref(false)
</script>

<template>
  <div class="space-y-6">
    <section aria-label="Personais em destaque">
      <FTFeaturedTrainersCarousel />
    </section>
    <div
      id="catalog"
      class="relative flex items-center justify-center lg:justify-between"
    >
      <div class="text-center lg:text-left">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          {{ $t('catalog.exploreTitle') }}
        </h1>
        <p class="mt-0.5 text-sm text-slate-400">
          {{ $t('catalog.country') }}
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <FTFilterPanel mode="sidebar" />

      <div class="min-w-0 space-y-4">
        <FTCatalogToolbar />

        <div class="lg:hidden">
          <FTFilterPanel
            mode="inline"
            :show-search="false"
            :show-sort="false"
          />
        </div>

        <FTTrainerList />
      </div>
    </div>

    <FTFilterFab @click="filtersOpen = true" />

    <UDrawer
      v-model:open="filtersOpen"
      direction="bottom"
      :title="$t('catalog.filters')"
    >
      <template #body>
        <FTFilterPanel
          mode="inline"
          :show-search="false"
        />
      </template>
      <template #footer>
        <UButton
          color="primary"
          block
          class="rounded-full"
          @click="filtersOpen = false"
        >
          {{ $t('catalog.applyFilters') }}
        </UButton>
      </template>
    </UDrawer>
  </div>
</template>
