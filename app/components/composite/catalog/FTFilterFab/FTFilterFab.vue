<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    :class="[$style.fab, 'fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden']"
    data-testid="filter-fab"
    @click="$emit('click')"
  >
    <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
    {{ $t('catalog.filters') }}
  </button>
</template>

<style module>
.fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background: var(--ft-primary);
  padding: 0.875rem 1.75rem;
  font-weight: 700;
  color: var(--ft-primary-foreground);
  box-shadow: 0 4px 16px rgb(var(--ft-primary-rgb) / 0.35);
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

.fab:hover {
  background: var(--ft-primary-hover);
  box-shadow: 0 6px 20px rgb(var(--ft-primary-rgb) / 0.45);
}
</style>
