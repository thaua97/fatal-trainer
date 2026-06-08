import type { AuthUser, StoredUser, UserRole } from '#shared/domain/auth/entities/user'
import { randomUUID } from 'node:crypto'

const SESSION_COOKIE = 'ft_session'
const ADMIN_BACKUP_SESSION_COOKIE = 'ft_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export interface AdminSession {
  userId: string
  token: string
  impersonatorUserId?: string
  createdAt: string
}

const users = new Map<string, StoredUser>()
const sessions = new Map<string, AdminSession>()

function seedUsers() {
  if (users.size > 0) {
    return
  }

  const seed: Omit<StoredUser, 'id'>[] = [
    {
      name: 'Admin Fatal',
      email: 'admin@fataltrainer.com',
      password: 'Admin@Fatal2026!',
      role: 'admin',
      isActive: true,
      phoneNumber: '11987654321',
      createdAt: new Date().toISOString(),
    },
    {
      name: 'Ana Aluno',
      email: 'aluno@fataltrainer.com',
      password: '123456',
      role: 'student',
      isActive: true,
      phoneNumber: '11999887766',
      createdAt: new Date().toISOString(),
    },
    {
      name: 'Carlos Personal',
      email: 'personal@fataltrainer.com',
      password: '123456',
      role: 'personal-trainer',
      isActive: true,
      phoneNumber: '53991625225',
      createdAt: new Date().toISOString(),
    },
  ]

  for (const user of seed) {
    const id = randomUUID()
    users.set(id, { id, ...user })
  }
}

seedUsers()

function toAuthUser(user: StoredUser, session?: AdminSession): AuthUser {
  const { password: _password, createdAt: _createdAt, ...authUser } = user
  return {
    ...authUser,
    isImpersonating: !!session?.impersonatorUserId,
    impersonatorId: session?.impersonatorUserId,
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase()
  return [...users.values()].find(u => u.email.toLowerCase() === normalized)
}

export function findUserById(id: string): StoredUser | undefined {
  return users.get(id)
}

export function getAllUsers(): StoredUser[] {
  return [...users.values()]
}

export function verifyCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const user = findUserByEmail(email)
  if (!user || user.password !== password || !user.isActive) {
    return null
  }
  return toAuthUser(user)
}

export function createUserInStore(data: {
  name: string
  email: string
  password: string
  role: UserRole
}): StoredUser {
  const id = randomUUID()
  const user: StoredUser = {
    id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: data.role,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
  users.set(id, user)
  return user
}

export function deleteUserFromStore(id: string): boolean {
  if (!users.has(id)) {
    return false
  }

  users.delete(id)

  for (const [token, session] of sessions.entries()) {
    if (session.userId === id) {
      sessions.delete(token)
    }
  }

  return true
}

export function updateUserInStore(
  id: string,
  data: Partial<Pick<StoredUser, 'name' | 'email' | 'role' | 'isActive' | 'phoneNumber' | 'avatarUrl' | 'city' | 'state'>>,
): StoredUser | null {
  const user = users.get(id)
  if (!user) return null

  const updated: StoredUser = {
    ...user,
    ...(data.name !== undefined && { name: data.name.trim() }),
    ...(data.email !== undefined && { email: data.email.trim().toLowerCase() }),
    ...(data.role !== undefined && { role: data.role }),
    ...(data.isActive !== undefined && { isActive: data.isActive }),
    ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber.trim() || undefined }),
    ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl || undefined }),
    ...(data.city !== undefined && { city: data.city.trim() || undefined }),
    ...(data.state !== undefined && { state: data.state.trim().toUpperCase() || undefined }),
  }
  users.set(id, updated)
  return updated
}

export function createUser(data: {
  name: string
  email: string
  password: string
  role: UserRole
}): AuthUser {
  return toAuthUser(createUserInStore(data))
}

export function createSession(userId: string, impersonatorUserId?: string): string {
  const token = randomUUID()
  sessions.set(token, {
    userId,
    token,
    impersonatorUserId,
    createdAt: new Date().toISOString(),
  })
  return token
}

export function getSessionUser(token: string | undefined): AuthUser | null {
  if (!token) return null

  const session = sessions.get(token)
  if (!session) return null

  const user = users.get(session.userId)
  if (!user || !user.isActive) {
    sessions.delete(token)
    return null
  }

  return toAuthUser(user, session)
}

export function destroySession(token: string | undefined): void {
  if (token) {
    sessions.delete(token)
  }
}

export function setSessionCookie(event: Parameters<typeof setCookie>[0], token: string) {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export function setAdminBackupCookie(event: Parameters<typeof setCookie>[0], token: string) {
  setCookie(event, ADMIN_BACKUP_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export function clearSessionCookie(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function clearAdminBackupCookie(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, ADMIN_BACKUP_SESSION_COOKIE, { path: '/' })
}

export function getSessionTokenFromEvent(event: Parameters<typeof getCookie>[0]): string | undefined {
  const token = getCookie(event, SESSION_COOKIE)
  return token ?? undefined
}

export function getAdminBackupToken(event: Parameters<typeof getCookie>[0]): string | undefined {
  const token = getCookie(event, ADMIN_BACKUP_SESSION_COOKIE)
  return token ?? undefined
}

export { SESSION_COOKIE, ADMIN_BACKUP_SESSION_COOKIE }
