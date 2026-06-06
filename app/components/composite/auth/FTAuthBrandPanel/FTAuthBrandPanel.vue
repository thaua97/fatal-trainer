<script setup lang="ts">
import heroRunnerImage from '~/assets/images/landing-hero-runner.webp'

defineProps<{
  variant: 'login' | 'register'
}>()

const { t } = useI18n()
</script>

<template>
  <aside
    class="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-6 sm:min-h-[26rem] sm:p-8 lg:min-h-full lg:rounded-[2rem] lg:p-12"
    style="background: linear-gradient(105deg, var(--ft-landing-gradient-from) 0%, var(--ft-landing-gradient-to) 100%)"
    data-testid="auth-brand-panel"
  >
    <div
      class="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-8 -left-8 size-40 rounded-full bg-violet-300/20 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative z-10">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
        {{ t('auth.brand.eyebrow') }}
      </p>
      <h2 class="font-display mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:mt-4 lg:text-4xl">
        {{ variant === 'login' ? t('auth.brand.loginTitle') : t('auth.brand.registerTitle') }}
      </h2>
      <p class="mt-3 max-w-md text-sm leading-relaxed text-white/90 lg:text-base">
        {{ variant === 'login' ? t('auth.brand.loginSubtitle') : t('auth.brand.registerSubtitle') }}
      </p>
    </div>

    <img
      :src="heroRunnerImage"
      :alt="t('auth.brand.imageAlt')"
      class="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[58%] w-auto max-w-[130%] -translate-x-1/2 object-contain object-bottom sm:h-[62%] lg:h-[78%] lg:max-w-none"
      width="900"
      height="700"
      loading="lazy"
    />
  </aside>
</template>
