import type {
  MyReviewResponse,
  PaginatedReviewsResponse,
  UpsertReviewRequest,
  UpsertReviewResponse,
} from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'

export interface ListReviewsQuery {
  page?: number
  pageSize?: number
}

export async function list(
  trainerId: string,
  query: ListReviewsQuery = {},
): Promise<PaginatedReviewsResponse> {
  return apiFetch(`/personal-trainers/${trainerId}/reviews`, {
    query: {
      page: query.page,
      pageSize: query.pageSize,
    },
  })
}

export async function getMine(trainerId: string): Promise<MyReviewResponse> {
  return apiFetch(`/personal-trainers/${trainerId}/reviews/mine`)
}

export async function upsert(
  trainerId: string,
  payload: UpsertReviewRequest,
): Promise<UpsertReviewResponse> {
  return apiFetch(`/personal-trainers/${trainerId}/reviews`, {
    method: 'POST',
    body: payload,
  })
}

export const reviewsService = {
  list,
  getMine,
  upsert,
}
