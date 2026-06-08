import { listPromotionTemplates } from '../mocks/mock-promotion-templates'
import { requireTrainerSession } from '../utils/require-trainer-session'

export default defineEventHandler((event) => {
  requireTrainerSession(event)
  return { items: listPromotionTemplates() }
})
