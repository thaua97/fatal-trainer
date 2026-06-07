import type { AdminRecentAccessItem } from '#shared/types/admin'
import { adminService } from '~/services/admin/admin.service'

export function useFTAdminRecentAccess() {
  const items = useState<AdminRecentAccessItem[]>('admin-recent-access', () => [])
  const pending = useState('admin-recent-access-pending', () => false)

  async function refresh(): Promise<void> {
    pending.value = true
    try {
      const response = await adminService.getRecentImpersonationAccess(8)
      items.value = response.items
    } catch {
      items.value = []
    } finally {
      pending.value = false
    }
  }

  onMounted(() => refresh())

  return { items, pending, refresh }
}
