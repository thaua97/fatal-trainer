import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTFeaturedTrainerCard from './FTFeaturedTrainerCard.vue'
import FTCarouselDots from '../FTCarouselDots/FTCarouselDots.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const linkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

describe('FTFeaturedTrainerCard', () => {
  it('renders trainer name and links to profile', () => {
    const trainer = mockTrainer({ id: 'trainer-001' })
    const wrapper = mountFT(FTFeaturedTrainerCard, {
      props: {
        trainer,
        activeIndex: 0,
        slideCount: 3,
      },
      global: {
        stubs: {
          NuxtLink: linkStub,
          UIcon: true,
          FTCarouselDots: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Ana Silva')
    expect(wrapper.find('[data-testid="featured-trainer-cta"]').attributes('href'))
      .toBe('/personal-trainers/trainer-001')
  })

  it('renders promotional pricing when available', () => {
    const wrapper = mountFT(FTFeaturedTrainerCard, {
      props: {
        trainer: mockPromoTrainer({ id: 'trainer-001', servicePrice: 200 }),
        activeIndex: 0,
        slideCount: 3,
      },
      global: {
        stubs: {
          NuxtLink: linkStub,
          UIcon: true,
          FTCarouselDots: true,
        },
      },
    })

    expect(wrapper.text()).toMatch(/R\$/)
    expect(wrapper.find('.line-through').exists()).toBe(true)
  })

  it('emits dotSelect when a dot is clicked', async () => {
    const wrapper = mountFT(FTFeaturedTrainerCard, {
      props: {
        trainer: mockTrainer({ id: 'trainer-001' }),
        activeIndex: 0,
        slideCount: 3,
      },
      global: {
        components: { FTCarouselDots },
        stubs: {
          NuxtLink: linkStub,
          UIcon: true,
        },
      },
    })

    await wrapper.findComponent(FTCarouselDots).vm.$emit('select', 1)

    expect(wrapper.emitted('dotSelect')?.[0]).toEqual([1])
  })
})
