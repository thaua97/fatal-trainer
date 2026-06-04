<script setup lang="ts">
defineProps<{
  code?: string | number
  message: string
  testId?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center px-6 py-12 text-center"
    :data-testid="testId"
  >
    <UIcon
      name="i-lucide-circle-alert"
      class="size-12 text-red-600"
    />
    <p
      v-if="code"
      class="mt-4 text-sm font-medium text-slate-500"
    >
      {{ $t('error.code', { code }) }}
    </p>
    <p class="mt-2 text-base font-semibold text-red-600">
      {{ message }}
    </p>
    <div class="mt-6">
      <slot />
    </div>
  </div>
</template>
