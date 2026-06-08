import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { findTrainerByUserId } from '../services/trainer-repository'

export function enrichAuthUser(user: AuthUser): AuthUser {
  const trainer = findTrainerByUserId(user.id)

  return enrichAuthUserWithTrainer(user, trainer)
}

export function enrichAuthUserWithTrainer(
  user: AuthUser,
  trainer?: PersonalTrainer,
): AuthUser {
  if (!trainer) {
    return user
  }

  return {
    ...user,
    phoneNumber: user.phoneNumber || trainer.contactPhone || undefined,
    avatarUrl: user.avatarUrl || trainer.photoUrl || undefined,
    city: user.city || trainer.city || undefined,
    state: user.state || trainer.state || undefined,
  }
}
