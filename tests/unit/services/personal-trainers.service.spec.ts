import { beforeEach, describe, expect, it, vi } from 'vitest'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

const apiFetch = vi.fn()

vi.mock('~/services/api/create-api-client', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}))

describe('personalTrainersService', () => {
  beforeEach(() => {
    apiFetch.mockReset()
  })

  it('list sends query params', async () => {
    apiFetch.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 })

    await personalTrainersService.list({
      search: 'ana',
      page: 2,
      pageSize: 10,
      sortBy: 'name',
      sortOrder: 'asc',
    })

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers', {
      query: expect.objectContaining({
        search: 'ana',
        page: '2',
        pageSize: '10',
      }),
    })
  })

  it('getById fetches trainer detail', async () => {
    apiFetch.mockResolvedValue({ trainer: { id: 'trainer-1' } })

    const result = await personalTrainersService.getById('trainer-1')

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers/trainer-1')
    expect(result.trainer.id).toBe('trainer-1')
  })

  it('listFeatured fetches featured trainers', async () => {
    apiFetch.mockResolvedValue({ items: [] })

    await personalTrainersService.listFeatured()

    expect(apiFetch).toHaveBeenCalledWith('/personal-trainers/featured')
  })
})
