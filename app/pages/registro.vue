<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
})
</script>

<template>
  <div class="mx-auto max-w-2xl py-8">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
      {{ t('title') }}
    </h1>
    <p class="mt-3 text-slate-500">
      {{ t('placeholder') }}
    </p>
  </div>
</template>
