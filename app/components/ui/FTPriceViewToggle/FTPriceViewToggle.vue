<script setup lang="ts">
const { options, isSelected, select } = useFTPriceViewFilter()
</script>

<template>
  <div
    class="inline-flex flex-wrap gap-1.5"
    role="group"
    :aria-label="$t('catalog.priceViewTitle')"
    data-testid="price-view-toggle"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
      :class="isSelected(option.value)
        ? 'border-violet-600 bg-violet-600 text-white'
        : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'"
      :aria-pressed="isSelected(option.value)"
      :data-testid="`price-view-filter-${option.value}`"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
