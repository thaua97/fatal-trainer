<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FTLocaleCode } from '#shared/types/locale'

const { t } = useI18n()
const { homeTo, isNavActive, onHomeClick } = useFTAppHeader()
const { isAuthenticated, initialized } = useAuth()

const showUserMenu = computed(() => initialized.value && isAuthenticated.value)
const showGuestActions = computed(() => initialized.value && !isAuthenticated.value)
const authReady = ref(false)
const { localeItems, currentLocale, switchLocale } = useFTLocaleSwitcher()

onMounted(() => {
  authReady.value = true
})

function localeMenuLabel(code: FTLocaleCode) {
  if (code === 'pt-BR') return t('locale.pt-BR')
  if (code === 'es-ES') return t('locale.es-ES')
  return t('locale.en-US')
}

const mobileMenuItems = computed<DropdownMenuItem[][]>(() => {
  const navSection: DropdownMenuItem[] = [
    { label: t('header.trainers'), icon: 'i-lucide-users', to: '/personal-trainers' },
    { label: t('header.favorites'), icon: 'i-lucide-heart', to: '/personal-trainers/favoritos' },
    { label: t('header.report'), icon: 'i-lucide-flag', to: '/denuncia' },
  ]

  const authSection: DropdownMenuItem[] = [
    { label: t('header.register'), icon: 'i-lucide-user-plus', to: '/registro' },
    { label: t('header.login'), icon: 'i-lucide-log-in', to: '/login' },
  ]

  return [
    navSection,
    authSection,
    localeItems.value.map(item => ({
      label: localeMenuLabel(item.code as FTLocaleCode),
      icon: item.code === currentLocale.value ? 'i-lucide-check' : undefined,
      onSelect: () => switchLocale(item.code as FTLocaleCode),
    })),
  ]
})
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/70"
  >
    <div class="w-full px-4 sm:px-6 lg:px-10">
      <!-- Mobile -->
      <div class="flex h-20 w-full items-center justify-between sm:h-22 md:hidden">
        <NuxtLink
          :to="homeTo"
          class="group shrink-0"
          data-testid="app-header-logo"
          @click="onHomeClick"
        >
          <FTLogo size="xl" />
        </NuxtLink>

        <div
          v-if="authReady"
          class="flex items-center gap-4"
        >
          <FTAppHeaderUserMenu
            v-if="showUserMenu"
            compact
          />

          <UDropdownMenu
            v-else-if="showGuestActions"
            :items="mobileMenuItems"
            :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
            :ui="{ content: 'min-w-52' }"
          >
            <UButton
              icon="i-lucide-menu"
              variant="ghost"
              color="primary"
              size="lg"
              class="rounded-full"
              :aria-label="t('header.menu')"
              data-testid="app-header-menu"
            />
          </UDropdownMenu>
        </div>
      </div>

      <!-- Desktop -->
      <div class="relative mx-auto hidden h-20 w-full max-w-7xl items-center justify-between px-8 sm:h-24 md:flex">
        <div class="flex justify-end">
          <NuxtLink
            :to="homeTo"
            class="group"
            data-testid="app-header-logo-desktop"
            @click="onHomeClick"
          >
            <FTLogo size="xl" />
          </NuxtLink>
        </div>

        <nav
          class="absolute left-1/2 flex -translate-x-1/2 items-center gap-10"
          :aria-label="t('header.navLabel')"
        >
          <NuxtLink
            to="/personal-trainers"
            class="text-lg font-medium transition-colors"
            :class="isNavActive('/personal-trainers') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            data-testid="app-header-nav-trainers"
          >
            {{ t('header.trainers') }}
          </NuxtLink>
          <NuxtLink
            to="/personal-trainers/favoritos"
            class="text-lg font-medium transition-colors"
            :class="isNavActive('/personal-trainers/favoritos') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            data-testid="app-header-nav-favorites"
          >
            {{ t('header.favorites') }}
          </NuxtLink>
          <NuxtLink
            to="/denuncia"
            class="text-lg font-medium transition-colors"
            :class="isNavActive('/denuncia') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'"
            data-testid="app-header-nav-report"
          >
            {{ t('header.report') }}
          </NuxtLink>
        </nav>

        <div
          v-if="authReady"
          class="flex items-center gap-4"
        >
          <FTAppHeaderUserMenu v-if="showUserMenu" />
          <template v-else-if="showGuestActions">
            <UButton
              to="/registro"
              variant="ghost"
              color="neutral"
              size="lg"
              class="rounded-full text-lg text-slate-600"
              data-testid="app-header-auth-register"
            >
              {{ t('header.register') }}
            </UButton>
            <UButton
              to="/login"
              variant="ghost"
              color="neutral"
              size="lg"
              class="rounded-full text-lg text-slate-600"
              data-testid="app-header-auth-login"
            >
              {{ t('header.login') }}
            </UButton>
          </template>
          <FTLocaleSwitcher v-if="!showUserMenu" size="lg" />
        </div>
      </div>
    </div>
  </header>
</template>
