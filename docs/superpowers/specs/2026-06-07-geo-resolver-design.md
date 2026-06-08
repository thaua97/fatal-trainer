# Geo Resolver (Reverse Geocoding Offline) — Design Spec

**Date:** 2026-06-07  
**Status:** Implemented

## Overview

Converte coordenadas do navegador (lat/lng) em uma cidade brasileira do dataset existente, habilitando a detecção automática no `FTCitySelector` sem API externa.

## Problem

O fluxo de geolocalização obtinha coordenadas via `navigator.geolocation`, mas o resolver padrão retornava sempre `null`, exibindo:

> "Não encontramos sua cidade automaticamente. Digite o nome."

## Solution

Resolver offline por **cidade mais próxima** usando centroides municipais IBGE e distância Haversine.

## Architecture

```
useFTCitySelector
  └─ useGeoLocation({ resolver: createBrazilianGeoResolver() })
       └─ createBrazilianGeoResolver()
            ├─ loadBrazilianCities()          (lazy)
            ├─ brazilian-cities-coords.json   (lazy)
            └─ resolveNearestBrazilianCity()  (pure domain)
```

### Files

| File | Role |
|------|------|
| `scripts/generate-city-coords.mjs` | Gera coords a partir de IBGE (kelvins/municipios-brasileiros) |
| `shared/data/brazilian-cities-coords.json` | Mapa `value → [lat, lng]` (5571 municípios) |
| `shared/domain/geo/services/resolve-nearest-brazilian-city.ts` | Haversine, bounds BR, threshold |
| `app/composables/core/createBrazilianGeoResolver.ts` | Factory do resolver plugável |

## Algorithm

1. Rejeitar coords fora do bounding box do Brasil → `null` (erro `manual`)
2. Para cada município com coords, calcular distância Haversine
3. Retornar o município mais próximo se distância ≤ 150 km
4. Caso contrário → `null`

## Data generation

```bash
pnpm generate:city-coords
```

- Fonte: [kelvins/municipios-brasileiros](https://github.com/kelvins/municipios-brasileiros) (centroides IBGE)
- Match: `city + state` normalizado (NFD, lowercase, sem acentos)
- Saída versionada no repo; re-executar apenas ao atualizar `brazilian-cities.json`

## Edge cases

| Situation | Behavior |
|-----------|----------|
| Permissão negada | `permission-denied` |
| GPS indisponível | `position-unavailable` |
| Fora do Brasil | `manual` |
| Dentro do BR | Preenche cidade + estado |
| Testes / Storybook | Injetar `resolver` customizado via `useFTCitySelector({ resolver })` |

## Trade-offs

- Usa centroide municipal, não endereço exato — adequado para filtro de catálogo
- Em fronteiras entre municípios, pode selecionar a cidade vizinha mais próxima
- Bundle de coords carregado sob demanda (lazy import) na primeira detecção

## Testing

- `tests/unit/domain/resolve-nearest-brazilian-city.spec.ts`
- `tests/unit/composables/createBrazilianGeoResolver.spec.ts`
- `tests/unit/composables/useFTCitySelector.spec.ts` (detecção com resolver padrão)

## Out of scope

- Endpoint backend de geocoding
- Auto-detect no mount (continua no clique do botão)
- API paga (Google, Mapbox)
