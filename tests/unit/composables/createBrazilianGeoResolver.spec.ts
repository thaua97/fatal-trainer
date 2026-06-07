import { describe, it, expect } from 'vitest'
import { createBrazilianGeoResolver } from '~/composables/core/createBrazilianGeoResolver'

describe('createBrazilianGeoResolver', () => {
  it('resolves São Paulo coordinates to São Paulo', async () => {
    const resolver = createBrazilianGeoResolver()
    const result = await resolver({
      latitude: -23.5505,
      longitude: -46.6333,
    })

    expect(result?.city).toBe('São Paulo')
    expect(result?.state).toBe('SP')
    expect(result?.value).toBe('sao-paulo-sp')
  })

  it('resolves Pelotas coordinates to Pelotas', async () => {
    const resolver = createBrazilianGeoResolver()
    const result = await resolver({
      latitude: -31.7654,
      longitude: -52.3376,
    })

    expect(result?.city).toBe('Pelotas')
    expect(result?.state).toBe('RS')
  })

  it('returns null for coordinates outside Brazil', async () => {
    const resolver = createBrazilianGeoResolver()
    const result = await resolver({
      latitude: 40.7128,
      longitude: -74.006,
    })

    expect(result).toBeNull()
  })
})
