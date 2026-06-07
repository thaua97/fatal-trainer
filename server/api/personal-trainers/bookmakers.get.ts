import type { PaginatedTrainersResponse } from '#shared/types/api'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'
import {
  getSessionTokenFromEvent,
  getSessionUser,
} from '../../mocks/mock-user-store'
import { getBookmakerIds } from '../../mocks/mock-bookmakers-store'
import { findTrainersByIds } from '../../services/trainer-repository'

function parseIdsParam(value: string | string[] | undefined): string[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => entry.split(',')).filter(Boolean)
  }

  return value.split(',').filter(Boolean)
}

function parsePage(value: string | string[] | undefined): number {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function parsePageSize(value: string | string[] | undefined): number {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIST_QUERY.pageSize
}

export default defineEventHandler((event): PaginatedTrainersResponse => {
  const queryParams = getQuery(event)
  const page = parsePage(queryParams.page)
  const pageSize = parsePageSize(queryParams.pageSize)

  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (user) {
    return findTrainersByIds(getBookmakerIds(user.id), page, pageSize)
  }

  return findTrainersByIds(parseIdsParam(queryParams.ids), page, pageSize)
})
