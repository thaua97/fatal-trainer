<script setup lang="ts">
import type { AdminUsersQuery } from '#shared/types/admin'
import type {
  AdminUsersSortBy,
  AdminUsersSortOrder,
  AdminUsersViewMode,
} from '~/composables/admin/useFTAdminUsersPage'

const viewMode = defineModel<AdminUsersViewMode>('viewMode', { required: true })
const sortBy = defineModel<AdminUsersSortBy>('sortBy', { required: true })
const sortOrder = defineModel<AdminUsersSortOrder>('sortOrder', { required: true })
const filterOpen = defineModel<boolean>('filterOpen', { default: false })

const props = defineProps<{
  query: AdminUsersQuery
  activeFilterCount: number
}>()

const emit = defineEmits<{
  clearFilters: []
  openCreate: []
}>()

const sortItems = [
  { label: 'Nome A–Z', sortBy: 'name' as const, sortOrder: 'asc' as const },
  { label: 'Nome Z–A', sortBy: 'name' as const, sortOrder: 'desc' as const },
  { label: 'Mais recentes', sortBy: 'createdAt' as const, sortOrder: 'desc' as const },
  { label: 'Mais antigos', sortBy: 'createdAt' as const, sortOrder: 'asc' as const },
  { label: 'Papel A–Z', sortBy: 'role' as const, sortOrder: 'asc' as const },
]

const currentSortLabel = computed(() => {
  const match = sortItems.find(
    item => item.sortBy === sortBy.value && item.sortOrder === sortOrder.value,
  )
  return match?.label ?? 'Ordenar'
})

function applySort(item: typeof sortItems[number]) {
  sortBy.value = item.sortBy
  sortOrder.value = item.sortOrder
}

const activeFilterChips = computed(() => {
  const chips: { key: string, label: string, clear: () => void }[] = []
  if (props.query.role) {
    const roleLabels: Record<string, string> = {
      student: 'Alunos',
      'personal-trainer': 'Personais',
      admin: 'Admins',
    }
    chips.push({
      key: 'role',
      label: roleLabels[props.query.role] ?? props.query.role,
      clear: () => { props.query.role = undefined },
    })
  }
  if (props.query.isActive !== undefined) {
    chips.push({
      key: 'status',
      label: props.query.isActive ? 'Ativos' : 'Inativos',
      clear: () => { props.query.isActive = undefined },
    })
  }
  return chips
})
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
        placeholder="Buscar por nome ou e-mail..."
        class="min-w-[200px] flex-1"
        :ui="{ base: 'rounded-2xl bg-white' }"
      />

      <div class="flex flex-wrap items-center gap-2">
        <div class="inline-flex rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
          <UButton
            :variant="viewMode === 'table' ? 'soft' : 'ghost'"
            :color="viewMode === 'table' ? 'primary' : 'neutral'"
            size="xs"
            icon="i-lucide-layout-grid"
            class="rounded-full"
            aria-label="Visualização em tabela"
            @click="viewMode = 'table'"
          />
          <UButton
            :variant="viewMode === 'list' ? 'soft' : 'ghost'"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            size="xs"
            icon="i-lucide-list"
            class="rounded-full"
            aria-label="Visualização em lista"
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
            Filtros
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
                <label class="mb-1.5 block text-xs font-semibold text-slate-500">Papel</label>
                <USelect
                  v-model="query.role"
                  :items="[
                    { label: 'Todos', value: undefined },
                    { label: 'Alunos', value: 'student' },
                    { label: 'Personais', value: 'personal-trainer' },
                    { label: 'Admins', value: 'admin' },
                  ]"
                  placeholder="Papel"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-500">Status</label>
                <USelect
                  v-model="query.isActive"
                  :items="[
                    { label: 'Todos', value: undefined },
                    { label: 'Ativos', value: true },
                    { label: 'Inativos', value: false },
                  ]"
                  placeholder="Status"
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
                Limpar filtros
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
          Novo usuário
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
        Limpar tudo
      </button>
    </div>
  </div>
</template>
