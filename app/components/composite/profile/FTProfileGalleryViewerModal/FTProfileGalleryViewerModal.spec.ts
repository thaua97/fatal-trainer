import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import FTProfileGalleryViewerModal from './FTProfileGalleryViewerModal.vue'

const gallery = [
  'https://example.com/photo-1.jpg',
  'https://example.com/photo-2.jpg',
  'https://example.com/photo-3.jpg',
]

const mockViewerOpen = ref(true)
const mockActiveIndex = ref(1)
const mockImages = ref([...gallery])
const mockGoNext = vi.fn()
const mockGoPrev = vi.fn()
const mockHandleKeydown = vi.fn()

vi.mock('~/composables/profile/useProfileGalleryViewer', () => ({
  useProfileGalleryViewer: () => ({
    viewerOpen: mockViewerOpen,
    activeIndex: mockActiveIndex,
    images: mockImages,
    trainerName: ref('Ana Silva'),
    total: computed(() => mockImages.value.length),
    canGoPrev: computed(() => mockActiveIndex.value > 0),
    canGoNext: computed(() => mockActiveIndex.value < mockImages.value.length - 1),
    hasMultipleImages: computed(() => mockImages.value.length > 1),
    goNext: mockGoNext,
    goPrev: mockGoPrev,
    handleKeydown: mockHandleKeydown,
  }),
}))

const FTModalStub = defineComponent({
  name: 'FTModal',
  props: {
    open: { type: Boolean, default: false },
    variant: { type: String, default: 'hero' },
    fullscreen: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    titleId: { type: String, default: undefined },
    testId: { type: String, default: undefined },
  },
  emits: ['update:open'],
  template: `
    <div v-if="open" :data-testid="testId" :data-variant="variant" :data-fullscreen="fullscreen">
      <h2 v-if="title" :id="titleId">{{ title }}</h2>
      <slot />
    </div>
  `,
})

const UCarouselStub = defineComponent({
  name: 'UCarousel',
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ['select'],
  template: `
    <div data-testid="u-carousel-stub">
      <div v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index" />
      </div>
    </div>
  `,
})

describe('FTProfileGalleryViewerModal', () => {
  beforeEach(() => {
    mockViewerOpen.value = true
    mockActiveIndex.value = 1
    mockImages.value = [...gallery]
    mockGoNext.mockReset()
    mockGoPrev.mockReset()
    mockHandleKeydown.mockReset()
  })

  it('renders media modal with carousel and counter', () => {
    const wrapper = mountFT(FTProfileGalleryViewerModal, {
      props: {
        trainer: mockTrainer({ gallery }),
      },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UCarousel: UCarouselStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="gallery-viewer-modal"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gallery-viewer-modal"]').attributes('data-variant')).toBe('media')
    expect(wrapper.find('[data-testid="gallery-viewer-content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="u-carousel-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gallery-viewer-counter"]').text()).toContain('2 / 3')
    expect(wrapper.findAll('[data-testid="gallery-viewer-image"]')).toHaveLength(3)
  })

  it('renders navigation buttons for multi-image galleries', async () => {
    const wrapper = mountFT(FTProfileGalleryViewerModal, {
      props: {
        trainer: mockTrainer({ gallery }),
      },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UCarousel: UCarouselStub,
        },
      },
    })

    await wrapper.find('[data-testid="gallery-viewer-prev"]').trigger('click')
    await wrapper.find('[data-testid="gallery-viewer-next"]').trigger('click')

    expect(mockGoPrev).toHaveBeenCalledTimes(1)
    expect(mockGoNext).toHaveBeenCalledTimes(1)
  })

  it('hides navigation when gallery has a single image', () => {
    mockImages.value = [gallery[0]!]
    mockActiveIndex.value = 0

    const wrapper = mountFT(FTProfileGalleryViewerModal, {
      props: {
        trainer: mockTrainer({ gallery: [gallery[0]!] }),
      },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UCarousel: UCarouselStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="gallery-viewer-prev"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="gallery-viewer-next"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="gallery-viewer-counter"]').exists()).toBe(false)
  })
})
