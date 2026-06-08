import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTFilterFab from './FTFilterFab.vue'

describe('FTFilterFab', () => {
  it('renders filter button', () => {
    const wrapper = mountFT(FTFilterFab, {
      props: { badgeCount: 2 },
    })

    const button = wrapper.find('[data-testid="filter-fab"]')

    expect(button.exists()).toBe(true)
    expect(button.classes()).toContain('lg:hidden')
    expect(wrapper.find('[data-testid="filter-fab-badge"]').text()).toBe('2')
  })

  it('hides badge when no active filters', () => {
    const wrapper = mountFT(FTFilterFab, {
      props: { badgeCount: 0 },
    })

    expect(wrapper.find('[data-testid="filter-fab-badge"]').exists()).toBe(false)
  })
})
