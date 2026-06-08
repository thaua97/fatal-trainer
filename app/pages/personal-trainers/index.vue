<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.catalogTitle"),
  description: () => t("seo.catalogDescription"),
});

const filtersOpen = ref(false);
const { clearFilters } = useFTFilterPanel();
const { count: activeFilterCount } = useFTActiveFilterCount();
const { sectionTitle, shouldShow: showFeaturedCarousel } = useFTFeaturedTrainersCarousel();
</script>

<template>
  <div class="space-y-6 lg:space-y-8">
    <section
      v-if="showFeaturedCarousel"
      :aria-label="sectionTitle"
    >
      <FTFeaturedTrainersCarousel />
    </section>

    <FTCitySelectorModal />

    <div
      id="catalog"
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
