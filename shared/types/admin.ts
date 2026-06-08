import type { UserRole } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

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

export type AdminUserActivityType =
  | 'profile_info_edit'
  | 'profile_promotion_edit'
  | 'profile_gallery_edit'
  | 'admin_user_edit'
  | 'admin_featured_toggle'
  | 'admin_impersonation'
  | 'account_login'
  | 'account_register'
  | 'account_deactivated'
  | 'report_received'

export interface AdminUserActivityChange {
  field: string
  label: string
  before: string | null
  after: string | null
}

export interface AdminUserActivityItem {
  id: string
  userId: string
  type: AdminUserActivityType
  title: string
  description?: string
  actorId?: string
  actorName?: string
  actorRole?: UserRole
  changes?: AdminUserActivityChange[]
  metadata?: Record<string, string>
  createdAt: string
}

export interface AdminUserActivityListResponse {
  items: AdminUserActivityItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface AdminUserNote {
  id: string
  userId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export interface AdminUserNotesResponse {
  items: AdminUserNote[]
}

export interface CreateAdminUserNoteRequest {
  content: string
}

export interface AdminUserDetail extends AdminUserListItem {
  trainer?: PersonalTrainer
  notesCount: number
  activityCount: number
}

export interface AdminUserActivityQuery {
  page?: number
  pageSize?: number
}

export type PromotionTemplateStatus = 'active' | 'upcoming' | 'expired'

export interface AdminPromotionTemplateListItem {
  id: string
  name: string
  label: string
  discountPercent: number
  startsAt: string
  endsAt: string
  maxRedemptions?: number
  isActive: boolean
  activationCount: number
  createdAt: string
}

export interface AdminPromotionListResponse {
  items: AdminPromotionTemplateListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface AdminPromotionsQuery {
  page?: number
  pageSize?: number
  search?: string
  isActive?: boolean
  status?: PromotionTemplateStatus
}

export interface CreateAdminPromotionRequest {
  name: string
  label: string
  discountPercent: number
  startsAt: string
  endsAt: string
  maxRedemptions?: number | null
  isActive?: boolean
}

export interface UpdateAdminPromotionRequest {
  name?: string
  label?: string
  discountPercent?: number
  startsAt?: string
  endsAt?: string
  maxRedemptions?: number | null
  isActive?: boolean
}

export interface PromotionTemplateListItem {
  id: string
  name: string
  label: string
  discountPercent: number
  startsAt: string
  endsAt: string
  maxRedemptions?: number
  isActive: boolean
}
