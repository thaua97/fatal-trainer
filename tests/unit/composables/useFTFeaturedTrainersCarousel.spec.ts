import { defineComponent, type VueWrapper } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { useFTFeaturedTrainersCarousel } from '~/composables/components/useFTFeaturedTrainersCarousel'

const { useFeaturedTrainers } = vi.hoisted(() => ({
  useFeaturedTrainers: vi.fn(),
}))

vi.mock('~/composables/catalog/useFeaturedTrainers', () => ({
  useFeaturedTrainers,
}))

vi.mock('~/composables/catalog/useCatalogCityGate', () => ({
  useCatalogCityGate: () => ({
    isAwaitingCity: computed(() => false),
    fetchEnabled: ref(true),
    modalOpen: ref(false),
    resolveWithAll: vi.fn(),
    openModal: vi.fn(),
  }),
}))

const TestHarness = defineComponent({
  setup() {
    return useFTFeaturedTrainersCarousel()
  },
  template: '<div />',
})

describe('useFTFeaturedTrainersCarousel', () => {
  let wrappers: VueWrapper[] = []

  beforeEach(() => {
    useFeaturedTrainers.mockReset()
  })

  afterEach(() => {
    wrappers.forEach((wrapper) => wrapper.unmount())
    wrappers = []
  })

  function mountHarness() {
    const wrapper = mountFT(TestHarness)
    wrappers.push(wrapper)
    return wrapper
  }

  it('shows carousel while loading', () => {
    useFeaturedTrainers.mockReturnValue({
      trainers: computed(() => []),
      mode: computed(() => 'hidden' as const),
      pending: ref(true),
      loaded: computed(() => false),
      fetchEnabled: ref(true),
      status: computed(() => 'pending' as const),
      error: ref(null),
      refresh: vi.fn(),
    })

    const wrapper = mountHarness()

    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.vm.shouldShow).toBe(true)
  })

  it('uses recommended title in fallback mode', () => {
    useFeaturedTrainers.mockReturnValue({
      trainers: computed(() => [{ id: 'r1' }]),
      mode: computed(() => 'recommended' as const),
      pending: ref(false),
      loaded: computed(() => true),
      fetchEnabled: ref(true),
      status: computed(() => 'success' as const),
      error: ref(null),
      refresh: vi.fn(),
    })

    const wrapper = mountHarness()

    expect(wrapper.vm.sectionTitle).toBe('Recomendados')
    expect(wrapper.vm.shouldShow).toBe(true)
  })

  it('hides carousel on error', () => {
    useFeaturedTrainers.mockReturnValue({
      trainers: computed(() => []),
      mode: computed(() => 'featured' as const),
      pending: ref(false),
      loaded: computed(() => true),
      fetchEnabled: ref(true),
      status: computed(() => 'error' as const),
      error: ref(new Error('failed')),
      refresh: vi.fn(),
    })

    const wrapper = mountHarness()

    expect(wrapper.vm.shouldShow).toBe(false)
    expect(wrapper.vm.isEmpty).toBe(true)
  })
})
