import { describe, expect, it } from 'vitest'
import { formatCref, isValidCrefFormat, stripCrefInput } from '../../../shared/utils/format-cref'

describe('formatCref', () => {
  it('formats progressively while typing', () => {
    expect(formatCref('123456')).toBe('123456-')
    expect(formatCref('123456G')).toBe('123456-G')
    expect(formatCref('123456GS')).toBe('123456-G/S')
    expect(formatCref('123456GSP')).toBe('123456-G/SP')
  })

  it('normalizes lowercase input', () => {
    expect(formatCref('123456-g/sp')).toBe('123456-G/SP')
  })

  it('strips invalid characters and optional CREF prefix', () => {
    expect(stripCrefInput('CREF 123456-G/SP')).toBe('123456GSP')
    expect(formatCref('CREF 123456-G/SP')).toBe('123456-G/SP')
  })
})

describe('isValidCrefFormat', () => {
  it('accepts valid CREF values', () => {
    expect(isValidCrefFormat('123456-G/SP')).toBe(true)
    expect(isValidCrefFormat('100000-G/RJ')).toBe(true)
  })

  it('rejects invalid formats', () => {
    expect(isValidCrefFormat('12345-G/SP')).toBe(false)
    expect(isValidCrefFormat('123456-G/XX')).toBe(false)
    expect(isValidCrefFormat('wqweqweqw')).toBe(false)
  })
})
