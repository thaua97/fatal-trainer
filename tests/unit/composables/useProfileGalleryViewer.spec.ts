import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { useProfileGalleryViewer } from '~/composables/profile/useProfileGalleryViewer'

const gallery = [
  'https://example.com/photo-1.jpg',
  'https://example.com/photo-2.jpg',
  'https://example.com/photo-3.jpg',
]

const TestHarness = defineComponent({
  setup() {
    const trainer = ref(mockTrainer({ gallery }))
    return {
      ...useProfileGalleryViewer(trainer),
      trainer,
    }
  },
  template: '<div />',
})

describe('useProfileGalleryViewer', () => {
  beforeEach(() => {
    useState('profile-gallery-viewer-open', () => false).value = false
    useState('profile-gallery-viewer-index', () => 0).value = 0
  })

  afterEach(() => {
    useState('profile-gallery-viewer-open', () => false).value = false
    useState('profile-gallery-viewer-index', () => 0).value = 0
  })

  it('opens and closes the viewer at a specific index', async () => {
    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.viewerOpen).toBe(false)

    wrapper.vm.openAt(1)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewerOpen).toBe(true)
    expect(wrapper.vm.activeIndex).toBe(1)
    expect(wrapper.vm.currentImage).toBe(gallery[1])

    wrapper.vm.closeViewer()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewerOpen).toBe(false)
  })

  it('ignores invalid indexes when opening', async () => {
    const wrapper = mountFT(TestHarness)

    wrapper.vm.openAt(-1)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.viewerOpen).toBe(false)

    wrapper.vm.openAt(99)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.viewerOpen).toBe(false)
  })

  it('navigates forward and backward within bounds', async () => {
    const wrapper = mountFT(TestHarness)

    wrapper.vm.openAt(0)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.canGoPrev).toBe(false)
    expect(wrapper.vm.canGoNext).toBe(true)

    wrapper.vm.goNext()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeIndex).toBe(1)

    wrapper.vm.goNext()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeIndex).toBe(2)
    expect(wrapper.vm.canGoNext).toBe(false)

    wrapper.vm.goNext()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeIndex).toBe(2)

    wrapper.vm.goPrev()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeIndex).toBe(1)

    wrapper.vm.goPrev()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeIndex).toBe(0)
    expect(wrapper.vm.canGoPrev).toBe(false)

    wrapper.vm.goPrev()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeIndex).toBe(0)
  })

  it('handles keyboard navigation when open', async () => {
    const wrapper = mountFT(TestHarness)

    wrapper.vm.openAt(1)
    await wrapper.vm.$nextTick()

    wrapper.vm.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(wrapper.vm.activeIndex).toBe(2)

    wrapper.vm.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(wrapper.vm.activeIndex).toBe(1)
  })

  it('ignores keyboard navigation when closed', async () => {
    const wrapper = mountFT(TestHarness)

    wrapper.vm.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(wrapper.vm.activeIndex).toBe(0)
  })

  it('detects single-image galleries', async () => {
    const wrapper = mountFT(TestHarness)
    wrapper.vm.trainer = mockTrainer({ gallery: [gallery[0]!] })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasMultipleImages).toBe(false)
    expect(wrapper.vm.total).toBe(1)
  })
})
