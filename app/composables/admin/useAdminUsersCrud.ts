import type { AdminUserListItem } from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'

export function useAdminUsersCrud(options: {
  updateUser: ReturnType<typeof useAdminUsers>['updateUser']
  createUser: ReturnType<typeof useAdminUsers>['createUser']
  toggleFeatured: ReturnType<typeof useAdminUsers>['toggleFeatured']
  deleteUser: ReturnType<typeof useAdminUsers>['deleteUser']
  impersonate: ReturnType<typeof useAdminUsers>['impersonate']
  refreshRecentAccess: () => Promise<void>
}) {
  const modalOpen = ref(false)
  const editingUser = ref<AdminUserListItem | null>(null)
  const actionPending = ref(false)

  const form = reactive({
    name: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
  })

  const {
    confirmOpen,
    pendingAction,
    requestToggleActive,
    requestToggleFeatured,
    requestImpersonate,
    requestDelete,
    confirmAction,
  } = useFTAdminUserActionConfirm({
    updateUser: options.updateUser,
    toggleFeatured: options.toggleFeatured,
    impersonate: async (id) => {
      const user = await options.impersonate(id)
      await options.refreshRecentAccess()
      return user
    },
    deleteUser: options.deleteUser,
    actionPending,
  })

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
        await options.updateUser(editingUser.value.id, {
          name: form.name,
          email: form.email,
          role: form.role,
        })
      } else {
        await options.createUser({
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
    modalOpen,
    editingUser,
    actionPending,
    form,
    confirmOpen,
    pendingAction,
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
