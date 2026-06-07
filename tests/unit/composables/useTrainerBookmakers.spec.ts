import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { FAVORITE_TRAINER_IDS_KEY, useTrainerBookmakers } from '~/composables/catalog/useTrainerBookmakers'

const favoritesService = {
  list: vi.fn(),
  sync: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
}

const isAuthenticated = ref(false)
const initialized = ref(true)

vi.mock('~/services/catalog/favorites.service', () => ({
  favoritesService,
}))

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated,
    initialized,
  }),
}))

const TestHarness = defineComponent({
  setup() {
    return useTrainerBookmakers()
  },
  template: '<div />',
})

describe('useTrainerBookmakers', () => {
  const store: Record<string, string> = {}

  beforeEach(() => {
    for (const key of Object.keys(store)) {
      delete store[key]
    }

    isAuthenticated.value = false
    initialized.value = true

    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
    })

    favoritesService.list.mockReset()
    favoritesService.sync.mockReset()
    favoritesService.add.mockReset()
    favoritesService.remove.mockReset()

    useState('trainer-bookmaker-ids', () => [])
    useState('trainer-bookmakers-pending', () => false)
    useState('trainer-bookmakers-hydrated', () => false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('toggles favorites in localStorage for guests', async () => {
    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.isFavorite('trainer-1')).toBe(false)

    await wrapper.vm.toggleFavorite('trainer-1')
    await nextTick()

    expect(wrapper.vm.isFavorite('trainer-1')).toBe(true)
    expect(JSON.parse(store[FAVORITE_TRAINER_IDS_KEY]!)).toEqual(['trainer-1'])

    await wrapper.vm.toggleFavorite('trainer-1')
    await nextTick()

    expect(wrapper.vm.isFavorite('trainer-1')).toBe(false)
    expect(JSON.parse(store[FAVORITE_TRAINER_IDS_KEY]!)).toEqual([])
  })

  it('syncs local favorites after login', async () => {
    store[FAVORITE_TRAINER_IDS_KEY] = JSON.stringify(['trainer-a', 'trainer-b'])
    favoritesService.sync.mockResolvedValue({ synced: 2 })
    favoritesService.list.mockResolvedValue({
      items: [{ id: 'trainer-a' }, { id: 'trainer-b' }],
      total: 2,
      page: 1,
      pageSize: 1000,
    })
    isAuthenticated.value = true

    const wrapper = mountFT(TestHarness)
    await wrapper.vm.syncFromLocalStorage()

    expect(favoritesService.sync).toHaveBeenCalledWith({ trainerIds: ['trainer-a', 'trainer-b'] })
    expect(JSON.parse(store[FAVORITE_TRAINER_IDS_KEY]!)).toEqual([])
  })
})
