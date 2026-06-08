import type { AdminUserDetail } from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'
import { adminService } from '~/services/admin/admin.service'

export function useAdminUserProfile(userId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(userId))

  const detailPending = ref(false)
  const activityPending = ref(false)
  const notesPending = ref(false)
  const noteSubmitting = ref(false)
  const error = ref<string | null>(null)

  const user = ref<AdminUserDetail | null>(null)
  const activityPage = ref(1)
  const activityPageSize = 8

  const {
    data: activityData,
    pending: activityFetchPending,
    refresh: refreshActivity,
  } = useAsyncData(
    () => `admin-user-activity-${id.value}-${activityPage.value}`,
    () => adminService.listAdminUserActivity(id.value, {
      page: activityPage.value,
      pageSize: activityPageSize,
    }),
    { watch: [id, activityPage] },
  )

  const {
    data: notesData,
    pending: notesFetchPending,
    refresh: refreshNotes,
  } = useAsyncData(
    () => `admin-user-notes-${id.value}`,
    () => adminService.listAdminUserNotes(id.value),
    { watch: [id] },
  )

  async function fetchDetail() {
    detailPending.value = true
    error.value = null
    try {
      const response = await adminService.getAdminUser(id.value)
      user.value = response.user
    } catch {
      error.value = 'Usuário não encontrado'
      user.value = null
    } finally {
      detailPending.value = false
    }
  }

  watch(id, () => {
    fetchDetail()
  }, { immediate: true })

  watch(activityFetchPending, (value) => {
    activityPending.value = value
  }, { immediate: true })

  watch(notesFetchPending, (value) => {
    notesPending.value = value
  }, { immediate: true })

  const roleLabel: Record<UserRole, string> = {
    student: 'Aluno',
    'personal-trainer': 'Personal',
    admin: 'Admin',
  }

  async function submitNote(content: string) {
    noteSubmitting.value = true
    try {
      await adminService.createAdminUserNote(id.value, { content })
      await Promise.all([refreshNotes(), fetchDetail()])
    } finally {
      noteSubmitting.value = false
    }
  }

  async function refreshAll() {
    await Promise.all([fetchDetail(), refreshActivity(), refreshNotes()])
  }

  return {
    user,
    detailPending,
    activityData,
    activityPending,
    activityPage,
    activityPageSize,
    notesData,
    notesPending,
    noteSubmitting,
    error,
    roleLabel,
    submitNote,
    refreshAll,
    refreshActivity,
  }
}
