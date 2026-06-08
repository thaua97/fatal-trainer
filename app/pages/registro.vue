<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
})
</script>

<template>
  <FTAuthShell variant="register">
    <FTRegisterForm />
  </FTAuthShell>
</template>
