<script setup lang="ts">
defineProps<{
  rating: number
}>()
</script>

<template>
  <span class="inline-flex items-center gap-0.5 text-sm font-medium text-slate-900">
    {{ rating.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
    <UIcon
      name="i-lucide-star"
      class="size-3 text-amber-400"
    />
  </span>
</template>
