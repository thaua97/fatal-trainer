import type { PersonalTrainer } from '../../shared/domain/catalog/entities/personal-trainer'
import { getMockAvatarUrl } from '../../server/mocks/mock-photos'

export function mockTrainer(overrides: Partial<PersonalTrainer> = {}): PersonalTrainer {
  return {
    id: '1',
    name: 'Ana Silva',
    profession: 'Personal Trainer — Funcional',
    description: 'Especialista em treino funcional.',
    photoUrl: getMockAvatarUrl(0),
    servicePrice: 120,
    rating: 4.8,
    reviewCount: 42,
    modalities: ['presencial', 'online'],
    specialties: ['Funcional'],
    distanceKm: 2.3,
    ...overrides,
  }
}

export function mockPromoTrainer(overrides: Partial<PersonalTrainer> = {}): PersonalTrainer {
  const servicePrice = overrides.servicePrice ?? 200

  return mockTrainer({
    servicePrice,
    promotion: {
      promoPrice: Math.round(servicePrice * 0.75),
      label: 'Primeira sessão',
      endsAt: '2026-06-30',
    },
    ...overrides,
  })
}
