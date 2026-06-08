<script setup lang="ts">
import type { AdminUsersQuery } from '#shared/types/admin'
import type {
  AdminUsersSortBy,
  AdminUsersSortOrder,
  AdminUsersViewMode,
} from '~/composables/admin/useAdminUsersFilters'

const { t } = useI18n()

const viewMode = defineModel<AdminUsersViewMode>('viewMode', { required: true })
const sortBy = defineModel<AdminUsersSortBy>('sortBy', { required: true })
const sortOrder = defineModel<AdminUsersSortOrder>('sortOrder', { required: true })
const filterOpen = defineModel<boolean>('filterOpen', { default: false })
const query = defineModel<AdminUsersQuery>('query', { required: true })

defineProps<{
  activeFilterCount: number
}>()

const emit = defineEmits<{
  clearFilters: []
  openCreate: []
}>()

const sortItems = computed(() => [
  { label: t('admin.users.toolbar.sortNameAsc'), sortBy: 'name' as const, sortOrder: 'asc' as const },
  { label: t('admin.users.toolbar.sortNameDesc'), sortBy: 'name' as const, sortOrder: 'desc' as const },
  { label: t('admin.users.toolbar.sortNewest'), sortBy: 'createdAt' as const, sortOrder: 'desc' as const },
  { label: t('admin.users.toolbar.sortOldest'), sortBy: 'createdAt' as const, sortOrder: 'asc' as const },
  { label: t('admin.users.toolbar.sortRoleAsc'), sortBy: 'role' as const, sortOrder: 'asc' as const },
])

const currentSortLabel = computed(() => {
  const match = sortItems.value.find(
    item => item.sortBy === sortBy.value && item.sortOrder === sortOrder.value,
  )
  return match?.label ?? t('admin.users.toolbar.sort')
})

function applySort(item: typeof sortItems.value[number]) {
  sortBy.value = item.sortBy
  sortOrder.value = item.sortOrder
}

const roleLabel = computed<Record<string, string>>(() => ({
  student: t('admin.errors.roles.student'),
  'personal-trainer': t('admin.errors.roles.personal-trainer'),
  admin: t('admin.errors.roles.admin'),
}))

const { activeFilterChips } = useAdminFilterChips(query, [
  {
    key: 'role',
    label: () => query.value.role ? roleLabel.value[query.value.role] ?? query.value.role : undefined,
    when: q => Boolean(q.role),
    field: 'role',
  },
  {
    key: 'status',
    label: () => query.value.isActive ? t('admin.users.toolbar.statusActive') : t('admin.users.toolbar.statusInactive'),
    when: q => q.isActive !== undefined,
    field: 'isActive',
  },
])

const { fieldUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <div
    class="mb-4 space-y-3"
    data-testid="admin-users-toolbar"
  >
    <div class="flex flex-wrap items-center gap-2">
      <UInput
        v-model="query.search"
        icon="i-lucide-search"
        :placeholder="t('admin.users.toolbar.searchPlaceholder')"
        class="min-w-[200px] flex-1"
        :ui="fieldUi"
        :size="inputSize"
      />

      <div class="flex flex-wrap items-center gap-2">
        <div class="inline-flex rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
          <UButton
            :variant="viewMode === 'table' ? 'soft' : 'ghost'"
            :color="viewMode === 'table' ? 'primary' : 'neutral'"
            size="xs"
            icon="i-lucide-layout-grid"
            class="rounded-full"
            :aria-label="t('admin.users.toolbar.viewTable')"
            @click="viewMode = 'table'"
          />
          <UButton
            :variant="viewMode === 'list' ? 'soft' : 'ghost'"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            size="xs"
            icon="i-lucide-list"
            class="rounded-full"
            :aria-label="t('admin.users.toolbar.viewList')"
            @click="viewMode = 'list'"
          />
        </div>

        <UPopover v-model:open="filterOpen">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-lucide-sliders-horizontal"
            class="rounded-full"
          >
            {{ t('admin.users.toolbar.filters') }}
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
                <label class="mb-1.5 block text-xs font-semibold text-slate-500">{{ t('admin.users.toolbar.roleLabel') }}</label>
                <USelect
                  v-model="query.role"
                  :items="[
                    { label: t('admin.users.toolbar.roleAll'), value: undefined },
                    { label: t('admin.errors.roles.student'), value: 'student' },
                    { label: t('admin.errors.roles.personal-trainer'), value: 'personal-trainer' },
                    { label: t('admin.errors.roles.admin'), value: 'admin' },
                  ]"
                  :placeholder="t('admin.users.toolbar.roleLabel')"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-500">{{ t('admin.users.toolbar.statusLabel') }}</label>
                <USelect
                  v-model="query.isActive"
                  :items="[
                    { label: t('admin.users.toolbar.statusAll'), value: undefined },
                    { label: t('admin.users.toolbar.statusActive'), value: true },
                    { label: t('admin.users.toolbar.statusInactive'), value: false },
                  ]"
                  :placeholder="t('admin.users.toolbar.statusLabel')"
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
                {{ t('admin.users.toolbar.clearFilters') }}
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
          {{ t('admin.users.toolbar.newUser') }}
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
        {{ t('admin.users.toolbar.clearAll') }}
      </button>
    </div>
  </div>
</template>
