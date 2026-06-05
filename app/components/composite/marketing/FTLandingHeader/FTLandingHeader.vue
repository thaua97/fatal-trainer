<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FTLocaleCode } from '#shared/types/locale'

const { t } = useI18n()
const { homeTo, navLinks, authLinks, isNavActive, onHomeClick } = useFTAppHeader()

const { localeItems, currentLocale, switchLocale } = useFTLocaleSwitcher()

function localeMenuLabel(code: FTLocaleCode) {
  if (code === 'pt-BR') return t('locale.pt-BR')
  if (code === 'es-ES') return t('locale.es-ES')
  return t('locale.en-US')
}

const mobileMenuItems = computed<DropdownMenuItem[][]>(() => [
  navLinks.map(link => ({
    label: t(`header.${link.key}`),
    icon: link.icon,
    to: link.to,
  })),
  authLinks.map(link => ({
    label: t(`header.${link.key}`),
    icon: link.icon,
    to: link.to,
  })),
  localeItems.value.map(item => ({
    label: localeMenuLabel(item.code as FTLocaleCode),
    icon: item.code === currentLocale.value ? 'i-lucide-check' : undefined,
    onSelect: () => switchLocale(item.code as FTLocaleCode),
  })),
])
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/70"
    data-testid="landing-header"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <!-- Mobile -->
      <div class="flex h-14 w-full items-center justify-between sm:h-16 md:hidden">
        <NuxtLink
          :to="homeTo"
          class="group shrink-0"
          data-testid="landing-header-logo"
          @click="onHomeClick"
        >
          <FTLogo />
        </NuxtLink>

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
            data-testid="landing-header-menu"
          />
        </UDropdownMenu>
      </div>

      <!-- Desktop -->
      <div class="relative mx-auto hidden h-14 w-full max-w-7xl items-center justify-between sm:h-16 md:flex md:px-8">
        <NuxtLink
          :to="homeTo"
          class="group"
          data-testid="landing-header-logo-desktop"
          @click="onHomeClick"
        >
          <FTLogo />
        </NuxtLink>

        <nav
          class="absolute left-1/2 flex -translate-x-1/2 items-center gap-6"
          :aria-label="t('header.navLabel')"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.key"
            :to="link.to"
            class="text-sm font-medium transition-colors"
            :class="isNavActive(link.to) ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            :data-testid="`landing-header-nav-${link.key}`"
          >
            {{ t(`header.${link.key}`) }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-1">
          <UButton
            v-for="link in authLinks"
            :key="link.key"
            :to="link.to"
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-full text-slate-600"
            :data-testid="`landing-header-auth-${link.key}`"
          >
            {{ t(`header.${link.key}`) }}
          </UButton>
          <UButton
            to="/personal-trainers"
            color="primary"
            size="sm"
            class="rounded-full px-5"
            data-testid="landing-header-cta"
          >
            {{ t('landing.header.cta') }}
          </UButton>
          <FTLocaleSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>
