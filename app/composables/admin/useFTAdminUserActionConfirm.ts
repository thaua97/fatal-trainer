import type { AdminUserListItem } from '#shared/types/admin'
import type { AuthUser } from '#shared/domain/auth/entities/user'

export type AdminUserConfirmAction =
  | 'deactivate'
  | 'activate'
  | 'feature'
  | 'unfeature'
  | 'impersonate'
  | 'delete'

interface PendingAction {
  user: AdminUserListItem
  action: AdminUserConfirmAction
}

interface AdminUserActionDeps {
  updateUser: (id: string, payload: { isActive: boolean }) => Promise<void>
  toggleFeatured: (id: string, featured: boolean) => Promise<void>
  impersonate: (id: string) => Promise<AuthUser>
  deleteUser: (id: string) => Promise<void>
  actionPending: Ref<boolean>
}

export function useFTAdminUserActionConfirm(deps: AdminUserActionDeps) {
  const { t } = useI18n()
  const toast = useFTToast()
  const { user: adminUser } = useAdminAuth()
  const confirmOpen = ref(false)
  const pendingAction = ref<PendingAction | null>(null)

  function requestAction(user: AdminUserListItem, action: AdminUserConfirmAction) {
    pendingAction.value = { user, action }
    confirmOpen.value = true
  }

  function requestToggleActive(user: AdminUserListItem) {
    requestAction(user, user.isActive ? 'deactivate' : 'activate')
  }

  function requestToggleFeatured(user: AdminUserListItem) {
    if (user.role !== 'personal-trainer') {
      return
    }
    requestAction(user, user.featured ? 'unfeature' : 'feature')
  }

  function requestImpersonate(user: AdminUserListItem) {
    if (adminUser.value?.id === user.id) {
      return
    }
    requestAction(user, 'impersonate')
  }

  function requestDelete(user: AdminUserListItem) {
    if (adminUser.value?.id === user.id) {
      return
    }
    requestAction(user, 'delete')
  }

  async function confirmAction() {
    const pending = pendingAction.value
    if (!pending) {
      return
    }

    deps.actionPending.value = true
    try {
      const { user, action } = pending

      switch (action) {
        case 'deactivate':
          await deps.updateUser(user.id, { isActive: false })
          break
        case 'activate':
          await deps.updateUser(user.id, { isActive: true })
          break
        case 'feature':
          await deps.toggleFeatured(user.id, true)
          break
        case 'unfeature':
          await deps.toggleFeatured(user.id, false)
          break
        case 'impersonate':
          await deps.impersonate(user.id)
          break
        case 'delete':
          await deps.deleteUser(user.id)
          break
      }

      confirmOpen.value = false
      pendingAction.value = null
    } catch {
      toast.error(t('toast.errors.generic'))
    } finally {
      deps.actionPending.value = false
    }
  }

  return {
    confirmOpen,
    pendingAction,
    requestAction,
    requestToggleActive,
    requestToggleFeatured,
    requestImpersonate,
    requestDelete,
    confirmAction,
  }
}
