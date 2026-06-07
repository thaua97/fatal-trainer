import type { GeoResolver } from '~/composables/core/useGeoLocation'
import type { CityCoordsMap } from '#shared/domain/geo/services/resolve-nearest-brazilian-city'
import { loadBrazilianCities } from '#shared/data/brazilian-cities'
import { resolveNearestBrazilianCity } from '#shared/domain/geo/services/resolve-nearest-brazilian-city'

let citiesPromise: ReturnType<typeof loadBrazilianCities> | null = null
let coordsPromise: Promise<CityCoordsMap> | null = null

async function loadCoordsMap(): Promise<CityCoordsMap> {
  if (!coordsPromise) {
    coordsPromise = import('#shared/data/brazilian-cities-coords.json').then(
      module => module.default as CityCoordsMap,
    )
  }
  return coordsPromise
}

async function loadCities() {
  if (!citiesPromise) {
    citiesPromise = loadBrazilianCities()
  }
  return citiesPromise
}

export function createBrazilianGeoResolver(): GeoResolver {
  return async (coords) => {
    const [cities, coordsMap] = await Promise.all([
      loadCities(),
      loadCoordsMap(),
    ])

    return resolveNearestBrazilianCity(coords, cities, coordsMap)
  }
}
