<script setup lang="ts">
const { t } = useI18n()
const { shouldShow, showFab, minimize, expand } = useFTProfileCompletionPrompt()
</script>

<template>
  <div>
    <Transition name="ft-prompt-panel">
      <div
        v-if="shouldShow"
        class="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:inset-x-auto lg:bottom-6 lg:inset-e-6 lg:max-w-md lg:px-0 lg:pb-0"
        data-testid="profile-completion-prompt"
      >
        <div class="ft-profile-prompt-card ft-profile-prompt-pulse relative overflow-hidden rounded-3xl">
          <FTGradientBubbles scope="contained" />
          <FTGradientOrbs variant="card" />

          <div class="relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 lg:gap-6 lg:px-8 lg:py-9">
            <FTIconButton
              size="sm"
              variant="neutral"
              class="absolute inset-e-3 top-3 bg-white/80 backdrop-blur-sm hover:bg-white"
              :aria-label="t('profileCompletionPrompt.minimize')"
              data-testid="profile-completion-prompt-minimize"
              @click="minimize"
            >
              <UIcon
                name="i-lucide-chevron-down"
                class="size-4"
              />
            </FTIconButton>

            <div class="pe-8">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                {{ t('profileCompletionPrompt.tile') }}
              </p>
              <h2 class="mt-2 font-display text-xl font-extrabold tracking-tight text-slate-900 lg:mt-3 lg:text-2xl">
                {{ t('profileCompletionPrompt.title') }}
              </h2>
              <p class="mt-2 text-sm leading-relaxed text-slate-500 lg:mt-3 lg:text-base">
                {{ t('profileCompletionPrompt.message') }}
              </p>
            </div>

            <UButton
              to="/painel/perfil"
              color="primary"
              size="lg"
              class="w-full justify-center rounded-full font-bold lg:min-h-14 lg:py-4 lg:text-lg"
              data-testid="profile-completion-prompt-cta"
            >
              {{ t('profileCompletionPrompt.cta') }}
            </UButton>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="ft-prompt-fab">
      <button
        v-if="showFab"
        type="button"
        class="ft-profile-prompt-fab ft-profile-prompt-pulse fixed bottom-6 end-6 z-40 inline-flex size-14 items-center justify-center rounded-full"
        :aria-label="t('profileCompletionPrompt.expand')"
        data-testid="profile-completion-prompt-fab"
        @click="expand"
      >
        <UIcon
          name="i-lucide-user-round-pen"
          class="size-6"
        />
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.ft-profile-prompt-card {
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

.ft-profile-prompt-pulse {
  animation: ft-pulse-purple-shadow 2.4s ease-in-out infinite;
}

.ft-profile-prompt-fab {
  background: var(--ft-primary);
  color: var(--ft-primary-foreground);
  transition: background-color 0.15s ease;
}

.ft-profile-prompt-fab:hover {
  background: var(--ft-primary-hover);
}

@keyframes ft-pulse-purple-shadow {
  0%,
  100% {
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.72) inset,
      0 0 0 1px rgb(221 214 254 / 0.55),
      0 8px 24px -8px rgb(var(--ft-primary-rgb) / 0.35),
      0 0 32px -4px rgb(var(--ft-primary-rgb) / 0.25);
  }

  50% {
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.72) inset,
      0 0 0 1px rgb(221 214 254 / 0.55),
      0 12px 36px -6px rgb(var(--ft-primary-rgb) / 0.55),
      0 0 48px 0 rgb(var(--ft-primary-rgb) / 0.45);
  }
}

.ft-profile-prompt-fab.ft-profile-prompt-pulse {
  animation: ft-pulse-purple-shadow-fab 2.4s ease-in-out infinite;
}

@keyframes ft-pulse-purple-shadow-fab {
  0%,
  100% {
    box-shadow: 0 4px 16px rgb(var(--ft-primary-rgb) / 0.35);
  }

  50% {
    box-shadow: 0 6px 28px rgb(var(--ft-primary-rgb) / 0.6);
  }
}

.ft-prompt-panel-enter-active,
.ft-prompt-panel-leave-active,
.ft-prompt-fab-enter-active,
.ft-prompt-fab-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.ft-prompt-panel-enter-from,
.ft-prompt-panel-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.ft-prompt-fab-enter-from,
.ft-prompt-fab-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
