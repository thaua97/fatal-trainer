import type { BookmakersSyncRequest, BookmakersSyncResponse } from '#shared/types/api'
import { setBookmakers } from '../../mocks/mock-bookmakers-store'
import { requireUserSession } from '../../utils/require-user-session'

export default defineEventHandler(async (event): Promise<BookmakersSyncResponse> => {
  const user = requireUserSession(event)
  const body = await readBody<BookmakersSyncRequest>(event)
  const trainerIds = Array.isArray(body?.trainerIds) ? body.trainerIds : []

  setBookmakers(user.id, trainerIds)

  return { synced: trainerIds.length }
})
