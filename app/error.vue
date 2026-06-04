<script setup lang="ts">
const error = useError()
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.errorTitle'),
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24">
    <FTErrorState
      :code="error?.statusCode ?? 500"
      :message="error?.statusMessage ?? $t('error.unexpected')"
    >
      <UButton
        to="/"
        color="primary"
        class="mt-8 rounded-full px-8"
      >
        {{ $t('error.backHome') }}
      </UButton>
    </FTErrorState>
  </div>
</template>
