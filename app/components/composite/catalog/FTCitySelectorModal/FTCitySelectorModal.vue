<script setup lang="ts">
const { modalOpen, resolveWithAll } = useCatalogCityGate()

const modalUi = {
  content: [
    'w-[calc(100vw-2rem)] max-w-lg overflow-hidden p-0',
    'rounded-3xl border-0 bg-transparent shadow-none ring-0 divide-y-0',
  ].join(' '),
  close: 'z-20 top-4 end-4 bg-white/80 backdrop-blur-sm hover:bg-white',
}
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    :dismissible="true"
    :ui="modalUi"
  >
    <template #content>
      <div
        class="city-modal-card relative overflow-hidden rounded-3xl"
        data-testid="city-selector-modal"
      >
        <FTGradientBubbles scope="contained" />
        <FTGradientOrbs variant="card" />

        <div class="relative px-8 py-10 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            {{ $t('cityModal.eyebrow') }}
          </p>
          <h2
            id="city-modal-title"
            class="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-900"
          >
            {{ $t('cityModal.title') }}
          </h2>
          <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            {{ $t('cityModal.subtitle') }}
          </p>

          <div class="mx-auto mt-6 max-w-md text-left">
            <FTCitySelector
              test-id="catalog-city-modal"
              :label="$t('cityModal.label')"
              :placeholder="$t('cityModal.placeholder')"
            />
          </div>

          <UButton
            variant="ghost"
            color="neutral"
            class="mt-6 rounded-full text-slate-600 underline-offset-4 hover:underline"
            data-testid="city-modal-skip"
            :aria-describedby="'city-modal-title'"
            @click="resolveWithAll()"
          >
            {{ $t('cityModal.skipAll') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.city-modal-card {
  border: 1px solid rgba(167, 139, 250, 0.599);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.72) inset,
    0 0 0 1px rgb(221 214 254 / 0.55),
    0 24px 48px -20px rgb(var(--ft-primary-rgb) / 0.22),
    0 8px 20px -12px rgb(139 92 246 / 0.1);
  background-color: rgb(255 255 255 / 0.96);
  background-image:
    radial-gradient(circle at 14% 12%, rgb(221 214 254 / 0.9) 0%, transparent 46%),
    radial-gradient(circle at 88% 10%, rgb(186 230 253 / 0.82) 0%, transparent 42%),
    radial-gradient(circle at 50% 95%, rgb(251 207 232 / 0.72) 0%, transparent 48%),
    radial-gradient(circle at 78% 55%, rgb(196 181 253 / 0.68) 0%, transparent 40%),
    linear-gradient(
      165deg,
      rgb(var(--ft-primary-rgb) / 0.04) 0%,
      rgb(255 255 255 / 0.98) 45%,
      rgb(255 255 255) 100%
    );
}
</style>
