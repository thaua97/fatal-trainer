export type UserRole = 'student' | 'personal-trainer'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}

export interface StoredUser extends AuthUser {
  password: string
}
