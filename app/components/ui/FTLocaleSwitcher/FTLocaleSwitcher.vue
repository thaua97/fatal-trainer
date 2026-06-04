<script setup lang="ts">
import type { FTLocaleCode } from '#shared/types/locale'

const { t } = useI18n()
const { localeItems, currentLocale, switchLocale } = useFTLocaleSwitcher()

const menuItems = computed(() =>
  localeItems.value.map(item => ({
    label: t(`locale.${item.code}`),
    icon: item.code === currentLocale.value ? 'i-lucide-check' : undefined,
    onSelect: () => switchLocale(item.code as FTLocaleCode),
  })),
)
</script>

<template>
  <UDropdownMenu
    :items="[menuItems]"
    :ui="{ content: 'min-w-44' }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      size="sm"
      class="rounded-full"
      :aria-label="t('locale.label')"
      data-testid="locale-switcher"
    >
      <UIcon
        name="i-lucide-languages"
        class="size-4"
      />
      <span class="hidden sm:inline">
        {{ t(`locale.${currentLocale}`) }}
      </span>
    </UButton>
  </UDropdownMenu>
</template>
