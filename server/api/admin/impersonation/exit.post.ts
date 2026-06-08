import { throwValidationError } from '../../../utils/api-error'
import { exitImpersonation } from '../../../mocks/mock-admin-store'

export default defineEventHandler((event) => {
  const success = exitImpersonation(event)
  if (!success) {
    throwValidationError({ impersonation: 'notActive' })
  }
  return { success: true }
})
