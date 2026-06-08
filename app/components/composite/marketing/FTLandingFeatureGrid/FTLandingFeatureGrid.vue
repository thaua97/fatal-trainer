<script setup lang="ts">
const { t } = useI18n()

const features = computed(() => [
  {
    key: 'verified',
    icon: 'i-lucide-shield-check',
    cta: 'landing.features.verified.cta',
    ctaIcon: 'i-lucide-plus',
    to: '/denuncia',
    variant: 'accent' as const,
  },
  {
    key: 'modalities',
    icon: 'i-lucide-dumbbell',
    cta: 'landing.features.modalities.cta',
    ctaIcon: 'i-lucide-plus',
    to: '/personal-trainers',
    variant: 'accent' as const,
  },
  {
    key: 'offer',
    icon: 'i-lucide-users',
    cta: 'landing.features.offer.cta',
    ctaIcon: 'i-lucide-arrow-up-right',
    to: '/personal-trainers',
    variant: 'card' as const,
  },
])
</script>

<template>
  <section
    class="mt-10 grid gap-6 lg:mt-16 lg:grid-cols-3"
    aria-label="Destaques do Fatal Trainer"
    data-testid="landing-features"
  >
    <article
      v-for="feature in features"
      :key="feature.key"
      class="flex flex-col rounded-3xl p-6 lg:p-8"
      :class="feature.variant === 'card'
        ? 'bg-linear-to-b from-violet-700 to-violet-900 text-white ring-1 ring-violet-600/30'
        : 'bg-(--ft-landing-surface) text-slate-900 ring-1 ring-violet-100'"
      :data-testid="`landing-feature-${feature.key}`"
    >
      <div
        class="mb-5 inline-flex size-11 items-center justify-center rounded-2xl"
        :class="feature.variant === 'card' ? 'bg-white/15' : 'bg-violet-100'"
      >
        <UIcon
          :name="feature.icon"
          class="size-5"
          :class="feature.variant === 'card' ? 'text-white' : 'text-violet-600'"
        />
      </div>

      <h2
        class="font-display text-lg font-bold uppercase tracking-wide lg:text-xl"
        :class="feature.variant === 'card' ? 'text-white' : 'text-slate-900'"
      >
        {{ t(`landing.features.${feature.key}.title`) }}
      </h2>
      <p
        class="mt-3 flex-1 text-sm leading-relaxed"
        :class="feature.variant === 'card' ? 'text-violet-100' : 'text-slate-600'"
      >
        {{ t(`landing.features.${feature.key}.description`) }}
      </p>

      <UButton
        v-if="feature.cta && feature.variant === 'accent'"
        :to="feature.to"
        size="md"
        block
        class="mt-6 rounded-full bg-white px-6 font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50 sm:w-auto! sm:justify-start"
      >
        {{ t(feature.cta) }}
        <UIcon :name="feature.ctaIcon!" class="size-4" />
      </UButton>

      <UButton
        v-else-if="feature.cta"
        :to="feature.to"
        variant="outline"
        size="md"
        block
        class="mt-6 rounded-full border-white/40 bg-white/10 px-6 font-semibold text-white hover:bg-white/15 sm:w-auto! sm:justify-start"
      >
        {{ t(feature.cta) }}
        <UIcon :name="feature.ctaIcon!" class="size-4" />
      </UButton>
    </article>
  </section>
</template>
