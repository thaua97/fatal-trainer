<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FTLocaleCode } from '#shared/types/locale'

const { t } = useI18n()
const { homeTo, isNavActive, onHomeClick } = useFTAppHeader()

const { localeItems, currentLocale, switchLocale } = useFTLocaleSwitcher()

function localeMenuLabel(code: FTLocaleCode) {
  if (code === 'pt-BR') return t('locale.pt-BR')
  if (code === 'es-ES') return t('locale.es-ES')
  return t('locale.en-US')
}

const mobileMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    { label: t('header.about'), icon: 'i-lucide-info', to: '/sobre' },
    { label: t('header.trainers'), icon: 'i-lucide-users', to: '/' },
    { label: t('header.report'), icon: 'i-lucide-flag', to: '/denuncia' },
  ],
  [
    { label: t('header.register'), icon: 'i-lucide-user-plus', to: '/registro' },
    { label: t('header.login'), icon: 'i-lucide-log-in', to: '/login' },
  ],
  localeItems.value.map(item => ({
    label: localeMenuLabel(item.code as FTLocaleCode),
    icon: item.code === currentLocale.value ? 'i-lucide-check' : undefined,
    onSelect: () => switchLocale(item.code as FTLocaleCode),
  })),
])
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/70"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <!-- Mobile -->
      <div class="flex h-14 w-full items-center justify-between sm:h-16 md:hidden">
        <NuxtLink
          :to="homeTo"
          class="shrink-0 text-lg font-bold"
          data-testid="app-header-logo"
          @click="onHomeClick"
        >
          <span class="text-violet-600">Fatal</span><span class="text-slate-900">Trainer</span>
        </NuxtLink>

        <div class="flex flex-1 items-center justify-end">
          <UDropdownMenu
            :items="mobileMenuItems"
            :content="{ align: 'center', side: 'bottom', sideOffset: 8 }"
            :ui="{ content: 'min-w-52' }"
          >
            <UButton
              icon="i-lucide-menu"
              variant="ghost"
              color="primary"
              size="sm"
              class="rounded-full"
              :aria-label="t('header.menu')"
              data-testid="app-header-menu"
            />
          </UDropdownMenu>
        </div>
      </div>

      <!-- Desktop -->
      <div class="relative hidden w-full max-w-7xl mx-auto h-14 sm:h-16 md:flex md:justify-between md:items-center md:px-8">
        <div class="flex justify-end">
          <NuxtLink
            :to="homeTo"
            class="text-lg font-bold"
            data-testid="app-header-logo-desktop"
            @click="onHomeClick"
          >
            <span class="text-violet-600">Fatal</span><span class="text-slate-900">Trainer</span>
          </NuxtLink>
        </div>

        <nav
          class="absolute left-1/2 flex -translate-x-1/2 items-center gap-6"
          :aria-label="t('header.navLabel')"
        >
          <NuxtLink
            to="/sobre"
            class="text-sm font-medium transition-colors"
            :class="isNavActive('/sobre') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            data-testid="app-header-nav-about"
          >
            {{ t('header.about') }}
          </NuxtLink>
          <NuxtLink
            to="/"
            class="text-sm font-medium transition-colors"
            :class="isNavActive('/') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            data-testid="app-header-nav-trainers"
          >
            {{ t('header.trainers') }}
          </NuxtLink>
          <NuxtLink
            to="/denuncia"
            class="text-sm font-medium transition-colors"
            :class="isNavActive('/denuncia') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            data-testid="app-header-nav-report"
          >
            {{ t('header.report') }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-1">
          <UButton
            to="/registro"
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-full text-slate-600"
            data-testid="app-header-auth-register"
          >
            {{ t('header.register') }}
          </UButton>
          <UButton
            to="/login"
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-full text-slate-600"
            data-testid="app-header-auth-login"
          >
            {{ t('header.login') }}
          </UButton>
          <FTLocaleSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>
