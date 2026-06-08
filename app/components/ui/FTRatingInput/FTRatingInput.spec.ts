import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTRatingInput from './FTRatingInput.vue'

describe('FTRatingInput', () => {
  it('renders five interactive stars', () => {
    const wrapper = mountFT(FTRatingInput, {
      props: { modelValue: 0 },
    })

    expect(wrapper.find('[data-testid="rating-input"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid^="rating-star-"]').length).toBe(10)
  })

  it('updates model on half and full star clicks', async () => {
    const rating = ref(0)
    const wrapper = mountFT(FTRatingInput, {
      props: {
        modelValue: rating.value,
        'onUpdate:modelValue': (value: number) => {
          rating.value = value
        },
      },
    })

    await wrapper.get('[data-testid="rating-star-3-left"]').trigger('click')
    expect(rating.value).toBe(2.5)

    await wrapper.get('[data-testid="rating-star-5-right"]').trigger('click')
    expect(rating.value).toBe(5)
  })

  it('shows formatted rating value', () => {
    const wrapper = mountFT(FTRatingInput, {
      props: { modelValue: 4.5 },
    })

    expect(wrapper.get('[data-testid="rating-input-value"]').text()).toBe('4,5')
  })
})
