import { describe, expect, it } from 'vitest'
import { formatPrice } from '../../../shared/utils/format-price'

describe('formatPrice', () => {
  it('formats BRL currency', () => {
    expect(formatPrice(120)).toMatch(/R\$\s?120/)
  })
})
