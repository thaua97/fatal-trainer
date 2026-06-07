<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <header
      class="relative overflow-hidden rounded-3xl border border-violet-100/60 bg-gradient-to-br from-[var(--ft-landing-surface)]/70 via-white to-white px-6 py-7 lg:px-10 lg:py-9"
    >
      <div
        class="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-violet-200/20 blur-3xl"
        aria-hidden="true"
      />
      <div class="relative">
        <p
          class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600/80 lg:text-sm"
        >
          <UIcon
            name="i-lucide-shield-alert"
            class="size-4"
            aria-hidden="true"
          />
          {{ t('eyebrow') }}
        </p>
        <h1
          class="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl"
        >
          {{ t('title') }}
        </h1>
        <p class="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 lg:text-base">
          {{ t('subtitle') }}
        </p>
      </div>
    </header>

    <section
      class="rounded-3xl border border-slate-100 bg-slate-50/30 p-5 shadow-sm sm:p-7 lg:p-8"
      aria-labelledby="report-form-heading"
    >
      <h2
        id="report-form-heading"
        class="sr-only"
      >
        {{ t('formHeading') }}
      </h2>
      <FTReportForm />
    </section>
  </div>
</template>
