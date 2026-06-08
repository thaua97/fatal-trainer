import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTLandingHero from './FTLandingHero.vue'

describe('FTLandingHero', () => {
  it('renders hero title and CTAs', () => {
    const wrapper = mountFT(FTLandingHero)

    expect(wrapper.find('[data-testid="landing-hero"]').exists()).toBe(true)
    expect(wrapper.find('#landing-hero-title').exists()).toBe(true)
    expect(wrapper.find('[data-testid="landing-hero-cta-primary"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="landing-hero-cta-secondary"]').attributes('href')).toBe('/registro?role=personal-trainer')
  })
})
