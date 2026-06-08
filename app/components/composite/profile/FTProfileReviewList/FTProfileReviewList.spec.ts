import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileReviewList from './FTProfileReviewList.vue'

const reviews = [
  {
    id: 'review-001',
    author: 'Thaua Teste',
    rating: 5,
    comment: 'teste teste teste',
    createdAt: '2026-06-07T00:00:00.000Z',
  },
]

describe('FTProfileReviewList', () => {
  it('shows edit button only for the editable review', () => {
    const wrapper = mountFT(FTProfileReviewList, {
      props: {
        reviews,
        editableReviewId: 'review-001',
      },
    })

    expect(wrapper.find('[data-testid="profile-review-edit"]').exists()).toBe(true)
  })

  it('hides edit button when review is not editable', () => {
    const wrapper = mountFT(FTProfileReviewList, {
      props: {
        reviews,
        editableReviewId: null,
      },
    })

    expect(wrapper.find('[data-testid="profile-review-edit"]').exists()).toBe(false)
  })
})
