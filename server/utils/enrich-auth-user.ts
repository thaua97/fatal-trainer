import type { AuthUser } from '#shared/domain/auth/entities/user'
import { findTrainerByUserId } from '../services/trainer-repository'

export function enrichAuthUser(user: AuthUser): AuthUser {
  const trainer = findTrainerByUserId(user.id)

  if (!trainer?.photoUrl) {
    return user
  }

  return {
    ...user,
    avatarUrl: trainer.photoUrl,
  }
}
