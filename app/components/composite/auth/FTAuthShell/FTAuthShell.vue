<script setup lang="ts">
defineProps<{
  variant: 'login' | 'register'
}>()

const { t } = useI18n()
const { loginRoute, registerRoute } = useAuthRedirect()
</script>

<template>
  <div
    class="flex min-h-screen flex-col lg:grid lg:grid-cols-2 lg:gap-0"
    data-testid="auth-shell"
  >
    <div class="p-4 sm:p-6 lg:p-8 lg:pr-4">
      <FTAuthBrandPanel :variant="variant" />
    </div>

    <div class="flex flex-1 flex-col justify-center px-4 pb-8 pt-2 sm:px-6 lg:px-12 lg:py-10 xl:px-16">
      <div class="auth-form-panel mx-auto w-full max-w-md">
        <div class="mb-8 flex justify-center">
          <NuxtLink
            to="/"
            class="group"
            data-testid="auth-logo-link"
          >
            <FTLogo size="lg" />
          </NuxtLink>
        </div>

        <header class="mb-8 text-center">
          <h1 class="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {{ variant === 'login' ? t('auth.login.title') : t('auth.register.title') }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 sm:text-base">
            {{ variant === 'login' ? t('auth.login.subtitle') : t('auth.register.subtitle') }}
          </p>
        </header>

        <slot />

        <p class="mt-6 text-center text-sm text-slate-500">
          <template v-if="variant === 'login'">
            {{ t('auth.login.noAccount') }}
            <NuxtLink
              :to="registerRoute"
              class="font-semibold text-violet-600 hover:text-violet-700"
              data-testid="auth-link-register"
            >
              {{ t('auth.login.createAccount') }}
            </NuxtLink>
          </template>
          <template v-else>
            {{ t('auth.register.hasAccount') }}
            <NuxtLink
              :to="loginRoute"
              class="font-semibold text-violet-600 hover:text-violet-700"
              data-testid="auth-link-login"
            >
              {{ t('auth.register.signIn') }}
            </NuxtLink>
          </template>
        </p>

        <div class="auth-social mt-8">
          <div class="relative flex items-center">
            <div class="grow border-t border-slate-200" />
            <span class="mx-4 shrink-0 text-xs text-slate-400">
              {{ t('auth.social.divider') }}
            </span>
            <div class="grow border-t border-slate-200" />
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <UButton
              variant="outline"
              color="neutral"
              block
              class="relative w-full rounded-2xl border-slate-200 bg-white py-2.5"
              disabled
              data-testid="auth-social-facebook"
            >
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
              <span class="absolute -right-1 -top-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {{ t('auth.social.comingSoon') }}
              </span>
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              block
              class="relative w-full rounded-2xl border-slate-200 bg-white py-2.5"
              disabled
              data-testid="auth-social-google"
            >
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
              <span class="absolute -right-1 -top-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {{ t('auth.social.comingSoon') }}
              </span>
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-form-panel {
  animation: authFadeIn 0.5s ease-out both;
}

.auth-social {
  animation: authFadeIn 0.5s ease-out 0.15s both;
}

@keyframes authFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
