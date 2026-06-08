import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import FTProfileGallery from './FTProfileGallery.vue'

const mockOpenAt = vi.fn()

vi.mock('~/composables/profile/useProfileGalleryViewer', () => ({
  useProfileGalleryViewer: () => ({
    openAt: mockOpenAt,
  }),
}))

const gallery = [
  'https://example.com/photo-1.jpg',
  'https://example.com/photo-2.jpg',
]

describe('FTProfileGallery', () => {
  beforeEach(() => {
    mockOpenAt.mockReset()
  })

  it('renders clickable gallery thumbnails', async () => {
    const wrapper = mountFT(FTProfileGallery, {
      props: {
        trainer: mockTrainer({ gallery }),
      },
    })

    expect(wrapper.find('[data-testid="trainer-gallery"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid^="gallery-thumb-"]')).toHaveLength(2)

    await wrapper.find('[data-testid="gallery-thumb-1"]').trigger('click')

    expect(mockOpenAt).toHaveBeenCalledWith(1)
  })

  it('does not render when gallery is empty', () => {
    const wrapper = mountFT(FTProfileGallery, {
      props: {
        trainer: mockTrainer({ gallery: [] }),
      },
    })

    expect(wrapper.find('[data-testid="trainer-gallery"]').exists()).toBe(false)
  })
})
