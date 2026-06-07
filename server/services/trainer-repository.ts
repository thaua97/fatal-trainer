import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerInfoPayload, TrainerPromotionPayload } from '#shared/domain/catalog/entities/trainer-profile-payloads'
import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { computeDiscountPercent, computePromoPrice } from '#shared/domain/catalog/services/trainer-pricing'
import { filterTrainers } from '#shared/domain/catalog/services/filter-trainers'
import { sortTrainers } from '#shared/domain/catalog/services/sort-trainers'
import type { PaginatedTrainersResponse } from '#shared/types/api'
import { generateMockTrainers } from '../mocks/trainer-factory'
import { getMockAvatarUrl } from '../mocks/mock-photos'

const TRAINERS_FILE = join(process.cwd(), 'server/data/personal-trainers.json')

let cachedTrainers: PersonalTrainer[] | null = null
let persistedToDisk = false

function loadTrainersFromFile(): PersonalTrainer[] {
  if (!existsSync(TRAINERS_FILE)) {
    return []
  }

  const raw = readFileSync(TRAINERS_FILE, 'utf-8')
  return JSON.parse(raw) as PersonalTrainer[]
}

function loadTrainers(): PersonalTrainer[] {
  if (cachedTrainers) {
    return cachedTrainers
  }

  const fromFile = loadTrainersFromFile()

  if (fromFile.length > 0) {
    cachedTrainers = fromFile
    persistedToDisk = true
    return cachedTrainers
  }

  if (import.meta.dev || import.meta.env.VITEST) {
    cachedTrainers = generateMockTrainers(36)
    return cachedTrainers
  }

  cachedTrainers = []
  return cachedTrainers
}

function saveTrainers(trainers: PersonalTrainer[]): void {
  if (!persistedToDisk && cachedTrainers && cachedTrainers.length > 0) {
    writeFileSync(TRAINERS_FILE, `${JSON.stringify(cachedTrainers, null, 2)}\n`, 'utf-8')
    persistedToDisk = true
  }

  writeFileSync(TRAINERS_FILE, `${JSON.stringify(trainers, null, 2)}\n`, 'utf-8')
  cachedTrainers = trainers
  persistedToDisk = true
}

function padTrainerId(index: number): string {
  return `trainer-${String(index + 1).padStart(3, '0')}`
}

function nextTrainerId(trainers: PersonalTrainer[]): string {
  const numericIds = trainers
    .map((trainer) => {
      const match = /^trainer-(\d+)$/.exec(trainer.id)
      return match ? Number(match[1]) : 0
    })
    .filter((value) => value > 0)

  const next = numericIds.length > 0 ? Math.max(...numericIds) + 1 : trainers.length + 1
  return padTrainerId(next - 1)
}

export function findAllTrainers(query: ListQuery): PaginatedTrainersResponse {
  const trainers = loadTrainers()
  const filtered = filterTrainers(trainers, {
    search: query.search,
    specialties: query.specialties,
    modalities: query.modalities,
    onPromotion: query.onPromotion,
    city: query.city,
  })
  const sorted = sortTrainers(filtered, query.sortBy, query.sortOrder)

  const start = (query.page - 1) * query.pageSize
  const items = sorted.slice(start, start + query.pageSize)

  return {
    items,
    total: sorted.length,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export function findTrainerById(id: string): PersonalTrainer | undefined {
  return loadTrainers().find((trainer) => trainer.id === id)
}

export function findTrainersByIds(
  ids: string[],
  page: number,
  pageSize: number,
): PaginatedTrainersResponse {
  const uniqueIds = [...new Set(ids)]
  const trainers = loadTrainers().filter((trainer) => uniqueIds.includes(trainer.id))
  const start = (page - 1) * pageSize
  const items = trainers.slice(start, start + pageSize)

  return {
    items,
    total: trainers.length,
    page,
    pageSize,
  }
}

export function findTrainerByUserId(userId: string): PersonalTrainer | undefined {
  return loadTrainers().find((trainer) => trainer.userId === userId)
}

export function findFeaturedTrainers(limit = 6): PersonalTrainer[] {
  return loadTrainers()
    .filter((trainer) => trainer.featured === true)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit)
}

export function createTrainerForUser(user: AuthUser): PersonalTrainer {
  const trainers = loadTrainers()
  const id = nextTrainerId(trainers)

  const trainer: PersonalTrainer = {
    id,
    userId: user.id,
    name: user.name,
    profession: 'Personal Trainer',
    description: 'Complete seu perfil para aparecer no catálogo com mais detalhes.',
    photoUrl: getMockAvatarUrl(trainers.length),
    servicePrice: 100,
    contactPhone: user.phoneNumber ?? '',
    city: '',
    state: '',
    specialties: [],
    modalities: [],
    cref: '',
    gallery: [],
    availability: '',
    experienceYears: 0,
    reviews: [],
    featured: false,
  }

  const updated = [...trainers, trainer]
  saveTrainers(updated)
  return trainer
}

export function getOrCreateTrainerForUser(user: AuthUser): { trainer: PersonalTrainer, created: boolean } {
  const existing = findTrainerByUserId(user.id)
  if (existing) {
    return { trainer: existing, created: false }
  }

  return { trainer: createTrainerForUser(user), created: true }
}

function buildPromotionFromPayload(
  payload: TrainerPromotionPayload,
  servicePrice: number,
  existing?: PersonalTrainer['promotion'],
): PersonalTrainer['promotion'] | undefined {
  if (!payload.active) {
    return undefined
  }

  return {
    discountPercent: payload.discountPercent,
    promoPrice: computePromoPrice(servicePrice, payload.discountPercent),
    label: payload.label.trim(),
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    maxRedemptions: payload.maxRedemptions ?? undefined,
    redemptionCount: existing?.redemptionCount ?? 0,
  }
}

export function updateTrainerInfo(trainerId: string, payload: TrainerInfoPayload): PersonalTrainer {
  const trainers = loadTrainers()
  const index = trainers.findIndex((trainer) => trainer.id === trainerId)

  if (index === -1) {
    throw new Error('Trainer not found')
  }

  const current = trainers[index]!
  const updated: PersonalTrainer = {
    ...current,
    name: payload.name.trim(),
    contactPhone: payload.contactPhone.trim(),
    profession: payload.profession.trim(),
    description: payload.description.trim(),
    specialties: [...payload.specialties],
    modalities: [...payload.modalities],
    city: payload.city.trim(),
    state: payload.state.trim().toUpperCase(),
    servicePrice: payload.servicePrice,
    cref: payload.cref.trim(),
    availability: payload.availability.trim(),
    experienceYears: payload.experienceYears,
    promotion: current.promotion
      ? (() => {
          const percent = current.promotion.discountPercent
            ?? computeDiscountPercent(current.servicePrice, current.promotion.promoPrice)
            ?? 15
          return {
            ...current.promotion,
            discountPercent: percent,
            promoPrice: computePromoPrice(payload.servicePrice, percent),
          }
        })()
      : undefined,
  }

  const next = [...trainers]
  next[index] = updated
  saveTrainers(next)
  return updated
}

export function updateTrainerPromotion(
  trainerId: string,
  payload: TrainerPromotionPayload,
): PersonalTrainer {
  const trainers = loadTrainers()
  const index = trainers.findIndex((trainer) => trainer.id === trainerId)

  if (index === -1) {
    throw new Error('Trainer not found')
  }

  const current = trainers[index]!
  const updated: PersonalTrainer = {
    ...current,
    promotion: buildPromotionFromPayload(payload, current.servicePrice, current.promotion),
  }

  const next = [...trainers]
  next[index] = updated
  saveTrainers(next)
  return updated
}

export function addGalleryImage(trainerId: string, imageUrl: string): PersonalTrainer {
  const trainers = loadTrainers()
  const index = trainers.findIndex((trainer) => trainer.id === trainerId)

  if (index === -1) {
    throw new Error('Trainer not found')
  }

  const current = trainers[index]!
  const gallery = [...(current.gallery ?? []), imageUrl]
  const photoUrl = current.photoUrl || imageUrl

  const updated: PersonalTrainer = {
    ...current,
    gallery,
    photoUrl,
  }

  const next = [...trainers]
  next[index] = updated
  saveTrainers(next)
  return updated
}

export function removeGalleryImage(trainerId: string, imageIndex: number): PersonalTrainer {
  const trainers = loadTrainers()
  const index = trainers.findIndex((trainer) => trainer.id === trainerId)

  if (index === -1) {
    throw new Error('Trainer not found')
  }

  const current = trainers[index]!
  const gallery = [...(current.gallery ?? [])]

  if (imageIndex < 0 || imageIndex >= gallery.length) {
    throw new Error('Image not found')
  }

  const [removedUrl] = gallery.splice(imageIndex, 1)

  if (removedUrl?.startsWith('/uploads/')) {
    const filePath = join(process.cwd(), 'public', removedUrl)
    if (existsSync(filePath)) {
      unlinkSync(filePath)
    }
  }

  const photoUrl = current.photoUrl === removedUrl
    ? (gallery[0] ?? getMockAvatarUrl(index))
    : current.photoUrl

  const updated: PersonalTrainer = {
    ...current,
    gallery,
    photoUrl,
  }

  const next = [...trainers]
  next[index] = updated
  saveTrainers(next)
  return updated
}

export function setTrainerCoverPhoto(trainerId: string, imageUrl: string): PersonalTrainer {
  const trainers = loadTrainers()
  const index = trainers.findIndex((trainer) => trainer.id === trainerId)

  if (index === -1) {
    throw new Error('Trainer not found')
  }

  const current = trainers[index]!
  const gallery = current.gallery ?? []

  if (!gallery.includes(imageUrl)) {
    throw new Error('Image not in gallery')
  }

  const updated: PersonalTrainer = {
    ...current,
    photoUrl: imageUrl,
  }

  const next = [...trainers]
  next[index] = updated
  saveTrainers(next)
  return updated
}

export function ensureTrainerUploadDir(trainerId: string): string {
  const dir = join(process.cwd(), 'public', 'uploads', 'trainers', trainerId)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

export function resetTrainerCacheForTests(): void {
  cachedTrainers = null
  persistedToDisk = false
}
