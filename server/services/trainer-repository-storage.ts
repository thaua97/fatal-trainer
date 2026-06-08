import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { generateMockTrainers } from '../mocks/trainer-factory'

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

export function loadTrainers(): PersonalTrainer[] {
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

export function saveTrainers(trainers: PersonalTrainer[]): void {
  if (!persistedToDisk && cachedTrainers && cachedTrainers.length > 0) {
    writeFileSync(TRAINERS_FILE, `${JSON.stringify(cachedTrainers, null, 2)}\n`, 'utf-8')
    persistedToDisk = true
  }

  writeFileSync(TRAINERS_FILE, `${JSON.stringify(trainers, null, 2)}\n`, 'utf-8')
  cachedTrainers = trainers
  persistedToDisk = true
}

export function resetTrainerCacheForTests(): void {
  cachedTrainers = null
  persistedToDisk = false
}
