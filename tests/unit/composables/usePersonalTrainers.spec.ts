import { defineComponent, flushPromises, nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { usePersonalTrainers } from '~/composables/catalog/usePersonalTrainers'

const personalTrainersService = {
  list: vi.fn(),
  getById: vi.fn(),
  listFeatured: vi.fn(),
}

vi.mock('~/services/catalog/personal-trainers.service', () => ({
  personalTrainersService,
}))

const TestHarness = defineComponent({
  setup() {
    return usePersonalTrainers()
  },
  template: '<div />',
})

describe('usePersonalTrainers', () => {
  beforeEach(() => {
    personalTrainersService.list.mockReset()

    useState('personal-trainers-query', () => ({
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      pageSize: 20,
      priceView: 'session',
    }))
    useState('personal-trainers-accumulated', () => [])
    useState('personal-trainers-pending', () => false)
    useState('personal-trainers-error', () => null)
    useState('personal-trainers-meta', () => ({ total: 0, hasMore: false }))
    useState('personal-trainers-last-response', () => null)
  })

  it('loads first page on mount', async () => {
    personalTrainersService.list.mockResolvedValue({
      items: [{ id: 'trainer-1' }],
      total: 1,
      page: 1,
      pageSize: 20,
      hasMore: false,
    })

    const wrapper = mountFT(TestHarness)
    await flushPromises()

    expect(personalTrainersService.list).toHaveBeenCalled()
    expect(wrapper.vm.trainers).toHaveLength(1)
  })

  it('loadMore requests next page', async () => {
    personalTrainersService.list
      .mockResolvedValueOnce({
        items: [{ id: 'trainer-1' }],
        total: 2,
        page: 1,
        pageSize: 20,
        hasMore: true,
      })
      .mockResolvedValueOnce({
        items: [{ id: 'trainer-2' }],
        total: 2,
        page: 2,
        pageSize: 20,
        hasMore: false,
      })

    const wrapper = mountFT(TestHarness)
    await flushPromises()

    wrapper.vm.loadMore()
    await flushPromises()

    expect(personalTrainersService.list).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.trainers.map((trainer: { id: string }) => trainer.id)).toEqual(['trainer-1', 'trainer-2'])
  })

  it('resets accumulated trainers when filters change', async () => {
    personalTrainersService.list.mockResolvedValue({
      items: [{ id: 'trainer-1' }],
      total: 1,
      page: 1,
      pageSize: 20,
      hasMore: false,
    })

    const wrapper = mountFT(TestHarness)
    await flushPromises()

    wrapper.vm.query.search = 'new search'
    await nextTick()
    await flushPromises()

    expect(wrapper.vm.query.page).toBe(1)
    expect(personalTrainersService.list).toHaveBeenCalledTimes(2)
  })
})
