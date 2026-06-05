<script setup lang="ts">
withDefaults(defineProps<{
  mode?: 'sidebar' | 'inline'
  showSearch?: boolean
  showSort?: boolean
  showClear?: boolean
}>(), {
  mode: 'sidebar',
  showSearch: true,
  showSort: true,
  showClear: false,
})

const { search, clearFilters } = useFTFilterPanel()
const { sortKey, sortItems } = useFTSortSelect()
const { options: specialtyOptions, isSelected: isSpecialtySelected, toggle: toggleSpecialty } = useFTSpecialtyFilter()
const { options: modalityOptions, isSelected: isModalitySelected, toggle: toggleModality } = useFTModalityFilter()
const { onPromotion, label: promotionLabel } = useFTPromotionFilter()
</script>

<template>
  <aside
    v-if="mode === 'sidebar'"
    class="hidden flex-col gap-4 lg:sticky lg:top-20 lg:flex lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-slate-100 lg:bg-slate-50/50 lg:p-5 lg:shadow-sm"
    data-testid="trainer-filters-sidebar"
    aria-label="Filtros de busca"
  >
    <FTSectionHeading spacing="sm" class="flex items-center gap-2">
      <UIcon
        name="i-lucide-sliders-horizontal"
        class="size-5 text-violet-600"
        aria-hidden="true"
      />
      {{ $t('catalog.filters') }}
    </FTSectionHeading>

    <div class="flex flex-col gap-5">
      <FTSearchInput
        v-if="showSearch"
        v-model="search"
      />

      <section>
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {{ $t('catalog.specialties') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="specialty in specialtyOptions"
            :key="specialty"
            type="button"
            class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            :class="isSpecialtySelected(specialty)
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'"
            :aria-pressed="isSpecialtySelected(specialty)"
            :data-testid="`specialty-filter-${specialty}`"
            @click="toggleSpecialty(specialty)"
          >
            {{ specialty }}
          </button>
        </div>
      </section>

      <section>
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {{ $t('catalog.modality') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in modalityOptions"
            :key="option.value"
            type="button"
            class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            :class="isModalitySelected(option.value)
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'"
            :aria-pressed="isModalitySelected(option.value)"
            :data-testid="`modality-filter-${option.value}`"
            @click="toggleModality(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </section>

      <section>
        <UCheckbox
          v-model="onPromotion"
          :label="promotionLabel"
          data-testid="promotion-filter"
        />
      </section>

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

      <button
        v-if="showClear"
        type="button"
        class="self-start text-sm font-medium text-violet-600 hover:text-violet-700"
        data-testid="clear-filters"
        @click="clearFilters"
      >
        {{ $t('catalog.clearFilters') }}
      </button>
    </div>
  </aside>

  <div
    v-else
    class="flex flex-col gap-5"
    data-testid="trainer-filters"
  >
    <FTSearchInput
      v-if="showSearch"
      v-model="search"
    />

    <section>
      <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {{ $t('catalog.specialties') }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="specialty in specialtyOptions"
          :key="specialty"
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
          :class="isSpecialtySelected(specialty)
            ? 'border-violet-600 bg-violet-600 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'"
          :aria-pressed="isSpecialtySelected(specialty)"
          @click="toggleSpecialty(specialty)"
        >
          {{ specialty }}
        </button>
      </div>
    </section>

    <section>
      <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {{ $t('catalog.modality') }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in modalityOptions"
          :key="option.value"
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
          :class="isModalitySelected(option.value)
            ? 'border-violet-600 bg-violet-600 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'"
          :aria-pressed="isModalitySelected(option.value)"
          @click="toggleModality(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </section>

    <section>
      <UCheckbox
        v-model="onPromotion"
        :label="promotionLabel"
      />
    </section>

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
