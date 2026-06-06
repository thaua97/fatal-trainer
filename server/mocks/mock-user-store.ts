import type { AuthUser, StoredUser, UserRole } from '#shared/domain/auth/entities/user'
import { randomUUID } from 'node:crypto'

const SESSION_COOKIE = 'ft_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

interface Session {
  userId: string
  token: string
  createdAt: string
}

const users = new Map<string, StoredUser>()
const sessions = new Map<string, Session>()

function seedUsers() {
  if (users.size > 0) {
    return
  }

  const seed: Omit<StoredUser, 'id'>[] = [
    {
      name: 'Ana Aluno',
      email: 'aluno@fataltrainer.com',
      password: '123456',
      role: 'student',
    },
    {
      name: 'Carlos Personal',
      email: 'personal@fataltrainer.com',
      password: '123456',
      role: 'personal-trainer',
    },
  ]

  for (const user of seed) {
    const id = randomUUID()
    users.set(id, { id, ...user })
  }
}

seedUsers()

function toAuthUser(user: StoredUser): AuthUser {
  const { password: _password, ...authUser } = user
  return authUser
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase()
  return [...users.values()].find(u => u.email.toLowerCase() === normalized)
}

export function verifyCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    return null
  }
  return toAuthUser(user)
}

export function createUser(data: {
  name: string
  email: string
  password: string
  role: UserRole
}): AuthUser {
  const id = randomUUID()
  const user: StoredUser = {
    id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: data.role,
  }
  users.set(id, user)
  return toAuthUser(user)
}

export function createSession(userId: string): string {
  const token = randomUUID()
  sessions.set(token, {
    userId,
    token,
    createdAt: new Date().toISOString(),
  })
  return token
}

export function getSessionUser(token: string | undefined): AuthUser | null {
  if (!token) {
    return null
  }

  const session = sessions.get(token)
  if (!session) {
    return null
  }

  const user = users.get(session.userId)
  if (!user) {
    sessions.delete(token)
    return null
  }

  return toAuthUser(user)
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

export function clearSessionCookie(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function getSessionTokenFromEvent(event: Parameters<typeof getCookie>[0]): string | undefined {
  const token = getCookie(event, SESSION_COOKIE)
  return token ?? undefined
}

export { SESSION_COOKIE }
