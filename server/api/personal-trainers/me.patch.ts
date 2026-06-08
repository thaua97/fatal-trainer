import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import { findTrainerByUserId } from '../../services/trainer-repository'
import { requireTrainerSession } from '../../utils/require-trainer-session'
import {
  handleTrainerInfoUpdate,
  handleTrainerPromotionUpdate,
} from './me-patch-handlers'

export default defineEventHandler(async (event) => {
  const user = requireTrainerSession(event)
  const trainer = findTrainerByUserId(user.id)

  if (!trainer) {
    throwNotFound()
  }

  const body = await readBody<UpdateTrainerProfileRequest>(event)

  if (body.section === 'info') {
    return handleTrainerInfoUpdate(user, trainer, body)
  }

  if (body.section === 'promotion') {
    return handleTrainerPromotionUpdate(user, trainer, body)
  }

  throwValidationError({ section: 'invalid' })
})
