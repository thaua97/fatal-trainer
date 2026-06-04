import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FTCarouselDots from './FTCarouselDots.vue'

describe('FTCarouselDots', () => {
  it('renders the correct number of dots', () => {
    const wrapper = mount(FTCarouselDots, {
      props: { count: 6, activeIndex: 0 },
    })

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(6)
  })

  it('emits select when a dot is clicked', async () => {
    const wrapper = mount(FTCarouselDots, {
      props: { count: 3, activeIndex: 0 },
    })

    await wrapper.findAll('[role="tab"]')[2]!.trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual([2])
  })
})
