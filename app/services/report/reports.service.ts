import type { CreateReportRequest, CreateReportResponse } from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'

export async function create(payload: CreateReportRequest): Promise<CreateReportResponse> {
  return apiFetch('/reports', {
    method: 'POST',
    body: payload,
  })
}

export const reportsService = {
  create,
}
