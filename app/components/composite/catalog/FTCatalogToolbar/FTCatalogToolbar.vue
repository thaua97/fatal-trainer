<script setup lang="ts">
const { search, total, pending } = useFTCatalogToolbar()
</script>

<template>
  <header class="w-full space-y-4 lg:space-y-0">
    <section
      class="flex w-full items-center justify-center gap-3 lg:hidden"
    >
      <FTSearchInput v-model="search" />
      <FTSortSelect />
    </section>

    <section
      class="flex w-full flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4"
    >
      <FTActiveFilterChips class="min-w-0 flex-1" />
      <div class="flex shrink-0 items-center gap-3">
        <FTResultsCounter
          class="lg:text-base"
          :total="total"
          :loading="pending"
        />
        <FTPriceViewToggle />
      </div>
    </section>
  </header>
</template>
