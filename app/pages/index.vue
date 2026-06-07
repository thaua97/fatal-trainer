<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const { userName, consumeWelcome } = useAuth()

useSeoMeta({
  title: () => t('seo.homeTitle'),
  description: () => t('seo.homeDescription'),
})

onMounted(() => {
  if (route.query.welcome !== '1') {
    return
  }

  if (consumeWelcome() && userName.value) {
    toast.add({
      title: t('auth.header.welcome', { name: userName.value }),
      color: 'success',
      icon: 'i-lucide-circle-check',
    })
  }

  navigateTo('/', { replace: true })
})
</script>

<template>
  <div class="space-y-0 pb-10">
    <FTLandingHero />
    <FTLandingFeatureGrid />
    <FTLandingTrainersSection :limit="6" />
  </div>
</template>
