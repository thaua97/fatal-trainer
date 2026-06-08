<script setup lang="ts">
const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const {
  userName,
  avatarUrl,
  roleLabel,
  menuItems,
  pending,
} = useFTAppHeaderUser({ includeNavLinks: props.compact })

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
      class="flex items-center rounded-full border border-violet-100 bg-violet-50/60 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
      :class="compact ? 'gap-1 p-1.5' : 'gap-3 py-2 pl-2 pr-5'"
      :aria-label="t('header.userMenu')"
      data-testid="app-header-user-menu"
    >
      <FTAvatar
        :src="avatarUrl"
        :name="userName"
        size="sm"
        :monochrome="false"
      />
      <template v-if="!compact">
        <span class="max-w-40 truncate text-lg font-medium text-slate-800 sm:max-w-48">
          {{ userName }}
        </span>
        <span class="hidden rounded-full bg-violet-600 px-3 py-0.5 text-sm font-semibold text-white sm:inline">
          {{ roleLabel }}
        </span>
      </template>
      <UIcon
        name="i-lucide-chevron-down"
        class="text-slate-500"
        :class="[compact ? 'size-5' : 'size-6', { 'animate-pulse': pending }]"
        aria-hidden="true"
      />
    </button>
  </UDropdownMenu>
</template>
