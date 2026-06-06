# City Selector (Segregação por cidade) — Design Spec

**Date:** 2026-06-06
**Status:** Approved — pending implementation

## Overview

Na página de catálogo (`/personal-trainers`) os personais passam a ser segregados por
cidade. O usuário escolhe a cidade através de um select customizado (ícone + input de
texto + ListBox) que segue o padrão visual do projeto (tipografia `font-display`, bolha
de gradiente violeta, campos `rounded-2xl`). A cidade pode ser:

1. digitada/selecionada manualmente na lista de cidades brasileiras; ou
2. detectada via geolocalização do navegador.

A localização escolhida dirige o filtro `city` existente (via URL) e é persistida em
`localStorage`, sendo restaurada como padrão em visitas futuras.

## Decisions

- **Componente:** estender o primitivo existente `FTCityPicker` (não criar componente
  novo). Ele ganha uma afordância de geolocalização e passa a servir também o catálogo,
  mantendo-se **apresentacional** (props + emits). O uso atual em formulários de perfil
  permanece inalterado (geolocalização desligada por padrão).
- **Select base:** Nuxt UI `UInputMenu` (combobox = input + listbox virtualizado),
  consistente com o uso atual do `FTCityPicker`.
- **Integração com a lista:** dirige o filtro `city` já existente em `ListQuery` via URL
  (`useTrainerFilters`) **e** persiste em `localStorage`. No carregamento, se a URL não
  tiver `city` mas houver localização salva, ela é aplicada como padrão.
- **Geolocalização:** `useGeoLocation` usa `navigator.geolocation` + um **resolver
  plugável** (coords → cidade). O resolver padrão é best-effort; quando não há
  resolver/correspondência, sinaliza fallback "manual" para o usuário digitar. Permissão
  negada / API indisponível são tratadas como erro amigável.
- **localStorage:** composable `useLocalStorage` **escrito do zero** (SSR-safe, reativo,
  JSON), sem envolver o `useLocalStorage` do VueUse.
- **Placement:** o select aparece **tanto no header** ("Explorar personais") **quanto no
  `FTFilterPanel`** (sidebar + drawer mobile).
- **Pasta de composables genéricos:** novo diretório `app/composables/core/`.

## Architecture

```
app/composables/core/useLocalStorage.ts          # genérico, SSR-safe, reativo
app/composables/core/useGeoLocation.ts            # localização selecionada + detect/select/clear (persistida)
app/composables/components/useFTCitySelector.ts   # wiring: geo + filtro URL + cidades (catálogo)
app/components/ui/FTCityPicker/
  ├─ FTCityPicker.vue          # estendido: afordância de geolocalização
  ├─ FTCityPicker.spec.ts      # estendido
  ├─ FTCityPicker.stories.ts   # NOVO (exigido pela especificação de componentes)
  └─ locales/{pt-BR,en-US,es-ES}.json  # NOVO (strings de geolocalização)
```

Camadas (DDD-lite): a orquestração (geo, URL, storage) vive em composables; o componente
`ui/FTCityPicker` permanece primitivo (apenas props/emits + `U*` + Tailwind).

### `useLocalStorage<T>(key, defaultValue)`

- Retorna um `Ref<T>` reativo sincronizado com `localStorage`.
- **SSR-safe:** no servidor (ou sem `window`) apenas retorna o `defaultValue`, sem
  acessar `localStorage`.
- Serialização JSON na leitura/escrita; `watch` grava de volta (deep).
- Tratamento gracioso de exceções (modo privado / quota) sem quebrar a aplicação.

### `useGeoLocation(options?)`

Estado:
- `selectedLocation: Ref<{ city, state, value } | null>` — persistido via `useLocalStorage`
  na chave `ft:geo-location`.
- `pending: Ref<boolean>`, `error: Ref<GeoError | null>`, `isSupported: ComputedRef<boolean>`.

Funções:
- `detectByBrowser()` — `navigator.geolocation.getCurrentPosition`; resolve coords → cidade
  via `options.resolver` (plugável); trata `unsupported`, `permission-denied`, `manual`
  (sem resolver/sem match).
- `selectByName(cityItem)` — define a localização a partir de uma cidade do dataset.
- `clear()` — limpa a localização (e o filtro derivado, no nível do `useFTCitySelector`).

`GeoError` = `'unsupported' | 'permission-denied' | 'position-unavailable' | 'manual'`.

### `useFTCitySelector()` (catálogo)

Conecta `useGeoLocation` + `useTrainerFilters` + `useFTBrazilianCities`:
- `onSelect(cityItem)` → `updateFilters({ city })` + `geo.selectByName(cityItem)`.
- `onDetect()` → `geo.detectByBrowser()`; ao resolver, `updateFilters({ city })`.
- `onClear()` → `updateFilters({ city: undefined })` + `geo.clear()`.
- `onMounted` → se `filters.city` vazio e `geo.selectedLocation` presente, aplica como
  padrão (push para URL + prefill do input).
- Expõe `pending` (detecting) e `error` (geoError) para o componente.

### `FTCityPicker` (extensão)

Novas props/emits, todas opcionais e retrocompatíveis:
- `withGeolocation?: boolean` (default `false`) — renderiza o botão "detectar minha
  localização" (`i-lucide-locate-fixed`).
- `detecting?: boolean` — estado de loading do botão.
- `geoError?: string` — mensagem de erro exibida abaixo do campo.
- `emit('detect')` — disparado ao clicar no botão de geolocalização.

O componente permanece responsável apenas pela apresentação; o wiring é externo.

## Visual

- Tipografia `font-display`; bolha de gradiente violeta (consistente com o header e
  `FTGradientBubbles`).
- Campos `rounded-2xl` via `useFTProfileEditFieldUi`.
- `UInputMenu` com ícone líder `i-lucide-map-pin` (selecionado) / `i-lucide-search`
  (busca), listbox virtualizado; botão de detecção `i-lucide-locate-fixed`.

## Testing (≥80%)

| Arquivo | Cenários |
|---------|----------|
| `useLocalStorage.spec.ts` | default quando vazio; leitura de valor existente; escrita reativa; SSR/no-window retorna default; exceção tratada; round-trip JSON |
| `useGeoLocation.spec.ts` | detect sucesso (resolver); `permission-denied`; `unsupported`; `manual` (sem resolver); `selectByName`; `clear`; persistência em localStorage |
| `useFTCitySelector.spec.ts` | select atualiza filtro `city`; detect atualiza filtro; restauração na montagem; clear remove filtro |
| `FTCityPicker.spec.ts` (estender) | render do botão quando `withGeolocation`; emit `detect`; estado `detecting`; exibição de `geoError`; comportamentos existentes |
| `FTCityPicker.stories.ts` (novo) | `Default`, `Selected`, `WithGeolocation`, `Detecting` |

Mocks: `navigator.geolocation` e `resolver` injetável tornam tudo offline-testável.

## Docs to update

- `docs/specs/especificacao-componentes-ft.md` — inventário + nota sobre `composables/core/`
  e o padrão de geolocalização.
- `docs/specs/estrutura-pastas.md` — registrar `app/composables/core/`.
- Sincronização `.pen` do `FTCityPicker` conforme §9 da especificação de componentes.

## Out of scope / YAGNI

- Filtro por `city + state` combinado (o `ListQuery` só tem `city`; mantém-se string única).
- Reverse-geocoding embarcado com coordenadas no dataset (resolver permanece plugável).
- Múltiplas cidades selecionadas simultaneamente.
