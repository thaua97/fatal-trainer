<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.catalogTitle"),
  description: () => t("seo.catalogDescription"),
});

const filtersOpen = ref(false);
const { clearFilters } = useFTFilterPanel();
const { count: activeFilterCount } = useFTActiveFilterCount();
</script>

<template>
  <div class="space-y-6 lg:space-y-8">
    <section :aria-label="$t('catalog.featuredAriaLabel')">
      <FTFeaturedTrainersCarousel />
    </section>

    <header
      id="catalog"
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
          {{ $t("catalog.country") }}
        </p>
        <h1
          class="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl"
        >
          {{ $t("catalog.exploreTitle") }}
        </h1>
      </div>
    </header>

    <div
      class="grid gap-6 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:gap-8"
    >
      <FTFilterPanel mode="sidebar" show-clear />

      <div class="min-w-0 space-y-4 lg:space-y-5">
        <FTCatalogToolbar />
        <FTTrainerList />
      </div>
    </div>

    <div class="lg:hidden">
      <FTFilterFab :badge-count="activeFilterCount" @click="filtersOpen = true" />

      <UDrawer
        v-model:open="filtersOpen"
        direction="bottom"
        :title="$t('catalog.filters')"
      >
      <template #body>
        <FTFilterPanel mode="inline" :show-search="false" />
      </template>
      <template #footer>
        <div class="grid grid-cols-2 gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            block
            class="rounded-full"
            data-testid="drawer-clear-filters"
            @click="clearFilters"
          >
            {{ $t("catalog.clearFilters") }}
          </UButton>
          <UButton
            color="primary"
            block
            class="rounded-full"
            @click="filtersOpen = false"
          >
            {{ $t("catalog.applyFilters") }}
          </UButton>
        </div>
      </template>
      </UDrawer>
    </div>
  </div>
</template>
