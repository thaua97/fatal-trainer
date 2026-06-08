import type { AdminUserListItem } from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'

export type AdminUsersViewMode = 'table' | 'list'
export type AdminUsersSortBy = 'name' | 'createdAt' | 'role'
export type AdminUsersSortOrder = 'asc' | 'desc'

const VIEW_MODE_KEY = 'ft-admin-users-view-mode'
const SORT_BY_KEY = 'ft-admin-users-sort-by'
const SORT_ORDER_KEY = 'ft-admin-users-sort-order'

export function useFTAdminUsersPage() {
  const { t } = useI18n()
  const {
    data,
    pending,
    query,
    refresh,
    updateUser,
    toggleFeatured,
    deleteUser,
    impersonate,
    createUser,
  } = useAdminUsers()

  const { refresh: refreshRecentAccess } = useFTAdminRecentAccess()

  const modalOpen = ref(false)
  const editingUser = ref<AdminUserListItem | null>(null)
  const actionPending = ref(false)
  const filterOpen = ref(false)

  const viewMode = useLocalStorage<AdminUsersViewMode>(VIEW_MODE_KEY, 'table')
  const sortBy = useLocalStorage<AdminUsersSortBy>(SORT_BY_KEY, 'createdAt')
  const sortOrder = useLocalStorage<AdminUsersSortOrder>(SORT_ORDER_KEY, 'desc')

  const form = reactive({
    name: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
  })

  const roleLabel = computed<Record<UserRole, string>>(() => ({
    student: t('admin.errors.roles.student'),
    'personal-trainer': t('admin.errors.roles.personal-trainer'),
    admin: t('admin.errors.roles.admin'),
  }))

  const {
    confirmOpen,
    pendingAction,
    requestToggleActive,
    requestToggleFeatured,
    requestImpersonate,
    requestDelete,
    confirmAction,
  } = useFTAdminUserActionConfirm({
    updateUser,
    toggleFeatured,
    impersonate: async (id) => {
      const user = await impersonate(id)
      await refreshRecentAccess()
      return user
    },
    deleteUser,
    actionPending,
  })

  const sortedItems = computed(() => {
    const items = [...(data.value?.items ?? [])]
    const direction = sortOrder.value === 'asc' ? 1 : -1

    items.sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name, 'pt-BR') * direction
      }
      if (sortBy.value === 'role') {
        return a.role.localeCompare(b.role) * direction
      }
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction
    })

    return items
  })

  const pagination = computed(() => ({
    page: data.value?.page ?? query.page ?? 1,
    pageSize: data.value?.pageSize ?? query.pageSize ?? 10,
    total: data.value?.total ?? 0,
    hasMore: data.value?.hasMore ?? false,
  }))

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

  function openCreate() {
    editingUser.value = null
    form.name = ''
    form.email = ''
    form.password = ''
    form.role = 'student'
    modalOpen.value = true
  }

  function openEdit(user: AdminUserListItem) {
    editingUser.value = user
    form.name = user.name
    form.email = user.email
    form.password = ''
    form.role = user.role
    modalOpen.value = true
  }

  async function handleSave() {
    actionPending.value = true
    try {
      if (editingUser.value) {
        await updateUser(editingUser.value.id, {
          name: form.name,
          email: form.email,
          role: form.role,
        })
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        })
      }
      modalOpen.value = false
    } finally {
      actionPending.value = false
    }
  }

  return {
    data,
    pending,
    query,
    refresh,
    modalOpen,
    editingUser,
    actionPending,
    filterOpen,
    viewMode,
    sortBy,
    sortOrder,
    form,
    roleLabel,
    sortedItems,
    pagination,
    activeFilterCount,
    confirmOpen,
    pendingAction,
    clearFilters,
    openCreate,
    openEdit,
    handleSave,
    handleToggleActive: requestToggleActive,
    handleToggleFeatured: requestToggleFeatured,
    handleImpersonate: requestImpersonate,
    handleDelete: requestDelete,
    confirmAction,
  }
}

// Backward-compatible alias
export const useFTAdminUsersTable = useFTAdminUsersPage
