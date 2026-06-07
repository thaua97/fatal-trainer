import { describe, expect, it } from 'vitest'
import type { ReportStatus } from '#shared/types/admin'

const statusLabel: Record<ReportStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em análise',
  resolved: 'Resolvida',
  archived: 'Arquivada',
}

describe('admin report status labels', () => {
  it('maps all statuses', () => {
    expect(Object.keys(statusLabel)).toHaveLength(4)
    expect(statusLabel.pending).toBe('Pendente')
  })
})
