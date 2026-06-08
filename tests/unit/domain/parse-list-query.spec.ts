import { describe, expect, it } from 'vitest'
import { parseListQuery, serializeListQueryToRoute } from '../../../shared/domain/catalog/value-objects/parse-list-query'

describe('parseListQuery', () => {
  it('parses filter arrays and promotion flag', () => {
    const query = parseListQuery({
      search: 'ana',
      specialties: 'Musculação,Funcional',
      modalities: 'presencial,online',
      onPromotion: 'true',
      priceView: 'monthly',
      sortBy: 'discount',
      sortOrder: 'desc',
      page: '2',
    })

    expect(query.search).toBe('ana')
    expect(query.specialties).toEqual(['Musculação', 'Funcional'])
    expect(query.modalities).toEqual(['presencial', 'online'])
    expect(query.onPromotion).toBe(true)
    expect(query.priceView).toBe('monthly')
    expect(query.sortBy).toBe('discount')
    expect(query.sortOrder).toBe('desc')
    expect(query.page).toBe(2)
  })

  it('serializes active filters to route query', () => {
    const serialized = serializeListQueryToRoute({
      specialties: ['Funcional'],
      modalities: ['online'],
      onPromotion: true,
      priceView: 'monthly',
      sortBy: 'rating',
      sortOrder: 'desc',
    })

    expect(serialized).toEqual({
      specialties: 'Funcional',
      modalities: 'online',
      onPromotion: 'true',
      priceView: 'monthly',
      sortBy: 'rating',
      sortOrder: 'desc',
    })
  })
})
