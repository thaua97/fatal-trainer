import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTTrainerCard from './FTTrainerCard.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

describe('FTTrainerCard', () => {
  it('renders semantic structure with ui primitives', () => {
    const trainer = mockTrainer()
    const wrapper = mountFT(FTTrainerCard, { props: { trainer } })

    expect(wrapper.find('article').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-card"]').exists()).toBe(true)
    expect(wrapper.find('figure').exists()).toBe(true)
    expect(wrapper.find('header h2').text()).toBe(trainer.name)
    expect(wrapper.find('header p').text()).toBe('Funcional')
    expect(wrapper.text()).toContain('São Paulo, SP')
    expect(wrapper.findAll('ul > li')).toHaveLength(3)
  })

  it('omits metadata list when city and modalities are absent', () => {
    const wrapper = mountFT(FTTrainerCard, {
      props: {
        trainer: mockTrainer({ city: undefined, state: undefined, modalities: [] }),
      },
    })

    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders promotion badge when trainer is on promotion', () => {
    const wrapper = mountFT(FTTrainerCard, {
      props: { trainer: mockPromoTrainer() },
    })

    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Primeira sessão')
  })
})
