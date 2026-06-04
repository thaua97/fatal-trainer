import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { filterTrainers } from '#shared/domain/catalog/services/filter-trainers'
import { sortTrainers } from '#shared/domain/catalog/services/sort-trainers'
import type { PaginatedTrainersResponse } from '#shared/types/api'
import { generateMockTrainers } from '../mocks/trainer-factory'

let cachedTrainers: PersonalTrainer[] | null = null

function loadTrainers(): PersonalTrainer[] {
  if (cachedTrainers) {
    return cachedTrainers
  }

  const filePath = join(process.cwd(), 'server/data/personal-trainers.json')
  const raw = readFileSync(filePath, 'utf-8')
  const fromFile = JSON.parse(raw) as PersonalTrainer[]

  if (fromFile.length > 0) {
    cachedTrainers = fromFile
    return cachedTrainers
  }

  if (import.meta.dev || import.meta.env.VITEST) {
    cachedTrainers = generateMockTrainers(36)
    return cachedTrainers
  }

  cachedTrainers = []
  return cachedTrainers
}

export function findAllTrainers(query: ListQuery): PaginatedTrainersResponse {
  const trainers = loadTrainers()
  const filtered = filterTrainers(trainers, query.search)
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

export function findFeaturedTrainers(limit = 6): PersonalTrainer[] {
  return loadTrainers()
    .filter((trainer) => trainer.featured === true)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit)
}
