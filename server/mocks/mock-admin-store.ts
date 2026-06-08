import type { AuthUser, StoredUser, UserRole } from '#shared/domain/auth/entities/user'
import type {
  AdminReportListItem,
  AdminReportListResponse,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListResponse,
  AdminReportsQuery,
  AdminUsersQuery,
  AdminRecentAccessItem,
  CreateAdminUserRequest,
  ReportStatus,
  UpdateAdminUserRequest,
} from '#shared/types/admin'
import { randomUUID } from 'node:crypto'
import {
  createSession,
  destroySession,
  findUserByEmail,
  findUserById,
  getAllUsers,
  getSessionUser,
  getSessionTokenFromEvent,
  setAdminBackupCookie,
  setSessionCookie,
  clearAdminBackupCookie,
  clearSessionCookie,
  updateUserInStore,
  createUserInStore,
  getAdminBackupToken,
  type AdminSession,
} from './mock-user-store'
import { findTrainerById, findTrainerByUserId } from '../services/trainer-repository'
import { appendActivity, countUserActivity } from './mock-user-activity-store'
import { countUserNotes } from './mock-user-notes-store'

const featuredTrainers = new Map<string, boolean>()

interface StoredReport extends AdminReportListItem {}

const reports: StoredReport[] = []
const impersonationLogs: AdminRecentAccessItem[] = []

function toAdminUser(user: StoredUser): AdminUserListItem {
  const trainer = findTrainerByUserId(user.id)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber ?? trainer?.contactPhone,
    avatarUrl: user.avatarUrl ?? trainer?.photoUrl,
    city: user.city ?? trainer?.city,
    state: user.state ?? trainer?.state,
    availability: trainer?.availability,
    servicePrice: trainer?.servicePrice,
    promoPrice: trainer?.promotion?.promoPrice,
    isActive: user.isActive,
    featured: featuredTrainers.get(user.id) ?? trainer?.featured ?? false,
    trainerId: trainer?.id,
    createdAt: user.createdAt ?? new Date().toISOString(),
  }
}

export function adminLogin(email: string, password: string): AuthUser | null {
  const user = findUserByEmail(email)
  if (!user || user.password !== password || !user.isActive || user.role !== 'admin') {
    return null
  }
  const { password: _, ...authUser } = user
  return authUser
}

export function listAdminUsers(query: AdminUsersQuery): AdminUserListResponse {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 20
  let items = getAllUsers().map(toAdminUser)

  if (query.search) {
    const term = query.search.toLowerCase()
    items = items.filter(u =>
      u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
    )
  }

  if (query.role) {
    items = items.filter(u => u.role === query.role)
  }

  if (query.isActive !== undefined) {
    items = items.filter(u => u.isActive === query.isActive)
  }

  const total = items.length
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)

  return {
    items: paged,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  }
}

export function createAdminUser(payload: CreateAdminUserRequest): AdminUserListItem {
  const user = createUserInStore({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
  })
  return toAdminUser(user)
}

export function getAdminUserById(id: string): AdminUserDetail | null {
  const user = findUserById(id)
  if (!user) return null

  const listItem = toAdminUser(user)
  const trainer = findTrainerByUserId(id)

  return {
    ...listItem,
    trainer,
    notesCount: countUserNotes(id),
    activityCount: countUserActivity(id),
  }
}

export function updateAdminUser(id: string, payload: UpdateAdminUserRequest): AdminUserListItem | null {
  const updated = updateUserInStore(id, payload)
  return updated ? toAdminUser(updated) : null
}

export function toggleUserFeatured(userId: string, featured: boolean): AdminUserListItem | null {
  const user = getAllUsers().find(u => u.id === userId)
  if (!user || user.role !== 'personal-trainer') return null
  featuredTrainers.set(userId, featured)
  return toAdminUser(user)
}

export function impersonateUser(
  event: Parameters<typeof setSessionCookie>[0],
  adminToken: string,
  targetUserId: string,
): AuthUser | null {
  const admin = getSessionUser(adminToken)
  if (!admin || admin.role !== 'admin') return null

  const target = getAllUsers().find(u => u.id === targetUserId)
  if (!target || !target.isActive) return null

  impersonationLogs.unshift({
    id: randomUUID(),
    targetUserId: target.id,
    targetName: target.name,
    targetRole: target.role,
    accessedAt: new Date().toISOString(),
  })
  if (impersonationLogs.length > 50) {
    impersonationLogs.length = 50
  }

  appendActivity({
    userId: target.id,
    type: 'admin_impersonation',
    title: 'Acesso como usuário',
    description: `${admin.name} acessou a conta deste usuário`,
    actorId: admin.id,
    actorName: admin.name,
    actorRole: admin.role,
  })

  setAdminBackupCookie(event, adminToken)
  destroySession(adminToken)

  const token = createSession(targetUserId, admin.id)
  setSessionCookie(event, token)

  const { password: _, ...authUser } = target
  return {
    ...authUser,
    isImpersonating: true,
    impersonatorId: admin.id,
  }
}

export function listRecentImpersonationAccess(limit = 8): AdminRecentAccessItem[] {
  return impersonationLogs.slice(0, limit)
}

export function exitImpersonation(event: Parameters<typeof setSessionCookie>[0]): boolean {
  const currentToken = getSessionTokenFromEvent(event)
  const adminToken = getAdminBackupToken(event)

  if (currentToken) {
    destroySession(currentToken)
  }

  if (adminToken) {
    setSessionCookie(event, adminToken)
    clearAdminBackupCookie(event)
    return true
  }

  clearSessionCookie(event)
  return false
}

export function listAdminReports(query: AdminReportsQuery): AdminReportListResponse {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 20
  let items = [...reports]

  if (query.status) {
    items = items.filter(r => r.status === query.status)
  }

  if (query.type) {
    items = items.filter(r => r.type === query.type)
  }

  const total = items.length
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  }
}

export function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminId: string,
): AdminReportListItem | null {
  const report = reports.find(r => r.id === reportId)
  if (!report) return null

  report.status = status
  if (status === 'resolved' || status === 'archived') {
    report.resolvedAt = new Date().toISOString()
    report.resolvedBy = adminId
  } else {
    report.resolvedAt = undefined
    report.resolvedBy = undefined
  }

  return { ...report }
}

export function deactivateTrainerFromReport(
  reportId: string,
  adminId: string,
): AdminReportListItem | null {
  const report = reports.find(r => r.id === reportId)
  if (!report) return null

  const trainer = findTrainerByUserId(report.trainerId) ?? findTrainerById(report.trainerId)
  const targetUserId = trainer?.userId ?? report.trainerId
  const admin = findUserById(adminId)

  updateUserInStore(targetUserId, { isActive: false })

  appendActivity({
    userId: targetUserId,
    type: 'account_deactivated',
    title: 'Conta desativada via denúncia',
    actorId: adminId,
    actorName: admin?.name,
    actorRole: admin?.role,
    metadata: { reportId },
  })

  return updateReportStatus(reportId, 'resolved', adminId)
}

export function addMockReport(report: Omit<StoredReport, 'id' | 'createdAt' | 'status'>): void {
  reports.push({
    ...report,
    id: randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  })
}

export { setSessionCookie, clearSessionCookie, getSessionUser, getSessionTokenFromEvent }
