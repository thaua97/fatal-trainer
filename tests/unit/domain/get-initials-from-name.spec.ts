import { describe, expect, it } from 'vitest'
import { getInitialsFromName } from '../../../shared/utils/get-initials-from-name'

describe('getInitialsFromName', () => {
  it('returns first and last initials for full names', () => {
    expect(getInitialsFromName('Ana Silva')).toBe('AS')
    expect(getInitialsFromName('Marcos Oliveira')).toBe('MO')
  })

  it('returns single initial for one name', () => {
    expect(getInitialsFromName('Rafael')).toBe('R')
  })

  it('handles extra whitespace', () => {
    expect(getInitialsFromName('  Julia   Mendes  ')).toBe('JM')
  })

  it('returns ? for empty names', () => {
    expect(getInitialsFromName('')).toBe('?')
    expect(getInitialsFromName('   ')).toBe('?')
  })
})
