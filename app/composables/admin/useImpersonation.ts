import type { AuthUser } from '#shared/types/auth'
import { adminService } from '~/services/admin/admin.service'

export function useImpersonation() {
  const { t } = useI18n()
  const toast = useFTToast()
  const { user, fetchMe } = useAuth()
  const { fetchAdminMe } = useAdminAuth()

  const isActive = computed(() => user.value?.isImpersonating === true)
  const impersonatedName = computed(() => user.value?.name ?? '')

  async function startImpersonation(id: string): Promise<AuthUser> {
    const response = await adminService.impersonateAdminUser(id)
    toast.info(t('toast.admin.impersonationStarted'))
    await fetchMe()
    await fetchAdminMe()
    await navigateTo('/')
    return response.user
  }

  async function exitImpersonation(): Promise<void> {
    await adminService.exitImpersonation()
    await fetchMe()
    await fetchAdminMe()
    await navigateTo('/admin/usuarios')
  }

  return {
    isActive,
    impersonatedName,
    startImpersonation,
    exitImpersonation,
  }
}
