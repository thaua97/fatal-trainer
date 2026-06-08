import type {
  BookmakersSyncRequest,
  BookmakersSyncResponse,
  PaginatedTrainersResponse,
} from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'

export interface FavoritesListParams {
  page?: number
  pageSize?: number
  ids?: string
}

export async function list(params: FavoritesListParams = {}): Promise<PaginatedTrainersResponse> {
  return apiFetch('/personal-trainers/bookmakers', {
    query: {
      page: params.page != null ? String(params.page) : undefined,
      pageSize: params.pageSize != null ? String(params.pageSize) : undefined,
      ids: params.ids || undefined,
    },
  })
}

export async function sync(payload: BookmakersSyncRequest): Promise<BookmakersSyncResponse> {
  return apiFetch('/personal-trainers/bookmakers', {
    method: 'POST',
    body: payload,
  })
}

export async function add(trainerId: string): Promise<void> {
  await apiFetch(`/personal-trainers/bookmakers/${trainerId}`, { method: 'POST' })
}

export async function remove(trainerId: string): Promise<void> {
  await apiFetch(`/personal-trainers/bookmakers/${trainerId}`, { method: 'DELETE' })
}

export const favoritesService = {
  list,
  sync,
  add,
  remove,
}
