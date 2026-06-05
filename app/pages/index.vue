<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.homeTitle'),
  description: () => t('seo.homeDescription'),
})
</script>

<template>
  <div class="space-y-0 pb-10">
    <FTLandingHero />
    <FTLandingFeatureGrid />
    <FTLandingTrainersSection :limit="6" />
  </div>
</template>
