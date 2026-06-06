export interface BrazilianCity {
  label: string
  city: string
  state: string
  value: string
}

let cachedCities: BrazilianCity[] | null = null

export async function loadBrazilianCities(): Promise<BrazilianCity[]> {
  if (cachedCities) {
    return cachedCities
  }

  const module = await import('./brazilian-cities.json')
  cachedCities = module.default as BrazilianCity[]
  return cachedCities
}
