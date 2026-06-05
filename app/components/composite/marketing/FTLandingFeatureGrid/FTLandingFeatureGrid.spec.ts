import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTLandingFeatureGrid from './FTLandingFeatureGrid.vue'

describe('FTLandingFeatureGrid', () => {
  it('renders three feature blocks', () => {
    const wrapper = mountFT(FTLandingFeatureGrid)

    expect(wrapper.find('[data-testid="landing-features"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid^="landing-feature-"]')).toHaveLength(3)
  })
})
