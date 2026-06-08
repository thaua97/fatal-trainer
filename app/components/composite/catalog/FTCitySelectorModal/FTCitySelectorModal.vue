<script setup lang="ts">
const { modalOpen, resolveWithAll } = useCatalogCityGate()
</script>

<template>
  <FTModal
    v-model:open="modalOpen"
    :tile="$t('cityModal.eyebrow')"
    :title="$t('cityModal.title')"
    :subtitle="$t('cityModal.subtitle')"
    test-id="city-selector-modal"
    title-id="city-modal-title"
    :dismissible="true"
  >
    <FTCitySelector
      test-id="catalog-city-modal"
      :label="$t('cityModal.label')"
      :placeholder="$t('cityModal.placeholder')"
    />

    <template #footer>
      <UButton
        variant="ghost"
        color="neutral"
        class="rounded-full text-slate-600 underline-offset-4 hover:underline"
        data-testid="city-modal-skip"
        :aria-describedby="'city-modal-title'"
        @click="resolveWithAll()"
      >
        {{ $t('cityModal.skipAll') }}
      </UButton>
    </template>
  </FTModal>
</template>
