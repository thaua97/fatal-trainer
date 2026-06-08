import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileReviewForm from './FTProfileReviewForm.vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const trainer: PersonalTrainer = {
  id: 'trainer-001',
  userId: 'owner-id',
  name: 'Ana Silva',
  profession: 'Personal Trainer',
  description: 'Desc',
  photoUrl: '/photo.jpg',
  servicePrice: 100,
}

vi.mock('~/composables/components/useFTProfileReviewForm', () => ({
  useFTProfileReviewForm: () => ({
    form: ref({ rating: 0, comment: '' }),
    pending: ref(false),
    loadingMine: ref(false),
    isEditing: ref(false),
    mineReviewId: ref(null),
    showForm: ref(false),
    showFormFields: ref(false),
    showGuestCta: ref(true),
    loginRoute: { path: '/login', query: { redirect: '/personal-trainers/trainer-001' } },
    submitLabel: ref('Publicar avaliação'),
    handleSubmit: vi.fn(),
    startEditing: vi.fn(),
    cancelEditing: vi.fn(),
  }),
}))

describe('FTProfileReviewForm', () => {
  it('shows login CTA for guests', () => {
    const wrapper = mountFT(FTProfileReviewForm, {
      props: { trainer },
    })

    expect(wrapper.find('[data-testid="profile-review-guest"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-review-login"]').exists()).toBe(true)
  })
})
