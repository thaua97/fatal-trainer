import type { UserRole } from '#shared/domain/auth/entities/user'

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

  const {
    filterOpen,
    viewMode,
    sortBy,
    sortOrder,
    activeFilterCount,
    clearFilters,
  } = useAdminUsersFilters(query)

  const {
    modalOpen,
    editingUser,
    actionPending,
    form,
    confirmOpen,
    pendingAction,
    openCreate,
    openEdit,
    handleSave,
    handleToggleActive,
    handleToggleFeatured,
    handleImpersonate,
    handleDelete,
    confirmAction,
  } = useAdminUsersCrud({
    updateUser,
    createUser,
    toggleFeatured,
    deleteUser,
    impersonate,
    refreshRecentAccess,
  })

  const roleLabel = computed<Record<UserRole, string>>(() => ({
    student: t('admin.errors.roles.student'),
    'personal-trainer': t('admin.errors.roles.personal-trainer'),
    admin: t('admin.errors.roles.admin'),
  }))

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
    handleToggleActive,
    handleToggleFeatured,
    handleImpersonate,
    handleDelete,
    confirmAction,
  }
}

export const useFTAdminUsersTable = useFTAdminUsersPage
