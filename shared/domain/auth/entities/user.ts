export type UserRole = 'student' | 'personal-trainer' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  phoneNumber?: string
  avatarUrl?: string
  city?: string
  state?: string
  isActive?: boolean
  isImpersonating?: boolean
  impersonatorId?: string
  createdAt?: string
}

export interface StoredUser extends AuthUser {
  password: string
  isActive: boolean
}
