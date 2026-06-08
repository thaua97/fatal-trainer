import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import type {
  FeaturedTrainersResponse,
  PaginatedTrainersResponse,
  TrainerDetailResponse,
} from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'
import { listQueryToParams } from '~/services/catalog/list-query-params'

export async function list(query: Partial<ListQuery> = {}): Promise<PaginatedTrainersResponse> {
  return apiFetch('/personal-trainers', {
    query: listQueryToParams(query),
  })
}

export async function getById(id: string): Promise<TrainerDetailResponse> {
  return apiFetch(`/personal-trainers/${id}`)
}

export async function listFeatured(): Promise<FeaturedTrainersResponse> {
  return apiFetch('/personal-trainers/featured')
}

export const personalTrainersService = {
  list,
  getById,
  listFeatured,
}
