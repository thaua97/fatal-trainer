import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTModalityBadge from './FTModalityBadge.vue'

describe('FTModalityBadge', () => {
  it('renders presencial with trainer tone', () => {
    const wrapper = mountFT(FTModalityBadge, { props: { modality: 'presencial' } })
    expect(wrapper.find('[data-testid="modality-badge"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modality-badge"]').classes().some(c => c.includes('presencial'))).toBe(true)
  })

  it('renders online with student tone', () => {
    const wrapper = mountFT(FTModalityBadge, { props: { modality: 'online' } })
    expect(wrapper.find('[data-testid="modality-badge"]').classes().some(c => c.includes('online'))).toBe(true)
  })

  it('renders hibrido with admin tone', () => {
    const wrapper = mountFT(FTModalityBadge, { props: { modality: 'hibrido' } })
    expect(wrapper.find('[data-testid="modality-badge"]').classes().some(c => c.includes('hibrido'))).toBe(true)
  })
})
