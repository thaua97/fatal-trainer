<script setup lang="ts">
const { search, total, pending } = useFTCatalogToolbar()
</script>

<template>
  <header class="w-full space-y-5">
    <section class="w-full flex items-center justify-center gap-3">  
      <FTSearchInput v-model="search" />
      <FTSortSelect />
    </section>
    <section class="w-full flex flex-col items-start gap-3">
      <FTActiveFilterChips />
      <FTResultsCounter
        :total="total"
        :loading="pending"
      />
    </section>
  </header>
</template>
