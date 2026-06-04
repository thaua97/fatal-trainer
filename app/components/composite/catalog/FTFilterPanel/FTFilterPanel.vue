<script setup lang="ts">
withDefaults(defineProps<{
  mode?: 'sidebar' | 'inline'
  showSearch?: boolean
  showSort?: boolean
}>(), {
  mode: 'sidebar',
  showSearch: true,
  showSort: true,
})

const { search } = useFTFilterPanel()
const { sortKey, sortItems } = useFTSortSelect()
</script>

<template>
  <aside
    v-if="mode === 'sidebar'"
    class="hidden flex-col gap-4 lg:sticky lg:top-20 lg:flex lg:self-start"
    data-testid="trainer-filters-sidebar"
  >
    <FTSectionHeading spacing="sm">
      {{ $t('catalog.filters') }}
    </FTSectionHeading>
    <div class="flex flex-col gap-4">
      <FTSearchInput
        v-if="showSearch"
        v-model="search"
      />
      <UFormField
        v-if="showSort"
        :label="$t('catalog.sortBy')"
      >
        <USelect
          v-model="sortKey"
          :items="sortItems"
          data-testid="trainer-sort"
          :ui="{ base: 'rounded-2xl' }"
        />
      </UFormField>
    </div>
  </aside>

  <div
    v-else
    class="flex flex-col gap-4"
    data-testid="trainer-filters"
  >
    <FTSearchInput
      v-if="showSearch"
      v-model="search"
    />
    <UFormField
      v-if="showSort"
      :label="$t('catalog.sortBy')"
    >
      <USelect
        v-model="sortKey"
        :items="sortItems"
        data-testid="trainer-sort"
        :ui="{ base: 'rounded-2xl' }"
      />
    </UFormField>
  </div>
</template>
