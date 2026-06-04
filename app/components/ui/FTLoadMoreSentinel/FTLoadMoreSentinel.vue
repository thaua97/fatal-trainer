<script setup lang="ts">
defineProps<{
  loading?: boolean
  hasMore?: boolean
}>()
</script>

<template>
  <div
    v-if="loading && hasMore"
    class="flex h-12 items-center justify-center gap-2 text-sm text-slate-500"
    data-testid="load-more-sentinel"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-4 animate-spin"
    />
    Carregando...
  </div>
</template>
