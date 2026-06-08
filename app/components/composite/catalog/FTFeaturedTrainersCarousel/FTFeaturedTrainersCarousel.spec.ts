import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import FTFeaturedTrainersCarousel from './FTFeaturedTrainersCarousel.vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

import { useFTFeaturedTrainersCarousel } from '../../../../composables/components/useFTFeaturedTrainersCarousel'

const mockTrainers: PersonalTrainer[] = [
  {
    id: 'trainer-001',
    name: 'Ana Silva',
    profession: 'Personal Trainer — Funcional',
    description: 'Personal dedicado a resultados sustentáveis.',
    photoUrl: 'https://example.com/photo.jpg',
    servicePrice: 120,
    featured: true,
  },
  {
    id: 'trainer-002',
    name: 'Bruno Costa',
    profession: 'Personal Trainer — HIIT',
    description: 'Especialista em treinos de alta intensidade.',
    photoUrl: 'https://example.com/photo2.jpg',
    servicePrice: 95,
    featured: true,
  },
]

const carouselStubs = {
  FTSectionHeading: {
    props: ['spacing'],
    template: '<h2 data-testid="featured-trainers-heading"><slot /></h2>',
  },
  USkeleton: { template: '<span class="u-skeleton-stub" />' },
  UCarousel: {
    props: ['items'],
    template: `
      <div data-testid="u-carousel-stub">
        <div v-for="item in items" :key="item.id">
          <slot :item="item" />
        </div>
      </div>
    `,
  },
  FTFeaturedTrainerCard: {
    props: ['trainer'],
    template: '<div data-testid="featured-trainer-card">{{ trainer.name }}</div>',
  },
}

vi.mock('../../../../composables/components/useFTFeaturedTrainersCarousel', () => ({
  useFTFeaturedTrainersCarousel: vi.fn(),
}))

const mockedUseCarousel = vi.mocked(useFTFeaturedTrainersCarousel)

describe('FTFeaturedTrainersCarousel', () => {
  it('shows loading skeleton while loading', () => {
    mockedUseCarousel.mockReturnValue({
      trainers: ref([]),
      mode: ref('featured'),
      isLoading: ref(true),
      isEmpty: ref(false),
      hasError: ref(false),
      shouldShow: ref(true),
      sectionTitleKey: ref('catalog.featuredTitle'),
      sectionTitle: ref('Em destaque'),
    })

    const wrapper = mount(FTFeaturedTrainersCarousel, {
      global: { stubs: carouselStubs },
    })

    expect(wrapper.find('[data-testid="featured-trainers-loading"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="featured-trainers-heading"]').text()).toBe('Em destaque')
  })

  it('hides when shouldShow is false', () => {
    mockedUseCarousel.mockReturnValue({
      trainers: ref([]),
      mode: ref('hidden'),
      isLoading: ref(false),
      isEmpty: ref(true),
      hasError: ref(false),
      shouldShow: ref(false),
      sectionTitleKey: ref('catalog.featuredTitle'),
      sectionTitle: ref('Em destaque'),
    })

    const wrapper = mount(FTFeaturedTrainersCarousel, {
      global: { stubs: carouselStubs },
    })

    expect(wrapper.find('[data-testid="featured-trainers-carousel"]').exists()).toBe(false)
  })

  it('renders one card per featured trainer with featured title', () => {
    mockedUseCarousel.mockReturnValue({
      trainers: ref(mockTrainers),
      mode: ref('featured'),
      isLoading: ref(false),
      isEmpty: ref(false),
      hasError: ref(false),
      shouldShow: ref(true),
      sectionTitleKey: ref('catalog.featuredTitle'),
      sectionTitle: ref('Em destaque'),
    })

    const wrapper = mount(FTFeaturedTrainersCarousel, {
      global: { stubs: carouselStubs },
    })

    expect(wrapper.find('[data-testid="featured-trainers-heading"]').text()).toBe('Em destaque')
    expect(wrapper.findAll('[data-testid="featured-trainer-card"]')).toHaveLength(2)
  })

  it('shows recommended title in fallback mode', () => {
    mockedUseCarousel.mockReturnValue({
      trainers: ref(mockTrainers),
      mode: ref('recommended'),
      isLoading: ref(false),
      isEmpty: ref(false),
      hasError: ref(false),
      shouldShow: ref(true),
      sectionTitleKey: ref('catalog.recommendedTitle'),
      sectionTitle: ref('Recomendados'),
    })

    const wrapper = mount(FTFeaturedTrainersCarousel, {
      global: { stubs: carouselStubs },
    })

    expect(wrapper.find('[data-testid="featured-trainers-heading"]').text()).toBe('Recomendados')
  })
})
