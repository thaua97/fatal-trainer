<script setup lang="ts">
const { chips, dismissChip } = useFTActiveFilterChips()
</script>

<template>
  <div
    v-if="chips.length > 0"
    class="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible"
    data-testid="active-filter-chips"
  >
    <FTActiveFilterChip
      v-for="chip in chips"
      :key="chip.key"
      :label="chip.label"
      @dismiss="dismissChip(chip)"
    />
  </div>
</template>
