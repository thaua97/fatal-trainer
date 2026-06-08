import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adminService } from '~/services/admin/admin.service'

const apiFetch = vi.fn()

vi.mock('~/services/api/create-api-client', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}))

describe('adminService', () => {
  beforeEach(() => {
    apiFetch.mockReset()
  })

  it('deleteAdminUser calls DELETE /admin/users/:id', async () => {
    apiFetch.mockResolvedValue(undefined)

    await adminService.deleteAdminUser('user-123')

    expect(apiFetch).toHaveBeenCalledWith('/admin/users/user-123', {
      method: 'DELETE',
    })
  })
})
