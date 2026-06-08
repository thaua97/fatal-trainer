import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type {
  AdminUserActivityItem,
  AdminUserActivityListResponse,
  AdminUserActivityType,
} from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'
import { findUserByEmail } from './mock-user-store'
import { findTrainerByUserId } from '../services/trainer-repository'

const DATA_DIR = join(process.cwd(), 'server/data')
const ACTIVITY_FILE = join(DATA_DIR, 'user-activity.json')

let cachedActivity: AdminUserActivityItem[] | null = null
let persistedToDisk = false

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

function loadActivity(): AdminUserActivityItem[] {
  if (cachedActivity) {
    return cachedActivity
  }

  if (existsSync(ACTIVITY_FILE)) {
    const raw = readFileSync(ACTIVITY_FILE, 'utf-8')
    cachedActivity = JSON.parse(raw) as AdminUserActivityItem[]
    persistedToDisk = true
    return cachedActivity
  }

  cachedActivity = []
  return cachedActivity
}

function saveActivity(items: AdminUserActivityItem[]): void {
  ensureDataDir()
  writeFileSync(ACTIVITY_FILE, `${JSON.stringify(items, null, 2)}\n`, 'utf-8')
  cachedActivity = items
  persistedToDisk = true
}

export interface AppendActivityInput {
  userId: string
  type: AdminUserActivityType
  title: string
  description?: string
  actorId?: string
  actorName?: string
  actorRole?: UserRole
  changes?: AdminUserActivityItem['changes']
  metadata?: Record<string, string>
}

export function appendActivity(input: AppendActivityInput): AdminUserActivityItem {
  const items = loadActivity()
  const entry: AdminUserActivityItem = {
    id: randomUUID(),
    userId: input.userId,
    type: input.type,
    title: input.title,
    description: input.description,
    actorId: input.actorId,
    actorName: input.actorName,
    actorRole: input.actorRole,
    changes: input.changes,
    metadata: input.metadata,
    createdAt: new Date().toISOString(),
  }

  items.unshift(entry)
  saveActivity(items)
  return entry
}

export function listUserActivity(
  userId: string,
  page = 1,
  pageSize = 10,
): AdminUserActivityListResponse {
  const items = loadActivity().filter(item => item.userId === userId)
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

export function countUserActivity(userId: string): number {
  return loadActivity().filter(item => item.userId === userId).length
}

export function resetActivityStore(): void {
  cachedActivity = []
  persistedToDisk = false
  if (existsSync(ACTIVITY_FILE)) {
    writeFileSync(ACTIVITY_FILE, '[]\n', 'utf-8')
  }
}

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export function seedDevActivity(): void {
  if (loadActivity().length > 0) {
    return
  }

  const personal = findUserByEmail('personal@fataltrainer.com')
  const student = findUserByEmail('aluno@fataltrainer.com')
  const admin = findUserByEmail('admin@fataltrainer.com')

  if (!personal || !student) {
    return
  }

  const trainer = findTrainerByUserId(personal.id)
  const seedItems: AdminUserActivityItem[] = []

  const push = (input: Omit<AdminUserActivityItem, 'id' | 'createdAt'> & { createdAt?: string }) => {
    seedItems.push({
      ...input,
      id: randomUUID(),
      createdAt: input.createdAt ?? new Date().toISOString(),
    })
  }

  push({
    userId: personal.id,
    type: 'account_register',
    title: 'Conta criada',
    description: 'Cadastro realizado na plataforma',
    createdAt: daysAgo(30),
  })

  push({
    userId: personal.id,
    type: 'profile_info_edit',
    title: 'Perfil editado',
    actorId: personal.id,
    actorName: personal.name,
    actorRole: 'personal-trainer',
    changes: [
      { field: 'description', label: 'Descrição', before: 'Personal dedicado ao seu bem-estar.', after: trainer?.description ?? 'Descrição atualizada' },
      { field: 'servicePrice', label: 'Preço da sessão', before: 'R$ 80,00', after: trainer ? `R$ ${trainer.servicePrice.toFixed(2).replace('.', ',')}` : 'R$ 120,00' },
    ],
    createdAt: daysAgo(5),
  })

  push({
    userId: personal.id,
    type: 'account_login',
    title: 'Login realizado',
    actorId: personal.id,
    actorName: personal.name,
    actorRole: 'personal-trainer',
    createdAt: daysAgo(1),
  })

  if (admin) {
    push({
      userId: personal.id,
      type: 'admin_impersonation',
      title: 'Acesso como usuário',
      actorId: admin.id,
      actorName: admin.name,
      actorRole: 'admin',
      description: `${admin.name} acessou a conta deste usuário`,
      createdAt: daysAgo(2),
    })
  }

  push({
    userId: student.id,
    type: 'account_register',
    title: 'Conta criada',
    description: 'Cadastro realizado na plataforma',
    createdAt: daysAgo(20),
  })

  push({
    userId: student.id,
    type: 'account_login',
    title: 'Login realizado',
    actorId: student.id,
    actorName: student.name,
    actorRole: 'student',
    createdAt: daysAgo(0),
  })

  saveActivity(seedItems)
}

if (import.meta.dev || import.meta.env.VITEST) {
  seedDevActivity()
}
