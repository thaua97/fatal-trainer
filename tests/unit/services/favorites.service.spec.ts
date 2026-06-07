import { beforeEach, describe, expect, it, vi } from 'vitest'
import { favoritesService } from '~/services/catalog/favorites.service'

const apiFetch = vi.fn()

vi.mock('~/services/api/create-api-client', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}))

describe('favoritesService', () => {
  beforeEach(() => {
    apiFetch.mockReset()
  })

  it('list sends pagination and ids query', async () => {
    apiFetch.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 })

    await favoritesService.list({ page: 1, pageSize: 20, ids: 'a,b' })

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers/bookmakers', {
      query: {
        page: '1',
        pageSize: '20',
        ids: 'a,b',
      },
    })
  })

  it('sync posts trainer ids', async () => {
    apiFetch.mockResolvedValue({ synced: 2 })

    await favoritesService.sync({ trainerIds: ['a', 'b'] })

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers/bookmakers', {
      method: 'POST',
      body: { trainerIds: ['a', 'b'] },
    })
  })

  it('add posts to trainer endpoint', async () => {
    apiFetch.mockResolvedValue(undefined)

    await favoritesService.add('trainer-1')

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers/bookmakers/trainer-1', {
      method: 'POST',
    })
  })

  it('remove deletes trainer endpoint', async () => {
    apiFetch.mockResolvedValue(undefined)

    await favoritesService.remove('trainer-1')

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers/bookmakers/trainer-1', {
      method: 'DELETE',
    })
  })
})
