<script setup lang="ts">
import type { AdminPromotionsQuery } from '#shared/types/admin'
import type {
  AdminPromotionsSortBy,
  AdminPromotionsSortOrder,
} from '~/composables/admin/useFTAdminPromotionsPage'

const { t } = useI18n()

const sortBy = defineModel<AdminPromotionsSortBy>('sortBy', { required: true })
const sortOrder = defineModel<AdminPromotionsSortOrder>('sortOrder', { required: true })
const filterOpen = defineModel<boolean>('filterOpen', { default: false })
const query = defineModel<AdminPromotionsQuery>('query', { required: true })

defineProps<{
  activeFilterCount: number
}>()

const emit = defineEmits<{
  clearFilters: []
  openCreate: []
}>()

const sortItems = computed(() => [
  { label: t('admin.promotions.toolbar.sortNameAsc'), sortBy: 'name' as const, sortOrder: 'asc' as const },
  { label: t('admin.promotions.toolbar.sortNameDesc'), sortBy: 'name' as const, sortOrder: 'desc' as const },
  { label: t('admin.promotions.toolbar.sortNewest'), sortBy: 'createdAt' as const, sortOrder: 'desc' as const },
  { label: t('admin.promotions.toolbar.sortStartsAsc'), sortBy: 'startsAt' as const, sortOrder: 'asc' as const },
  { label: t('admin.promotions.toolbar.sortDiscountDesc'), sortBy: 'discountPercent' as const, sortOrder: 'desc' as const },
])

const currentSortLabel = computed(() => {
  const match = sortItems.value.find(
    item => item.sortBy === sortBy.value && item.sortOrder === sortOrder.value,
  )
  return match?.label ?? t('admin.promotions.toolbar.sort')
})

function applySort(item: typeof sortItems.value[number]) {
  sortBy.value = item.sortBy
  sortOrder.value = item.sortOrder
}

const periodLabels = computed(() => ({
  active: t('admin.promotions.toolbar.periodActive'),
  upcoming: t('admin.promotions.toolbar.periodUpcoming'),
  expired: t('admin.promotions.toolbar.periodExpired'),
} as const))

const { activeFilterChips } = useAdminFilterChips(query, [
  {
    key: 'enabled',
    label: () => query.value.isActive
      ? t('admin.promotions.toolbar.chipEnabled')
      : t('admin.promotions.toolbar.chipDisabled'),
    when: q => q.isActive !== undefined,
    field: 'isActive',
  },
  {
    key: 'status',
    label: () => query.value.status ? periodLabels.value[query.value.status] : undefined,
    when: q => Boolean(q.status),
    field: 'status',
  },
])

const { fieldUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <div
    class="mb-4 space-y-3"
    data-testid="admin-promotions-toolbar"
  >
    <div class="flex flex-wrap items-center gap-2">
      <UInput
        v-model="query.search"
        icon="i-lucide-search"
        :placeholder="t('admin.promotions.toolbar.searchPlaceholder')"
        class="min-w-[200px] flex-1"
        :ui="fieldUi"
        :size="inputSize"
      />

      <div class="flex flex-wrap items-center gap-2">
        <UPopover v-model:open="filterOpen">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-sliders-horizontal"
            class="rounded-full"
          >
            {{ t('admin.promotions.toolbar.filters') }}
            <UBadge
              v-if="activeFilterCount"
              :label="String(activeFilterCount)"
              color="primary"
              size="xs"
              class="ml-1"
            />
          </UButton>
          <template #content>
            <div class="w-64 space-y-4 p-4">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-500">{{ t('admin.promotions.toolbar.enabledLabel') }}</label>
                <USelect
                  v-model="query.isActive"
                  :items="[
                    { label: t('admin.promotions.toolbar.enabledAll'), value: undefined },
                    { label: t('admin.promotions.toolbar.enabledActive'), value: true },
                    { label: t('admin.promotions.toolbar.enabledInactive'), value: false },
                  ]"
                  :placeholder="t('admin.promotions.toolbar.enabledLabel')"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-500">{{ t('admin.promotions.toolbar.periodLabel') }}</label>
                <USelect
                  v-model="query.status"
                  :items="[
                    { label: t('admin.promotions.toolbar.periodAll'), value: undefined },
                    { label: t('admin.promotions.toolbar.periodActive'), value: 'active' },
                    { label: t('admin.promotions.toolbar.periodUpcoming'), value: 'upcoming' },
                    { label: t('admin.promotions.toolbar.periodExpired'), value: 'expired' },
                  ]"
                  :placeholder="t('admin.promotions.toolbar.periodLabel')"
                />
              </div>
              <UButton
                v-if="activeFilterCount"
                variant="ghost"
                color="neutral"
                size="sm"
                class="w-full"
                @click="emit('clearFilters')"
              >
                {{ t('admin.promotions.toolbar.clearFilters') }}
              </UButton>
            </div>
          </template>
        </UPopover>

        <UDropdownMenu
          :items="[sortItems.map(item => ({
            label: item.label,
            onSelect: () => applySort(item),
          }))]"
        >
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-arrow-up-down"
            trailing-icon="i-lucide-chevron-down"
            class="rounded-full"
          >
            {{ currentSortLabel }}
          </UButton>
        </UDropdownMenu>

        <UButton
          color="primary"
          icon="i-lucide-plus"
          class="rounded-full"
          @click="emit('openCreate')"
        >
          {{ t('admin.promotions.toolbar.newPromotion') }}
        </UButton>
      </div>
    </div>

    <div
      v-if="activeFilterChips.length"
      class="flex flex-wrap items-center gap-2"
    >
      <UBadge
        v-for="chip in activeFilterChips"
        :key="chip.key"
        color="primary"
        variant="soft"
        class="cursor-pointer gap-1"
        @click="chip.clear()"
      >
        {{ chip.label }}
        <UIcon
          name="i-lucide-x"
          class="size-3"
        />
      </UBadge>
      <button
        type="button"
        class="text-xs font-medium text-slate-500 hover:text-slate-700"
        @click="emit('clearFilters')"
      >
        {{ t('admin.promotions.toolbar.clearAll') }}
      </button>
    </div>
  </div>
</template>
