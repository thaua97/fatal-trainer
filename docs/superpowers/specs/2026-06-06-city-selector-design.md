# City Selector (Segregação por cidade) — Design Spec

**Date:** 2026-06-06 (updated 2026-06-07)
**Status:** Implemented

## Overview

Na página de catálogo (`/personal-trainers`) os personais são segregados por cidade.
O usuário escolhe a cidade através de um seletor composto (ícone + input de texto +
ListBox virtualizado) que segue o padrão visual do projeto (tipografia `font-display`,
bolha de gradiente violeta, campos `rounded-2xl`). A cidade pode ser:

1. digitada/selecionada manualmente na lista de cidades brasileiras; ou
2. detectada via geolocalização do navegador (best-effort, plugável).

A localização escolhida dirige o filtro `city` existente (via URL) e é persistida em
`localStorage`, sendo restaurada como padrão em visitas futuras.

**Fetch deferido:** a listagem principal de trainers (`usePersonalTrainers`) só dispara
após o usuário selecionar uma cidade **ou** optar por ver todos. O carousel de destaques
continua carregando independentemente.

## Decisions

- **Componente composto:** `composite/catalog/FTCitySelector` orquestra via composable e
  **renderiza o primitivo existente `ui/FTCityPicker`**. O primitivo permanece
  apresentacional; formulários de perfil continuam inalterados (geolocalização desligada
  por padrão).
- **Modal de entrada:** `composite/catalog/FTCitySelectorModal` substitui o banner inline
  no topo do catálogo. Card branco centralizado com "BRASIL", "Explorar personais" e o
  `FTCitySelector`. Aparece quando não há `city` na URL **e** nenhuma localização salva
  no `localStorage`.
- **Skip / dismiss:** botão "Ver todos os personais" ou fechar a modal (X / overlay)
  equivale a listar todos os trainers sem filtro de cidade.
- **Select base:** Nuxt UI `UInputMenu` (combobox virtualizado), consistente com
  `FTCityPicker`.
- **Integração com a lista:** dirige o filtro `city` via URL (`useTrainerFilters`) **e**
  persiste em `localStorage`. Restauração salva aplica o filtro sem reabrir a modal.
- **Geolocalização:** `useGeoLocation` + resolver plugável; implementação padrão offline via `createBrazilianGeoResolver()` (centroides IBGE + Haversine). Ver [2026-06-07-geo-resolver-design.md](./2026-06-07-geo-resolver-design.md). Erros localizados.
- **Placement:** modal no carregamento da page **e** seletor no `FTFilterPanel` (sidebar +
  drawer mobile) para trocar cidade depois.
- **Gate composable:** `useCatalogCityGate` controla `fetchEnabled`, `modalOpen` e
  `isAwaitingCity` via `useState` compartilhado entre modal, listagem e toolbar.

## Architecture

```
app/composables/catalog/useCatalogCityGate.ts      # gate: modal + fetch deferido
app/composables/core/useLocalStorage.ts            # genérico, SSR-safe, reativo
app/composables/core/useGeoLocation.ts             # localização + detect/select/clear
app/composables/components/useFTCitySelector.ts    # wiring: geo + filtro URL + cidades
app/components/composite/catalog/FTCitySelectorModal/
  ├─ FTCitySelectorModal.vue       # modal UModal + card hero + FTCitySelector
  ├─ FTCitySelectorModal.spec.ts
  ├─ FTCitySelectorModal.stories.ts
  └─ locales/{pt-BR,en-US,es-ES}.json  # cityModal.*
app/components/composite/catalog/FTCitySelector/
  ├─ FTCitySelector.vue
  ├─ FTCitySelector.spec.ts
  ├─ FTCitySelector.stories.ts
  └─ locales/{pt-BR,en-US,es-ES}.json  # cityFilter.*
app/components/ui/FTCityPicker/
  ├─ FTCityPicker.vue
  ├─ FTCityPicker.spec.ts
  └─ FTCityPicker.stories.ts
```

### `useCatalogCityGate()`

Estado compartilhado (`useState`):
- `catalog-fetch-enabled` — `false` até decisão do usuário
- `catalog-city-modal-open` — controla `UModal`
- `catalog-city-gate-initialized` — evita reinicialização

Fluxo (client, síncrono na setup para evitar flash):
1. `filters.city` na URL → `fetchEnabled = true`, modal fechada
2. `geo.selectedLocation` salva → modal fechada, aguarda restauração via
   `useFTCitySelector` → watcher em `filters.city` habilita fetch
3. Sem cidade → modal aberta, fetch bloqueado
4. `resolveWithAll()` ou dismiss da modal → limpa `city`, `fetchEnabled = true`

Expõe: `{ fetchEnabled, modalOpen, isAwaitingCity, resolveWithAll }`.

### `usePersonalTrainers({ enabled })`

Aceita `enabled?: Ref<boolean>` (default `true`). O watcher de `query` só chama
`fetchTrainers()` quando `enabled.value === true`. Usado por `useFTTrainerList` e
`useFTCatalogToolbar` com `fetchEnabled` do gate.

### `useFTCitySelector(options?)` (catálogo)

Conecta `useGeoLocation` + `useTrainerFilters` + `useFTBrazilianCities`:
- `city`/`state` locais; watcher empurra filtro `city` para URL e persiste localização.
- `onMounted`: restaura localização salva quando URL não tem `city`.

### `FTCitySelectorModal` (composto)

Renderiza `UModal` dismissible com card hero (tipografia + gradient orb) e
`FTCitySelector` + CTA skip. Orquestra via `useCatalogCityGate`.

## Visual

- Modal: card branco `rounded-3xl`, `shadow-xl`, texto centralizado.
- Hero: "BRASIL" (`text-violet-600`, uppercase), "Explorar personais" (`font-display`).
- Input: `FTCityPicker` com ícone violeta, placeholder "Buscar cidade...", botão geo.
- Estado aguardando na listagem: `FTEmptyState` com mensagem `cityModal.awaitingCity`.

## Testing (≥80%)

| Arquivo | Cenários |
|---------|----------|
| `useCatalogCityGate.spec.ts` | modal aberta sem city; fetch enabled com city na URL; aguarda restore; select habilita fetch; resolveWithAll; dismiss |
| `usePersonalTrainers.spec.ts` | fetch bloqueado com `enabled=false`; dispara ao habilitar |
| `FTCitySelectorModal.spec.ts` | render do card; skip chama resolveWithAll |
| `useFTCitySelector.spec.ts` | (existentes) select, clear, detect, restore |
| `FTCitySelector.spec.ts` | (existentes) picker + geo |

## Out of scope / YAGNI

- Alterar fetch do carousel de destaques
- Filtro por `city + state` combinado
- ~~Reverse-geocoding embarcado por padrão~~ (implementado em 2026-06-07 — ver geo-resolver-design)
- Múltiplas cidades selecionadas simultaneamente
