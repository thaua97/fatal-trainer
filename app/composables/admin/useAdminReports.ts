import type {
  AdminReportListResponse,
  AdminReportsQuery,
  ReportStatus,
} from '#shared/types/admin'
import { adminService } from '~/services/admin/admin.service'

export function useAdminReports() {
  const { t } = useI18n()
  const toast = useFTToast()

  const query = reactive<AdminReportsQuery>({
    page: 1,
    pageSize: 20,
  })

  const data = useState<AdminReportListResponse | null>('admin-reports-data', () => null)
  const pending = useState('admin-reports-pending', () => false)
  const error = useState<Error | null>('admin-reports-error', () => null)

  async function refresh(): Promise<void> {
    pending.value = true
    error.value = null
    try {
      data.value = await adminService.listAdminReports({ ...query })
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load reports')
      data.value = null
      toast.error(t('toast.errors.loadFailed'))
    } finally {
      pending.value = false
    }
  }

  if (import.meta.client) {
    watch(
      () => [query.page, query.status, query.type],
      () => refresh(),
      { immediate: true },
    )
  }

  async function updateStatus(id: string, status: ReportStatus) {
    await adminService.updateAdminReportStatus(id, status)
    await refresh()
  }

  async function deactivateTrainer(id: string) {
    await adminService.deactivateTrainerFromReport(id)
    await refresh()
  }

  return {
    query,
    data,
    pending,
    error,
    refresh,
    updateStatus,
    deactivateTrainer,
  }
}
