import { defineComponent, nextTick, type VueWrapper } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { mockTrainerFiltersState, mockUseTrainerFilters } from '@tests/helpers/mock-trainer-filters'
import { useFeaturedTrainers } from '~/composables/catalog/useFeaturedTrainers'

vi.mock('~/composables/catalog/useTrainerFilters', () => ({
  useTrainerFilters: () => mockUseTrainerFilters(),
}))

const { personalTrainersService } = vi.hoisted(() => ({
  personalTrainersService: {
    listFeatured: vi.fn(),
    list: vi.fn(),
  },
}))

vi.mock('~/services/catalog/personal-trainers.service', () => ({
  personalTrainersService,
}))

const TestHarness = defineComponent({
  setup() {
    return useFeaturedTrainers()
  },
  template: '<div />',
})

function enableCatalogFetch(): void {
  useState('catalog-fetch-enabled', () => false).value = true
  useState('catalog-city-gate-initialized', () => false).value = true
  useState('catalog-city-modal-open', () => false).value = false
}

describe('useFeaturedTrainers', () => {
  let wrappers: VueWrapper[] = []

  beforeEach(() => {
    personalTrainersService.listFeatured.mockReset()
    personalTrainersService.list.mockReset()
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: undefined,
    }

    useState('featured-trainers-items', () => []).value = []
    useState('featured-trainers-mode', () => 'hidden' as const).value = 'hidden'
    useState('featured-trainers-pending', () => false).value = false
    useState<Error | null>('featured-trainers-error', () => null).value = null
    useState('featured-trainers-loaded', () => false).value = false
    useState<string | null>('featured-trainers-city-key', () => null).value = null

    enableCatalogFetch()
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

  it('merges featured trainers with rated fill candidates', async () => {
    personalTrainersService.listFeatured.mockResolvedValue({
      items: [
        mockTrainer({ id: 'f1', featured: true }),
        mockTrainer({ id: 'f2', featured: true }),
      ],
    })
    personalTrainersService.list.mockResolvedValue({
      items: [
        mockTrainer({ id: 'r1', rating: 4.9 }),
        mockTrainer({ id: 'r2', rating: 4.8 }),
      ],
    })

    const wrapper = mountHarness()
    await flushPromises()

    expect(wrapper.vm.trainers).toHaveLength(4)
    expect(wrapper.vm.mode).toBe('featured')
    expect(wrapper.vm.trainers[0]?.id).toBe('f1')
    expect(wrapper.vm.trainers[1]?.id).toBe('f2')
    expect(personalTrainersService.listFeatured).toHaveBeenCalledOnce()
    expect(personalTrainersService.list).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'rating', sortOrder: 'desc', pageSize: 12 }),
    )
  })

  it('filters featured and rated trainers by selected city', async () => {
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: 'São Paulo',
    }

    personalTrainersService.listFeatured.mockResolvedValue({
      items: [
        mockTrainer({ id: 'f-sp', featured: true, city: 'São Paulo', state: 'SP' }),
        mockTrainer({ id: 'f-rj', featured: true, city: 'Rio de Janeiro', state: 'RJ' }),
      ],
    })
    personalTrainersService.list.mockResolvedValue({
      items: [mockTrainer({ id: 'r-sp', rating: 4.9, city: 'São Paulo', state: 'SP' })],
    })

    const wrapper = mountHarness()
    await flushPromises()

    expect(wrapper.vm.trainers).toHaveLength(2)
    expect(wrapper.vm.trainers.map((trainer: { id: string }) => trainer.id)).toEqual(['f-sp', 'r-sp'])
    expect(personalTrainersService.list).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'São Paulo' }),
    )
  })

  it('refetches when city changes', async () => {
    personalTrainersService.listFeatured.mockResolvedValue({ items: [] })
    personalTrainersService.list.mockResolvedValue({
      items: [mockTrainer({ id: 'r1', rating: 4.5, city: 'São Paulo', state: 'SP' })],
    })

    const wrapper = mountHarness()
    await flushPromises()

    expect(personalTrainersService.list).toHaveBeenCalledTimes(1)

    personalTrainersService.list.mockResolvedValue({
      items: [mockTrainer({ id: 'r2', rating: 4.8, city: 'Curitiba', state: 'PR' })],
    })
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: 'Curitiba',
    }

    await nextTick()
    await flushPromises()

    expect(personalTrainersService.list).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.trainers[0]?.id).toBe('r2')
  })

  it('falls back to recommended mode when no featured trainers exist', async () => {
    personalTrainersService.listFeatured.mockResolvedValue({ items: [] })
    personalTrainersService.list.mockResolvedValue({
      items: [mockTrainer({ id: 'r1', rating: 4.5 })],
    })

    const wrapper = mountHarness()
    await flushPromises()

    expect(wrapper.vm.trainers).toHaveLength(1)
    expect(wrapper.vm.mode).toBe('recommended')
  })

  it('does not fetch while catalog city gate is closed', async () => {
    useState('catalog-fetch-enabled', () => true).value = false

    const wrapper = mountHarness()
    await flushPromises()

    expect(personalTrainersService.listFeatured).not.toHaveBeenCalled()
    expect(wrapper.vm.trainers).toHaveLength(0)
  })

  it('sets hidden mode on fetch error', async () => {
    personalTrainersService.listFeatured.mockRejectedValue(new Error('network'))

    const wrapper = mountHarness()
    await flushPromises()

    expect(wrapper.vm.trainers).toHaveLength(0)
    expect(wrapper.vm.mode).toBe('hidden')
    expect(wrapper.vm.error).toBeInstanceOf(Error)
  })
})
