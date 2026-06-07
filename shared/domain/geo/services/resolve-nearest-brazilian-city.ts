import type { BrazilianCity } from '#shared/data/brazilian-cities'

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

export type CityCoordsMap = Record<string, [number, number]>

/** Approximate bounding box of continental Brazil (+ coastal islands). */
const BRAZIL_BOUNDS = {
  minLat: -33.75,
  maxLat: 5.27,
  minLng: -73.99,
  maxLng: -28.84,
}

/** Max distance (km) from nearest municipality centroid to accept a match. */
export const DEFAULT_MAX_DISTANCE_KM = 150

const EARTH_RADIUS_KM = 6371

export function haversineDistanceKm(
  a: GeoCoordinates,
  b: GeoCoordinates,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const h =
    Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function isWithinBrazilBounds(latitude: number, longitude: number): boolean {
  return (
    latitude >= BRAZIL_BOUNDS.minLat
    && latitude <= BRAZIL_BOUNDS.maxLat
    && longitude >= BRAZIL_BOUNDS.minLng
    && longitude <= BRAZIL_BOUNDS.maxLng
  )
}

export interface ResolveNearestOptions {
  maxDistanceKm?: number
}

export function resolveNearestBrazilianCity(
  coords: GeoCoordinates,
  cities: BrazilianCity[],
  coordsMap: CityCoordsMap,
  options: ResolveNearestOptions = {},
): BrazilianCity | null {
  const maxDistanceKm = options.maxDistanceKm ?? DEFAULT_MAX_DISTANCE_KM

  if (!isWithinBrazilBounds(coords.latitude, coords.longitude)) {
    return null
  }

  let nearestCity: BrazilianCity | null = null
  let nearestDistance = Infinity

  for (const city of cities) {
    const cityCoords = coordsMap[city.value]
    if (!cityCoords) {
      continue
    }

    const [latitude, longitude] = cityCoords
    const distance = haversineDistanceKm(coords, { latitude, longitude })

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestCity = city
    }
  }

  if (!nearestCity || nearestDistance > maxDistanceKm) {
    return null
  }

  return nearestCity
}
