<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <UBadge
    color="primary"
    variant="subtle"
    class="gap-1 bg-violet-100 text-violet-700"
  >
    {{ label }}
    <button
      type="button"
      class="flex size-6 items-center justify-center rounded-full hover:bg-violet-200"
      :aria-label="`Remover filtro ${label}`"
      @click="$emit('dismiss')"
    >
      <UIcon name="i-lucide-x" class="size-3" />
    </button>
  </UBadge>
</template>
