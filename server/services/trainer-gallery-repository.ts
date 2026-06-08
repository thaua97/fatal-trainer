import { existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { getMockAvatarUrl } from '../mocks/mock-photos'
import { mutateTrainer } from './trainer-repository-mutations'

export function addGalleryImage(trainerId: string, imageUrl: string): PersonalTrainer {
  return mutateTrainer(trainerId, (current) => {
    const gallery = [...(current.gallery ?? []), imageUrl]
    const photoUrl = current.photoUrl || imageUrl

    return {
      ...current,
      gallery,
      photoUrl,
    }
  })
}

export function removeGalleryImage(trainerId: string, imageIndex: number): PersonalTrainer {
  return mutateTrainer(trainerId, (current) => {
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
      ? (gallery[0] ?? getMockAvatarUrl(imageIndex))
      : current.photoUrl

    return {
      ...current,
      gallery,
      photoUrl,
    }
  })
}

export function setTrainerCoverPhoto(trainerId: string, imageUrl: string): PersonalTrainer {
  return mutateTrainer(trainerId, (current) => {
    const gallery = current.gallery ?? []

    if (!gallery.includes(imageUrl)) {
      throw new Error('Image not in gallery')
    }

    return {
      ...current,
      photoUrl: imageUrl,
    }
  })
}

export function updateTrainerReviewAggregates(
  trainerId: string,
  rating: number | undefined,
  reviewCount: number,
): PersonalTrainer | undefined {
  try {
    return mutateTrainer(trainerId, (current) => ({
      ...current,
      rating,
      reviewCount,
      reviews: undefined,
    }))
  } catch {
    return undefined
  }
}

export function ensureTrainerUploadDir(trainerId: string): string {
  const dir = join(process.cwd(), 'public', 'uploads', 'trainers', trainerId)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}
