import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reportsService } from '~/services/report/reports.service'

const apiFetch = vi.fn()

vi.mock('~/services/api/create-api-client', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}))

describe('reportsService', () => {
  beforeEach(() => {
    apiFetch.mockReset()
  })

  it('create posts report payload', async () => {
    const payload = {
      type: 'harassment',
      occurredAt: '2026-06-07T10:00:00.000Z',
      trainerId: 'trainer-1',
      description: 'Test report',
      contactEmail: 'user@example.com',
    }
    apiFetch.mockResolvedValue({ id: 'report-1', createdAt: '2026-06-07T10:00:00.000Z' })

    const result = await reportsService.create(payload)

    expect(apiFetch).toHaveBeenCalledWith('/reports', {
      method: 'POST',
      body: payload,
    })
    expect(result.id).toBe('report-1')
  })
})
