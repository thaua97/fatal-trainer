import type { AdminUsersQuery } from '#shared/types/admin'

export type AdminUsersSortBy = 'name' | 'createdAt' | 'role'
export type AdminUsersSortOrder = 'asc' | 'desc'
export type AdminUsersViewMode = 'table' | 'list'

const VIEW_MODE_KEY = 'ft-admin-users-view-mode'
const SORT_BY_KEY = 'ft-admin-users-sort-by'
const SORT_ORDER_KEY = 'ft-admin-users-sort-order'

export function useAdminUsersFilters(query: AdminUsersQuery) {
  const filterOpen = ref(false)
  const viewMode = useLocalStorage<AdminUsersViewMode>(VIEW_MODE_KEY, 'table')
  const sortBy = useLocalStorage<AdminUsersSortBy>(SORT_BY_KEY, 'createdAt')
  const sortOrder = useLocalStorage<AdminUsersSortOrder>(SORT_ORDER_KEY, 'desc')

  const activeFilterCount = computed(() => {
    let count = 0
    if (query.role) count++
    if (query.isActive !== undefined) count++
    return count
  })

  function clearFilters() {
    query.role = undefined
    query.isActive = undefined
  }

  return {
    filterOpen,
    viewMode,
    sortBy,
    sortOrder,
    activeFilterCount,
    clearFilters,
  }
}
