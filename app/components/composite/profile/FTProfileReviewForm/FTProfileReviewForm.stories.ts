import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileReviewForm from './FTProfileReviewForm.vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const trainer: PersonalTrainer = {
  id: 'trainer-001',
  userId: 'owner-id',
  name: 'Ana Silva',
  profession: 'Personal Trainer — Funcional',
  description: 'Personal dedicado a resultados sustentáveis.',
  photoUrl: 'https://images.pexels.com/photos/3757942/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=400',
  servicePrice: 120,
  rating: 4.8,
  reviewCount: 12,
}

const meta: Meta<typeof FTProfileReviewForm> = {
  title: 'Composite/Profile/FTProfileReviewForm',
  component: FTProfileReviewForm,
  args: { trainer },
}

export default meta
type Story = StoryObj<typeof FTProfileReviewForm>

export const Guest: Story = {}
