<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  testId: string
  disabled?: boolean
}>(), {
  disabled: false,
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center justify-center rounded-full border border-[rgb(var(--ft-primary-rgb)/0.14)] bg-(--ft-primary-subtle) px-6 py-3.5 text-base font-semibold text-(--ft-primary) transition-colors duration-200 hover:border-(--ft-primary) hover:bg-(--ft-primary) hover:text-(--ft-primary-foreground) active:bg-(--ft-primary-hover) disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[rgb(var(--ft-primary-rgb)/0.14)] disabled:hover:bg-(--ft-primary-subtle) disabled:hover:text-(--ft-primary)"
    :data-testid="testId"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>
