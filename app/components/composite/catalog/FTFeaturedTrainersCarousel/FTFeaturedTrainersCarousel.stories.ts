import type { Meta, StoryObj } from '@storybook/vue3'
import FTFeaturedTrainerCard from '../../../ui/FTFeaturedTrainerCard/FTFeaturedTrainerCard.vue'
import FTFeaturedTrainersCarousel from './FTFeaturedTrainersCarousel.vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const trainers: PersonalTrainer[] = [
  {
    id: 'trainer-001',
    name: 'Ana Silva',
    profession: 'Personal Trainer — Funcional',
    description: 'Personal dedicado a resultados sustentáveis, com foco em técnica.',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop',
    servicePrice: 120,
    rating: 4.8,
    reviewCount: 127,
    specialties: ['Funcional'],
    featured: true,
    reviews: [{ author: 'Maria', rating: 5, comment: 'Ótima!' }],
  },
  {
    id: 'trainer-003',
    name: 'Carla Mendes',
    profession: 'Personal Trainer — HIIT',
    description: 'Treinos intensos para quem busca condicionamento e definição.',
    photoUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop',
    servicePrice: 110,
    rating: 4.9,
    reviewCount: 89,
    specialties: ['HIIT'],
    featured: true,
    reviews: [{ author: 'Paulo', rating: 5, comment: 'Excelente!' }],
  },
]

const meta: Meta<typeof FTFeaturedTrainersCarousel> = {
  title: 'Composite/Catalog/FTFeaturedTrainersCarousel',
  component: FTFeaturedTrainersCarousel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTFeaturedTrainersCarousel>

export const Default: Story = {}

export const Loading: Story = {
  render: () => ({
    components: { FTFeaturedTrainersCarousel },
    template: `
      <div
        class="relative aspect-4/5 max-h-[420px] w-full overflow-hidden rounded-3xl [&_.animate-pulse]:bg-white/25!"
        style="background: linear-gradient(135deg, rgb(var(--ft-primary-rgb) / 0.96) 0%, rgb(167 139 250 / 0.92) 42%, rgb(56 189 248 / 0.88) 100%)"
        data-testid="featured-trainers-loading"
      >
        <div class="relative flex h-full flex-col justify-between p-6">
          <div class="h-5 w-32 animate-pulse rounded bg-white/25" />
          <div class="h-14 w-14 animate-pulse rounded-full bg-white/25" />
        </div>
      </div>
    `,
  }),
}

export const SingleSlide: Story = {
  render: () => ({
    components: { FTFeaturedTrainerCard },
    setup() {
      return { trainer: trainers[0] }
    },
    template: `
      <FTFeaturedTrainerCard
        :trainer="trainer"
        :active-index="0"
        :slide-count="1"
      />
    `,
  }),
}

export const MockCarousel: Story = {
  render: () => ({
    components: { FTFeaturedTrainerCard },
    setup() {
      return { trainers, activeIndex: 0 }
    },
    template: `
      <div class="space-y-4">
        <FTFeaturedTrainerCard
          v-for="(trainer, index) in trainers"
          :key="trainer.id"
          :trainer="trainer"
          :active-index="activeIndex"
          :slide-count="trainers.length"
        />
      </div>
    `,
  }),
}
