import type { AuthUser, StoredUser, UserRole } from '#shared/domain/auth/entities/user'
import type {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListResponse,
  AdminUsersQuery,
  AdminRecentAccessItem,
  CreateAdminUserRequest,
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
  deleteUserFromStore,
  getAdminBackupToken,
  type AdminSession,
} from './mock-user-store'
import { deleteTrainerByUserId, findTrainerByUserId } from '../services/trainer-repository'
import { appendActivity, countUserActivity, deleteUserActivity } from './mock-user-activity-store'
import { countUserNotes, deleteUserNotes } from './mock-user-notes-store'

const featuredTrainers = new Map<string, boolean>()

const impersonationLogs: AdminRecentAccessItem[] = []

function firstDefined<T>(...values: (T | undefined | null)[]): T | undefined {
  for (const value of values) {
    if (value != null) {
      return value
    }
  }

  return undefined
}

function toAdminUser(user: StoredUser): AdminUserListItem {
  const trainer = findTrainerByUserId(user.id)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNumber: firstDefined(user.phoneNumber, trainer?.contactPhone),
    avatarUrl: firstDefined(user.avatarUrl, trainer?.photoUrl),
    city: firstDefined(user.city, trainer?.city),
    state: firstDefined(user.state, trainer?.state),
    availability: trainer?.availability,
    servicePrice: trainer?.servicePrice,
    promoPrice: trainer?.promotion?.promoPrice,
    isActive: user.isActive,
    featured: firstDefined(featuredTrainers.get(user.id), trainer?.featured, false),
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

function adminUserRoleSortPriority(role: UserRole): number {
  if (role === 'personal-trainer') {
    return 0
  }

  if (role === 'student') {
    return 1
  }

  return 2
}

function compareAdminUsersByDefaultOrder(a: AdminUserListItem, b: AdminUserListItem): number {
  const roleDiff = adminUserRoleSortPriority(a.role) - adminUserRoleSortPriority(b.role)
  if (roleDiff !== 0) {
    return roleDiff
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  items.sort(compareAdminUsersByDefaultOrder)

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

export function deleteAdminUser(adminId: string, targetId: string): boolean {
  if (adminId === targetId) {
    return false
  }

  if (!findUserById(targetId)) {
    return false
  }

  deleteTrainerByUserId(targetId)
  deleteUserActivity(targetId)
  deleteUserNotes(targetId)
  featuredTrainers.delete(targetId)

  const remainingLogs = impersonationLogs.filter(log => log.targetUserId !== targetId)
  impersonationLogs.length = 0
  impersonationLogs.push(...remainingLogs)

  return deleteUserFromStore(targetId)
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
  if (admin.id === targetUserId) return null

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

export {
  addMockReport,
  deactivateTrainerFromReport,
  listAdminReports,
  updateReportStatus,
} from './mock-admin-reports'

export { setSessionCookie, clearSessionCookie, getSessionUser, getSessionTokenFromEvent }
