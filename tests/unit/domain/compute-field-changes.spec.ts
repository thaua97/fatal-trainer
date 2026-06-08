import { describe, expect, it } from 'vitest'
import { computeFieldChanges } from '#shared/domain/admin/services/compute-field-changes'

describe('computeFieldChanges', () => {
  it('detects simple field changes', () => {
    const changes = computeFieldChanges(
      { name: 'Ana', city: 'SP' },
      { name: 'Ana Silva', city: 'SP' },
      ['name', 'city'],
    )

    expect(changes).toHaveLength(1)
    expect(changes[0]).toMatchObject({
      field: 'name',
      label: 'Nome',
      before: 'Ana',
      after: 'Ana Silva',
    })
  })

  it('formats array fields as comma-separated values', () => {
    const changes = computeFieldChanges(
      { specialties: ['Musculação'] },
      { specialties: ['Musculação', 'Funcional'] },
      ['specialties'],
    )

    expect(changes[0]?.before).toBe('Musculação')
    expect(changes[0]?.after).toBe('Musculação, Funcional')
  })

  it('formats boolean isActive as Sim/Não', () => {
    const changes = computeFieldChanges(
      { isActive: true },
      { isActive: false },
      ['isActive'],
    )

    expect(changes[0]?.before).toBe('Sim')
    expect(changes[0]?.after).toBe('Não')
  })

  it('skips unchanged fields', () => {
    const changes = computeFieldChanges(
      { email: 'a@test.com', role: 'student' },
      { email: 'a@test.com', role: 'student' },
      ['email', 'role'],
    )

    expect(changes).toHaveLength(0)
  })
})
