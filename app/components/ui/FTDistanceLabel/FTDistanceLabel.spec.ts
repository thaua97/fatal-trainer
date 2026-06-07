import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTDistanceLabel from './FTDistanceLabel.vue'

describe('FTDistanceLabel', () => {
  it('renders city and state', () => {
    const wrapper = mountFT(FTDistanceLabel, {
      props: { city: 'São Paulo', state: 'SP' },
    })
    expect(wrapper.text()).toContain('São Paulo, SP')
    expect(wrapper.text()).not.toContain('km')
  })

  it('renders city only when state is absent', () => {
    const wrapper = mountFT(FTDistanceLabel, {
      props: { city: 'São Paulo' },
    })
    expect(wrapper.text()).toContain('São Paulo')
    expect(wrapper.text()).not.toContain('km')
  })

  it('renders nothing when location is absent', () => {
    const wrapper = mountFT(FTDistanceLabel, { props: {} })
    expect(wrapper.text()).toBe('')
  })
})
