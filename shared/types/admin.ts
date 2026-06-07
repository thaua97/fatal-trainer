import type { UserRole } from '#shared/domain/auth/entities/user'

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'archived'

export type AdminReportType =
  | 'inappropriate_content'
  | 'fake_profile'
  | 'harassment'
  | 'other'
  | 'abuse'
  | 'offense'
  | 'wrong_pricing'
  | 'spam'

export interface AdminUserListItem {
  id: string
  name: string
  email: string
  role: UserRole
  phoneNumber?: string
  avatarUrl?: string
  city?: string
  state?: string
  availability?: string
  servicePrice?: number
  promoPrice?: number
  isActive: boolean
  featured: boolean
  trainerId?: string
  createdAt: string
}

export interface AdminUserListResponse {
  items: AdminUserListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface AdminReportListItem {
  id: string
  type: AdminReportType
  status: ReportStatus
  occurredAt: string
  trainerId: string
  trainerName?: string
  description: string
  contactEmail: string
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

export interface AdminReportListResponse {
  items: AdminReportListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CreateAdminUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
  phoneNumber?: string
}

export interface UpdateAdminUserRequest {
  name?: string
  email?: string
  role?: UserRole
  isActive?: boolean
  phoneNumber?: string
}

export interface AdminUsersQuery {
  page?: number
  pageSize?: number
  search?: string
  role?: UserRole
  isActive?: boolean
}

export interface AdminReportsQuery {
  page?: number
  pageSize?: number
  status?: ReportStatus
  type?: AdminReportType
}

export interface AdminRecentAccessItem {
  id: string
  targetUserId: string
  targetName: string
  targetRole: UserRole
  accessedAt: string
}

export interface AdminRecentAccessResponse {
  items: AdminRecentAccessItem[]
}
