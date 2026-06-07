/**
 * Generates shared/data/brazilian-cities-coords.json by matching our city list
 * against IBGE municipality centroids (kelvins/municipios-brasileiros).
 *
 * Usage: node scripts/generate-city-coords.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const IBGE_SOURCE_URL =
  'https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/json/municipios.json'

const UF_BY_CODE = {
  11: 'RO',
  12: 'AC',
  13: 'AM',
  14: 'RR',
  15: 'PA',
  16: 'AP',
  17: 'TO',
  21: 'MA',
  22: 'PI',
  23: 'CE',
  24: 'RN',
  25: 'PB',
  26: 'PE',
  27: 'AL',
  28: 'SE',
  29: 'BA',
  31: 'MG',
  32: 'ES',
  33: 'RJ',
  35: 'SP',
  41: 'PR',
  42: 'SC',
  43: 'RS',
  50: 'MS',
  51: 'MT',
  52: 'GO',
  53: 'DF',
}

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function cityKey(city, state) {
  return `${normalize(city)}|${state.trim().toUpperCase()}`
}

async function loadIbgeMunicipalities() {
  const response = await fetch(IBGE_SOURCE_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch IBGE data: ${response.status}`)
  }
  return response.json()
}

function buildIbgeLookup(municipalities) {
  const lookup = new Map()

  for (const item of municipalities) {
    const state = UF_BY_CODE[item.codigo_uf]
    if (!state) {
      continue
    }

    const key = cityKey(item.nome, state)
    lookup.set(key, [item.latitude, item.longitude])
  }

  return lookup
}

async function main() {
  const citiesPath = join(rootDir, 'shared/data/brazilian-cities.json')
  const outputPath = join(rootDir, 'shared/data/brazilian-cities-coords.json')

  const cities = JSON.parse(readFileSync(citiesPath, 'utf8'))
  const municipalities = await loadIbgeMunicipalities()
  const ibgeLookup = buildIbgeLookup(municipalities)

  const coords = {}
  const unmatched = []

  for (const city of cities) {
    const key = cityKey(city.city, city.state)
    const match = ibgeLookup.get(key)

    if (match) {
      coords[city.value] = match
    }
    else {
      unmatched.push(`${city.city} - ${city.state} (${city.value})`)
    }
  }

  writeFileSync(outputPath, `${JSON.stringify(coords)}\n`)

  console.log(`Matched: ${Object.keys(coords).length}/${cities.length}`)
  if (unmatched.length > 0) {
    console.warn(`Unmatched (${unmatched.length}):`)
    for (const entry of unmatched.slice(0, 20)) {
      console.warn(`  - ${entry}`)
    }
    if (unmatched.length > 20) {
      console.warn(`  ... and ${unmatched.length - 20} more`)
    }
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
