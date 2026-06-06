import { getOrCreateTrainerForUser } from '../../services/trainer-repository'
import { requireTrainerSession } from '../../utils/require-trainer-session'

export default defineEventHandler((event) => {
  const user = requireTrainerSession(event)
  const { trainer, created } = getOrCreateTrainerForUser(user)

  return {
    trainer,
    created,
  }
})
