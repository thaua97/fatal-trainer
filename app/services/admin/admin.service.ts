import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { LoginRequest } from '#shared/types/api'
import type {
  AdminPromotionListResponse,
  AdminPromotionsQuery,
  AdminPromotionTemplateListItem,
  AdminReportListItem,
  AdminReportListResponse,
  AdminReportsQuery,
  AdminRecentAccessResponse,
  AdminUserActivityListResponse,
  AdminUserActivityQuery,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListResponse,
  AdminUserNote,
  AdminUserNotesResponse,
  AdminUsersQuery,
  CreateAdminPromotionRequest,
  CreateAdminUserNoteRequest,
  CreateAdminUserRequest,
  ReportStatus,
  UpdateAdminPromotionRequest,
  UpdateAdminUserRequest,
} from '#shared/types/admin'
import { apiFetch } from '~/services/api/create-api-client'

export async function adminLogin(payload: LoginRequest): Promise<{ user: AuthUser }> {
  return apiFetch('/admin/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function getSessionUser(): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/me')
}

export async function adminLogout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' })
}

export async function listAdminUsers(query: AdminUsersQuery): Promise<AdminUserListResponse> {
  return apiFetch('/admin/users', { query })
}

export async function createAdminUser(payload: CreateAdminUserRequest): Promise<{ user: AdminUserListItem }> {
  return apiFetch('/admin/users', {
    method: 'POST',
    body: payload,
  })
}

export async function updateAdminUser(
  id: string,
  payload: UpdateAdminUserRequest,
): Promise<{ user: AdminUserListItem }> {
  return apiFetch(`/admin/users/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteAdminUser(id: string): Promise<void> {
  await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
}

export async function toggleAdminUserFeatured(
  id: string,
  featured: boolean,
): Promise<{ user: AdminUserListItem }> {
  return apiFetch(`/admin/users/${id}/featured`, {
    method: 'PATCH',
    body: { featured },
  })
}

export async function impersonateAdminUser(id: string): Promise<{ user: AuthUser }> {
  return apiFetch(`/admin/users/${id}/impersonate`, { method: 'POST' })
}

export async function exitImpersonation(): Promise<{ success: boolean }> {
  return apiFetch('/admin/impersonation/exit', { method: 'POST' })
}

export async function getRecentImpersonationAccess(limit = 8): Promise<AdminRecentAccessResponse> {
  return apiFetch('/admin/impersonation/recent', { query: { limit } })
}

export async function listAdminReports(query: AdminReportsQuery): Promise<AdminReportListResponse> {
  return apiFetch('/admin/reports', { query })
}

export async function updateAdminReportStatus(
  id: string,
  status: ReportStatus,
): Promise<{ report: AdminReportListItem }> {
  return apiFetch(`/admin/reports/${id}`, {
    method: 'PATCH',
    body: { status },
  })
}

export async function deactivateTrainerFromReport(id: string): Promise<{ report: AdminReportListItem }> {
  return apiFetch(`/admin/reports/${id}/deactivate-trainer`, { method: 'POST' })
}

export async function getAdminUser(id: string): Promise<{ user: AdminUserDetail }> {
  return apiFetch(`/admin/users/${id}`)
}

export async function listAdminUserActivity(
  id: string,
  query: AdminUserActivityQuery = {},
): Promise<AdminUserActivityListResponse> {
  return apiFetch(`/admin/users/${id}/activity`, { query })
}

export async function listAdminUserNotes(id: string): Promise<AdminUserNotesResponse> {
  return apiFetch(`/admin/users/${id}/notes`)
}

export async function createAdminUserNote(
  id: string,
  payload: CreateAdminUserNoteRequest,
): Promise<{ note: AdminUserNote }> {
  return apiFetch(`/admin/users/${id}/notes`, {
    method: 'POST',
    body: payload,
  })
}

export async function listAdminPromotions(
  query: AdminPromotionsQuery,
): Promise<AdminPromotionListResponse> {
  return apiFetch('/admin/promotions', { query })
}

export async function createAdminPromotion(
  payload: CreateAdminPromotionRequest,
): Promise<{ promotion: AdminPromotionTemplateListItem }> {
  return apiFetch('/admin/promotions', {
    method: 'POST',
    body: payload,
  })
}

export async function updateAdminPromotion(
  id: string,
  payload: UpdateAdminPromotionRequest,
): Promise<{ promotion: AdminPromotionTemplateListItem }> {
  return apiFetch(`/admin/promotions/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteAdminPromotion(id: string): Promise<void> {
  await apiFetch(`/admin/promotions/${id}`, { method: 'DELETE' })
}

export const adminService = {
  adminLogin,
  getSessionUser,
  adminLogout,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminUserFeatured,
  impersonateAdminUser,
  exitImpersonation,
  getRecentImpersonationAccess,
  listAdminReports,
  updateAdminReportStatus,
  deactivateTrainerFromReport,
  getAdminUser,
  listAdminUserActivity,
  listAdminUserNotes,
  createAdminUserNote,
  listAdminPromotions,
  createAdminPromotion,
  updateAdminPromotion,
  deleteAdminPromotion,
}
