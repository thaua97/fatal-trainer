import type { Meta, StoryObj } from '@storybook/vue3'
import FTFeaturedTrainerCard from './FTFeaturedTrainerCard.vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const baseTrainer: PersonalTrainer = {
  id: 'trainer-001',
  name: 'Ana Silva',
  profession: 'Personal Trainer — Funcional',
  description: 'Personal dedicado a resultados sustentáveis, com foco em técnica e progressão de carga.',
  photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop',
  servicePrice: 120,
  rating: 4.8,
  reviewCount: 127,
  specialties: ['Funcional'],
  reviews: [
    { author: 'Maria Santos', rating: 5, comment: 'Excelente profissional!' },
    { author: 'João Lima', rating: 4, comment: 'Muito atencioso.' },
    { author: 'Carla Mendes', rating: 5, comment: 'Recomendo.' },
  ],
}

const meta: Meta<typeof FTFeaturedTrainerCard> = {
  title: 'UI/FTFeaturedTrainerCard',
  component: FTFeaturedTrainerCard,
  tags: ['autodocs'],
  args: {
    activeIndex: 0,
    slideCount: 6,
  },
}

export default meta
type Story = StoryObj<typeof FTFeaturedTrainerCard>

export const Default: Story = {
  args: {
    trainer: baseTrainer,
  },
}

export const LongText: Story = {
  args: {
    trainer: {
      ...baseTrainer,
      description: 'Treinos personalizados para emagrecimento, hipertrofia e condicionamento com acompanhamento contínuo e metas realistas para o seu dia a dia.',
    },
  },
}

export const WithoutReviews: Story = {
  args: {
    trainer: {
      ...baseTrainer,
      reviews: undefined,
      reviewCount: undefined,
      rating: 4.5,
    },
  },
}

export const WithPromotion: Story = {
  args: {
    trainer: {
      ...baseTrainer,
      servicePrice: 200,
      promotion: {
        promoPrice: 150,
        label: 'Primeira sessão',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Preço promocional em verde claro sobre o gradiente do card.',
      },
    },
  },
}
