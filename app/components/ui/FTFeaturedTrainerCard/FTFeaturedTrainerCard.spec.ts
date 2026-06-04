import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FTFeaturedTrainerCard from './FTFeaturedTrainerCard.vue'
import FTCarouselDots from '../FTCarouselDots/FTCarouselDots.vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const mockTrainer: PersonalTrainer = {
  id: 'trainer-001',
  name: 'Ana Silva',
  profession: 'Personal Trainer — Funcional',
  description: 'Personal dedicado a resultados sustentáveis, com foco em técnica.',
  photoUrl: 'https://example.com/photo.jpg',
  servicePrice: 120,
  rating: 4.8,
  reviewCount: 127,
  specialties: ['Funcional'],
  reviews: [
    { author: 'Maria', rating: 5, comment: 'Ótima!' },
    { author: 'João', rating: 4, comment: 'Recomendo.' },
  ],
}

describe('FTFeaturedTrainerCard', () => {
  it('renders trainer name and links to profile', () => {
    const wrapper = mount(FTFeaturedTrainerCard, {
      props: {
        trainer: mockTrainer,
        activeIndex: 0,
        slideCount: 3,
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
          UIcon: true,
          FTCarouselDots: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Ana Silva')
    expect(wrapper.find('[data-testid="featured-trainer-cta"]').attributes('href'))
      .toBe('/personal-trainers/trainer-001')
  })

  it('emits dotSelect when a dot is clicked', async () => {
    const wrapper = mount(FTFeaturedTrainerCard, {
      props: {
        trainer: mockTrainer,
        activeIndex: 0,
        slideCount: 3,
      },
      global: {
        components: { FTCarouselDots },
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
          UIcon: true,
        },
      },
    })

    await wrapper.findComponent(FTCarouselDots).vm.$emit('select', 1)

    expect(wrapper.emitted('dotSelect')?.[0]).toEqual([1])
  })
})
