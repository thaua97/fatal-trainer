import { describe, it, expect } from 'vitest'
import type { BrazilianCity } from '#shared/data/brazilian-cities'
import {
  DEFAULT_MAX_DISTANCE_KM,
  haversineDistanceKm,
  isWithinBrazilBounds,
  resolveNearestBrazilianCity,
  type CityCoordsMap,
} from '#shared/domain/geo/services/resolve-nearest-brazilian-city'

const SAMPLE_CITIES: BrazilianCity[] = [
  { label: 'São Paulo - SP', city: 'São Paulo', state: 'SP', value: 'sao-paulo-sp' },
  { label: 'Pelotas - RS', city: 'Pelotas', state: 'RS', value: 'pelotas-rs' },
  { label: 'Rio de Janeiro - RJ', city: 'Rio de Janeiro', state: 'RJ', value: 'rio-de-janeiro-rj' },
]

const SAMPLE_COORDS: CityCoordsMap = {
  'sao-paulo-sp': [-23.5505, -46.6333],
  'pelotas-rs': [-31.7654, -52.3376],
  'rio-de-janeiro-rj': [-22.9068, -43.1729],
}

describe('haversineDistanceKm', () => {
  it('returns zero for identical coordinates', () => {
    const point = { latitude: -23.5505, longitude: -46.6333 }
    expect(haversineDistanceKm(point, point)).toBe(0)
  })

  it('computes a plausible distance between São Paulo and Rio de Janeiro', () => {
    const distance = haversineDistanceKm(
      { latitude: -23.5505, longitude: -46.6333 },
      { latitude: -22.9068, longitude: -43.1729 },
    )

    expect(distance).toBeGreaterThan(300)
    expect(distance).toBeLessThan(450)
  })
})

describe('isWithinBrazilBounds', () => {
  it('accepts coordinates inside Brazil', () => {
    expect(isWithinBrazilBounds(-23.5505, -46.6333)).toBe(true)
  })

  it('rejects coordinates outside Brazil', () => {
    expect(isWithinBrazilBounds(40.7128, -74.006)).toBe(false)
  })
})

describe('resolveNearestBrazilianCity', () => {
  it('resolves São Paulo coordinates to São Paulo', () => {
    const result = resolveNearestBrazilianCity(
      { latitude: -23.5505, longitude: -46.6333 },
      SAMPLE_CITIES,
      SAMPLE_COORDS,
    )

    expect(result?.city).toBe('São Paulo')
    expect(result?.state).toBe('SP')
  })

  it('resolves Pelotas coordinates to Pelotas', () => {
    const result = resolveNearestBrazilianCity(
      { latitude: -31.7654, longitude: -52.3376 },
      SAMPLE_CITIES,
      SAMPLE_COORDS,
    )

    expect(result?.city).toBe('Pelotas')
    expect(result?.state).toBe('RS')
  })

  it('returns null for coordinates outside Brazil', () => {
    const result = resolveNearestBrazilianCity(
      { latitude: 40.7128, longitude: -74.006 },
      SAMPLE_CITIES,
      SAMPLE_COORDS,
    )

    expect(result).toBeNull()
  })

  it('returns null when the nearest city exceeds the distance threshold', () => {
    const result = resolveNearestBrazilianCity(
      { latitude: -3.1019, longitude: -60.025 },
      SAMPLE_CITIES,
      SAMPLE_COORDS,
      { maxDistanceKm: 1 },
    )

    expect(result).toBeNull()
  })

  it('uses the default max distance threshold', () => {
    expect(DEFAULT_MAX_DISTANCE_KM).toBe(150)
  })
})
