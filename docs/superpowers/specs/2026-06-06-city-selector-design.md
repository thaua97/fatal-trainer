# City Selector (Segregação por cidade) — Design Spec

**Date:** 2026-06-06
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

## Decisions

- **Componente composto:** novo `composite/catalog/FTCitySelector` que orquestra via
  composable e **renderiza o primitivo existente `ui/FTCityPicker`** (doutrina ui ↔
  composite). O primitivo permanece apresentacional (props + emits); o uso atual em
  formulários de perfil continua inalterado (geolocalização desligada por padrão).
- **Select base:** Nuxt UI `UInputMenu` (combobox = input + listbox virtualizado),
  consistente com o uso atual do `FTCityPicker`.
- **Integração com a lista:** dirige o filtro `city` já existente em `ListQuery` via URL
  (`useTrainerFilters`) **e** persiste em `localStorage`. No carregamento, se a URL não
  tiver `city` mas houver localização salva, ela é aplicada como padrão.
- **Geolocalização:** `useGeoLocation` usa `navigator.geolocation` + um **resolver
  plugável** (coords → cidade). O resolver padrão é offline/best-effort; quando não há
  resolver/correspondência, sinaliza fallback `manual` para o usuário digitar. Permissão
  negada / API indisponível são tratadas como erro amigável e localizado.
- **localStorage:** composable `useLocalStorage` **escrito do zero** (SSR-safe, reativo,
  JSON), sem envolver o `useLocalStorage` do VueUse.
- **Placement:** o seletor aparece **no header** ("Explorar personais") **e no
  `FTFilterPanel`** (sidebar + drawer mobile).
- **Composables genéricos:** novo diretório `app/composables/core/`.

## Architecture

```
app/composables/core/useLocalStorage.ts            # genérico, SSR-safe, reativo
app/composables/core/useGeoLocation.ts             # localização + detect/select/clear (persistida)
app/composables/components/useFTCitySelector.ts    # wiring: geo + filtro URL + cidades (catálogo)
app/components/composite/catalog/FTCitySelector/
  ├─ FTCitySelector.vue          # composto: orquestra e renderiza FTCityPicker
  ├─ FTCitySelector.spec.ts
  ├─ FTCitySelector.stories.ts   # Composite/Catalog/FTCitySelector
  └─ locales/{pt-BR,en-US,es-ES}.json  # cityFilter.* (label/placeholder/detect/errors)
app/components/ui/FTCityPicker/
  ├─ FTCityPicker.vue            # primitivo (icone + UInputMenu + botão geo)
  ├─ FTCityPicker.spec.ts
  └─ FTCityPicker.stories.ts     # NOVO (UI/FTCityPicker)
```

Camadas (DDD-lite): a orquestração (geo, URL, storage) vive em composables; o componente
`ui/FTCityPicker` permanece primitivo (apenas props/emits + `U*` + Tailwind); o composite
`FTCitySelector` conecta os dois.

### `useLocalStorage<T>(key, defaultValue, options?)`

- Retorna um `Ref<T>` reativo sincronizado com `localStorage`.
- **SSR-safe:** no servidor (ou sem `window`) apenas retorna o `defaultValue`.
- Serialização JSON (override via `options.serializer`); `watch` deep grava de volta;
  `null`/`undefined` removem a chave.
- Tratamento gracioso de exceções (modo privado / quota / JSON corrompido).

### `useGeoLocation(options?)`

Estado:
- `selectedLocation: Ref<GeoLocationValue | null>` — persistido via `useLocalStorage` na
  chave `ft:geo-location`.
- `pending`, `error: Ref<GeoError | null>`, `isSupported: ComputedRef<boolean>`.

Funções:
- `detectByBrowser()` — `getCurrentPosition`; resolve coords → cidade via
  `options.resolver` (plugável); trata `unsupported`, `permission-denied`,
  `position-unavailable`, `manual`.
- `selectByName(city)` — define a localização a partir de uma `BrazilianCity`.
- `clear()` — limpa a localização.

`GeoError = 'unsupported' | 'permission-denied' | 'position-unavailable' | 'manual'`.

### `useFTCitySelector(options?)` (catálogo)

Conecta `useGeoLocation` + `useTrainerFilters` + `useFTBrazilianCities`:
- `city`/`state` são refs locais; um único `watch([city, state])` (batched) empurra o
  filtro `city` para a URL e persiste a localização — suporta a escrita dupla do picker.
- `watch(() => filters.value.city)` ressincroniza ao navegar (back/forward).
- `onMounted`: se a URL não tem `city` e há localização salva, aplica-a (propaga para a
  URL via o watcher).
- `onDetect()` roda `geo.detectByBrowser()`; `onClear()` limpa cidade/estado.
- `geoError` é a mensagem localizada (`cityFilter.errors.*`) derivada de `geo.error`.
- Aceita `options.resolver` para injetar um geocodificador.

### `FTCitySelector` (composto)

Props opcionais: `label`, `placeholder`, `testId`. Renderiza `FTCityPicker` com
`with-geolocation`, `v-model:city/state`, `:detecting`, `:geo-error` e `@detect`.

## Visual

- Tipografia `font-display`; bolha de gradiente violeta no header do catálogo.
- Campos `rounded-2xl` via `useFTProfileEditFieldUi`.
- `UInputMenu` com ícone líder `i-lucide-map-pin` (selecionado) / `i-lucide-search`
  (busca), listbox virtualizado; botão de detecção `i-lucide-locate-fixed`.

## Testing (≥80%)

| Arquivo | Cenários |
|---------|----------|
| `useLocalStorage.spec.ts` | default quando vazio; leitura existente; escrita reativa; round-trip JSON; remoção em `null`; JSON corrompido; SSR/no-window; falha de escrita tratada |
| `useGeoLocation.spec.ts` | detect sucesso (resolver); `permission-denied`; `position-unavailable`; `manual`; `unsupported`; `selectByName` + persistência; `clear`; restauração do localStorage |
| `useFTCitySelector.spec.ts` | select atualiza filtro `city`; clear remove filtro; detect aplica cidade; restauração na montagem; erro localizado quando não suportado |
| `FTCitySelector.spec.ts` | render do picker com geo; label/placeholder padrão e custom; erro de geo localizado após detect falho |
| `FTCityPicker.spec.ts` | comportamentos existentes (mantidos verdes) |

Cobertura via `@vitest/coverage-v8` (`npm run test:coverage`), thresholds 80% nos arquivos
novos. Mocks: `navigator.geolocation`, `useTrainerFilters` (global) e `useFTBrazilianCities`.

## Docs updated

- `docs/specs/especificacao-componentes-ft.md` — `FTCitySelector` no inventário;
  `composables/core/` e padrão de geolocalização.
- `docs/specs/estrutura-pastas.md` — registro de `app/composables/core/`.

## Out of scope / YAGNI

- Filtro por `city + state` combinado (o `ListQuery` só tem `city`).
- Reverse-geocoding embarcado com coordenadas no dataset (resolver permanece plugável).
- Resolver de API ao vivo embarcado por padrão.
- Múltiplas cidades selecionadas simultaneamente.
