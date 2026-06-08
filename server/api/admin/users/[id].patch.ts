import { throwForbidden, throwNotFound, throwValidationError } from '../../../utils/api-error'
import type { UpdateAdminUserRequest } from '#shared/types/admin'
import { computeFieldChanges } from '#shared/domain/admin/services/compute-field-changes'
import { appendActivity } from '../../../mocks/mock-user-activity-store'
import { findUserById } from '../../../mocks/mock-user-store'
import {
  updateAdminUser,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../mocks/mock-admin-store'

const ADMIN_USER_FIELDS = ['name', 'email', 'role', 'isActive', 'phoneNumber']

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throwForbidden()
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  const body = await readBody<UpdateAdminUserRequest>(event)
  const existing = findUserById(id)

  if (!existing) {
    throwNotFound()
  }

  const beforeRecord: Record<string, unknown> = {
    name: existing.name,
    email: existing.email,
    role: existing.role,
    isActive: existing.isActive,
    phoneNumber: existing.phoneNumber ?? '',
  }

  const updated = updateAdminUser(id, body)

  if (!updated) {
    throwNotFound()
  }

  const afterRecord: Record<string, unknown> = {
    name: updated.name,
    email: updated.email,
    role: updated.role,
    isActive: updated.isActive,
    phoneNumber: updated.phoneNumber ?? '',
  }

  const changes = computeFieldChanges(beforeRecord, afterRecord, ADMIN_USER_FIELDS)

  if (changes.length > 0) {
    const isDeactivation = body.isActive === false && existing.isActive
    appendActivity({
      userId: id,
      type: isDeactivation ? 'account_deactivated' : 'admin_user_edit',
      title: isDeactivation ? 'Conta desativada' : 'Dados atualizados pelo admin',
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      changes,
    })
  }

  return { user: updated }
})
