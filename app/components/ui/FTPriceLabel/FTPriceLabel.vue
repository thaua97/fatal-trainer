<script setup lang="ts">
const props = withDefaults(defineProps<{
  price: number
  size?: 'md' | 'lg'
}>(), {
  size: 'md',
})

const { locale } = useI18n()

const formatted = computed(() => formatPrice(props.price, locale.value))
</script>

<template>
  <p class="inline-flex items-baseline gap-1.5">
    <span
      class="font-bold text-violet-600"
      :class="size === 'lg' ? 'text-2xl' : 'text-base'"
    >
      {{ formatted }}
    </span>
    <span class="text-xs text-slate-400">
      {{ $t('profile.perSession') }}
    </span>
  </p>
</template>
