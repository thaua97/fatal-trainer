<script setup lang="ts">
const {
  userName,
  avatarUrl,
  roleLabel,
  menuItems,
  pending,
} = useFTAppHeaderUser()

const { t } = useI18n()
</script>

<template>
  <UDropdownMenu
    :items="menuItems"
    :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
    :ui="{ content: 'min-w-52' }"
  >
    <button
      type="button"
      class="flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50/60 py-1 pl-1 pr-3 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
      :aria-label="t('header.userMenu')"
      data-testid="app-header-user-menu"
    >
      <FTAvatar
        :src="avatarUrl"
        :name="userName"
        size="sm"
        :monochrome="false"
      />
      <span class="max-w-32 truncate text-sm font-medium text-slate-800 sm:max-w-40">
        {{ userName }}
      </span>
      <span class="hidden rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white sm:inline">
        {{ roleLabel }}
      </span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-4 text-slate-500"
        :class="{ 'animate-pulse': pending }"
        aria-hidden="true"
      />
    </button>
  </UDropdownMenu>
</template>
