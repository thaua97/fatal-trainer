import { adminService } from '~/services/admin/admin.service'

export function useImpersonation() {
  const { user, fetchMe } = useAuth()
  const { fetchAdminMe } = useAdminAuth()

  const isActive = computed(() => user.value?.isImpersonating === true)
  const impersonatedName = computed(() => user.value?.name ?? '')

  async function exitImpersonation(): Promise<void> {
    await adminService.exitImpersonation()
    await fetchMe()
    await fetchAdminMe()
    await navigateTo('/admin/usuarios')
  }

  return {
    isActive,
    impersonatedName,
    exitImpersonation,
  }
}
