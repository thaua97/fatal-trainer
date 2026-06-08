import { randomUUID } from 'node:crypto'
import type { TrainerReviewItem } from '#shared/types/api'
import { findTrainerById, updateTrainerReviewAggregates } from '../services/trainer-repository'

interface StoredReview extends TrainerReviewItem {
  trainerId: string
  userId: string
}

const reviews = new Map<string, StoredReview>()
const initializedTrainers = new Set<string>()

function reviewKey(trainerId: string, userId: string): string {
  return `${trainerId}:${userId}`
}

function seedFromTrainerJson(trainerId: string): void {
  if (initializedTrainers.has(trainerId)) {
    return
  }

  initializedTrainers.add(trainerId)

  const trainer = findTrainerById(trainerId)
  if (!trainer?.reviews?.length) {
    return
  }

  const now = new Date().toISOString()

  for (const [index, review] of trainer.reviews.entries()) {
    const id = review.id ?? randomUUID()
    const stored: StoredReview = {
      id,
      trainerId,
      userId: `seed-user-${trainerId}-${index}`,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt ?? now,
      updatedAt: review.updatedAt,
    }
    reviews.set(reviewKey(trainerId, stored.userId), stored)
  }

  recalculateAggregates(trainerId)
}

function recalculateAggregates(trainerId: string): void {
  const trainerReviews = [...reviews.values()].filter((review) => review.trainerId === trainerId)

  if (!trainerReviews.length) {
    updateTrainerReviewAggregates(trainerId, undefined, 0)
    return
  }

  const totalRating = trainerReviews.reduce((sum, review) => sum + review.rating, 0)
  const average = Math.round((totalRating / trainerReviews.length) * 10) / 10
  updateTrainerReviewAggregates(trainerId, average, trainerReviews.length)
}

function toPublicReview(review: StoredReview): TrainerReviewItem {
  return {
    id: review.id,
    author: review.author,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }
}

export function listTrainerReviews(
  trainerId: string,
  page: number,
  pageSize: number,
): { items: TrainerReviewItem[]; total: number; page: number; pageSize: number } {
  seedFromTrainerJson(trainerId)

  const trainerReviews = [...reviews.values()]
    .filter((review) => review.trainerId === trainerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const safePage = page > 0 ? page : 1
  const safePageSize = pageSize > 0 ? pageSize : 10
  const start = (safePage - 1) * safePageSize

  return {
    items: trainerReviews.slice(start, start + safePageSize).map(toPublicReview),
    total: trainerReviews.length,
    page: safePage,
    pageSize: safePageSize,
  }
}

export function findMyTrainerReview(
  trainerId: string,
  userId: string,
): TrainerReviewItem | null {
  seedFromTrainerJson(trainerId)

  const review = reviews.get(reviewKey(trainerId, userId))
  return review ? toPublicReview(review) : null
}

export function upsertTrainerReview(
  trainerId: string,
  userId: string,
  author: string,
  payload: { rating: number; comment: string },
): { review: TrainerReviewItem; created: boolean } {
  seedFromTrainerJson(trainerId)

  const key = reviewKey(trainerId, userId)
  const existing = reviews.get(key)
  const now = new Date().toISOString()

  if (existing) {
    const updated: StoredReview = {
      ...existing,
      rating: payload.rating,
      comment: payload.comment,
      author,
      updatedAt: now,
    }
    reviews.set(key, updated)
    recalculateAggregates(trainerId)
    return { review: toPublicReview(updated), created: false }
  }

  const created: StoredReview = {
    id: randomUUID(),
    trainerId,
    userId,
    author,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: now,
  }
  reviews.set(key, created)
  recalculateAggregates(trainerId)
  return { review: toPublicReview(created), created: true }
}

export function resetReviewsStore(): void {
  reviews.clear()
  initializedTrainers.clear()
}
