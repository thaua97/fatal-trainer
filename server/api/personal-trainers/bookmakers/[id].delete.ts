import { removeBookmaker } from '../../../mocks/mock-bookmakers-store'
import { requireUserSession } from '../../../utils/require-user-session'

export default defineEventHandler((event) => {
  const user = requireUserSession(event)
  const trainerId = getRouterParam(event, 'id')

  if (!trainerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Trainer id is required',
    })
  }

  removeBookmaker(user.id, trainerId)

  return { ok: true }
})
