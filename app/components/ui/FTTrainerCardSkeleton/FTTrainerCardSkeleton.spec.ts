import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTTrainerCardSkeleton from './FTTrainerCardSkeleton.vue'


describe('FTTrainerCardSkeleton', () => {
  it('renders placeholder matching card layout', () => {
    const wrapper = mountFT(FTTrainerCardSkeleton, { props: {} })
    expect(wrapper.find('[data-testid="trainer-card-skeleton"]').exists()).toBe(true)
    expect(wrapper.find('.min-h-\\[120px\\]').exists()).toBe(true)
    expect(wrapper.findAll('.u-skeleton-stub').length).toBeGreaterThan(0)
  })
})
