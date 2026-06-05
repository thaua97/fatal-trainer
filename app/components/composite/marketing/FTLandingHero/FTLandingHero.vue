<script setup lang="ts">
import heroRunnerImage from "~/assets/images/landing-hero-runner.webp";
</script>

<template>
  <section
    class="relative overflow-hidden rounded-3xl lg:rounded-[2rem]"
    aria-labelledby="landing-hero-title"
    data-testid="landing-hero"
  >
    <div
      class="grid min-h-[28rem] items-stretch lg:min-h-[32rem] lg:grid-cols-[1.1fr_0.9fr]"
      style="
        background: linear-gradient(
          105deg,
          var(--ft-landing-gradient-from) 0%,
          var(--ft-landing-gradient-to) 100%
        );
      "
    >
      <div
        class="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.25em] text-white/80"
        >
          {{ $t("landing.hero.eyebrow") }}
        </p>
        <h1
          id="landing-hero-title"
          class="font-display mt-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {{ $t("landing.hero.title") }}
        </h1>
        <p
          class="mt-5 max-w-lg text-base leading-relaxed text-white/90 lg:text-lg"
        >
          {{ $t("landing.hero.subtitle") }}
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <UButton
            to="/personal-trainers"
            size="lg"
            class="rounded-full bg-white px-8 font-semibold text-violet-700 hover:bg-violet-50"
            data-testid="landing-hero-cta-primary"
          >
            {{ $t("landing.hero.ctaPrimary") }}
          </UButton>
          <UButton
            to="/registro"
            size="lg"
            variant="outline"
            class="rounded-full border-white/70 bg-white/10 px-8 font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            data-testid="landing-hero-cta-secondary"
          >
            {{ $t("landing.hero.ctaSecondary") }}
          </UButton>
        </div>
      </div>

      <div class="relative hidden min-h-[20rem] lg:block">
        <img
          :src="heroRunnerImage"
          :alt="$t('landing.hero.imageAlt')"
          class="absolute inset-0 size-full object-contain object-center"
          width="900"
          height="700"
          loading="eager"
        />
      </div>
    </div>
  </section>
</template>
