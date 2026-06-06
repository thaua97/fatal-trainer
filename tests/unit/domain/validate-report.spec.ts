import { describe, expect, it } from 'vitest'
import type { ReportPayload } from '../../../shared/domain/report/entities/report'
import { validateReport } from '../../../shared/domain/report/services/validate-report'

function validPayload(overrides: Partial<ReportPayload> = {}): ReportPayload {
  return {
    type: 'abuse',
    occurredAt: '2025-05-01',
    trainerId: 'trainer-1',
    description: 'Descrição detalhada do ocorrido com mais de vinte caracteres.',
    contactEmail: 'user@example.com',
    ...overrides,
  }
}

describe('validateReport', () => {
  it('accepts a valid payload', () => {
    const result = validateReport(validPayload(), { trainerExists: true })
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('requires type', () => {
    const result = validateReport(validPayload({ type: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors.type).toBe('required')
  })

  it('requires occurredAt', () => {
    const result = validateReport(validPayload({ occurredAt: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors.occurredAt).toBe('required')
  })

  it('rejects invalid occurredAt format', () => {
    const result = validateReport(validPayload({ occurredAt: '01-05-2025' }))
    expect(result.valid).toBe(false)
    expect(result.errors.occurredAt).toBe('invalid')
  })

  it('rejects future occurredAt', () => {
    const result = validateReport(validPayload({ occurredAt: '2099-12-31' }))
    expect(result.valid).toBe(false)
    expect(result.errors.occurredAt).toBe('future')
  })

  it('requires trainerId', () => {
    const result = validateReport(validPayload({ trainerId: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors.trainerId).toBe('required')
  })

  it('rejects unknown trainerId when trainerExists is false', () => {
    const result = validateReport(validPayload(), { trainerExists: false })
    expect(result.valid).toBe(false)
    expect(result.errors.trainerId).toBe('notFound')
  })

  it('requires description', () => {
    const result = validateReport(validPayload({ description: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors.description).toBe('required')
  })

  it('rejects short description', () => {
    const result = validateReport(validPayload({ description: 'Curta demais' }))
    expect(result.valid).toBe(false)
    expect(result.errors.description).toBe('tooShort')
  })

  it('requires contactEmail', () => {
    const result = validateReport(validPayload({ contactEmail: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors.contactEmail).toBe('required')
  })

  it('rejects invalid contactEmail', () => {
    const result = validateReport(validPayload({ contactEmail: 'not-an-email' }))
    expect(result.valid).toBe(false)
    expect(result.errors.contactEmail).toBe('invalid')
  })
})
