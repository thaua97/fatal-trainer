<script setup lang="ts">
const { sortKey, sortItems } = useFTSortSelect()
</script>

<template>
  <UFormField
    class="min-w-32"
  >
    <USelect
      v-model="sortKey"
      :items="sortItems"
      data-testid="trainer-sort-select"
      :ui="{ base: 'rounded-2xl' }"
    />
  </UFormField>
</template>
