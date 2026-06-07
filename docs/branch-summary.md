# Resumo da Branch — `refactor/trainer-list-by-city`

## Informações gerais

| Campo | Valor |
|-------|-------|
| **Branch** | `refactor/trainer-list-by-city` |
| **Repositório** | fatal-trainer (frontend Nuxt) |
| **Base** | `dev` (merge PR #4 — auth, denúncia, admin) |
| **Objetivo** | Segregar listagem de personais por cidade com modal de entrada e geolocalização offline |

---

## Objetivo da branch

Implementar a **segregação por cidade** no catálogo (`/personal-trainers`):

1. Bloquear fetch da listagem até o usuário escolher uma cidade ou optar por ver todo o Brasil
2. Exibir **modal de boas-vindas** centralizada para seleção inicial de cidade
3. Substituir o input inline de cidade nos filtros por um **botão-gatilho** que reabre a modal
4. Resolver coordenadas do navegador para a cidade brasileira mais próxima **sem API externa**

---

## Principais entregas

### Geolocalização offline (`feat(geo)`)

- `shared/domain/geo/services/resolve-nearest-brazilian-city.ts` — algoritmo haversine sobre dataset de coordenadas
- `shared/data/brazilian-cities-coords.json` — lat/lng das cidades brasileiras
- `app/composables/core/createBrazilianGeoResolver.ts` — adapter plugável em `useGeoLocation`
- `scripts/generate-city-coords.mjs` + script `pnpm generate:city-coords`
- Spec: `docs/superpowers/specs/2026-06-07-geo-resolver-design.md`

### Gate de cidade no catálogo (`feat(catalog)`)

- `useCatalogCityGate` — estado compartilhado (`fetchEnabled`, `modalOpen`, `openModal`, `resolveWithAll`)
- `usePersonalTrainers({ enabled })` — fetch condicional até decisão do usuário
- `FTTrainerList` — empty state "Selecione uma cidade…" enquanto aguarda
- Remoção do banner hero inline com seletor de cidade na página do catálogo

### Modal e filtro (`feat(catalog)`)

- `FTCitySelectorModal` — modal centralizada (UModal) com card hero, gradientes e `FTCitySelector`
- `FTCityFilterButton` — botão nos filtros (sidebar + drawer mobile) com mesmo visual do city picker; abre a modal
- `FTGradientBubbles` — prop `scope="contained"` para efeitos dentro do card da modal
- Correção de centralização: remoção de `relative` no `ui.content` do UModal (preserva `fixed` + translate)

### Auth / header (`fix(auth)`)

- Plugin `auth.ts` (substitui `auth.client.ts`) — skip de `fetchMe` no SSR quando API é cross-origin (`useMockApi=false`)
- `FTAppHeader` — evita flash login/guest antes da sessão ser restaurada (`initialized`)

---

## Fluxo do usuário

```mermaid
flowchart TD
  A[/personal-trainers] --> B{Cidade na URL?}
  B -->|Sim| C[Listagem habilitada]
  B -->|Não| D{Localização salva?}
  D -->|Sim| E[Restaura cidade e habilita fetch]
  D -->|Não| F[Modal aberta]
  F --> G[Usuário seleciona cidade]
  F --> H[Usuário pula: todo o Brasil]
  G --> C
  H --> C
  I[Filtros: botão cidade] --> F
```

---

## Arquivos novos (principais)

| Área | Arquivos |
|------|----------|
| Geo | `createBrazilianGeoResolver.ts`, `resolve-nearest-brazilian-city.ts`, `brazilian-cities-coords.json` |
| Catalog gate | `useCatalogCityGate.ts` |
| UI | `FTCitySelectorModal/`, `FTCityFilterButton/` |
| Testes | `useCatalogCityGate.spec.ts`, `createBrazilianGeoResolver.spec.ts`, `resolve-nearest-brazilian-city.spec.ts` |
| Storybook | `.storybook/mocks/useCatalogCityGate.ts` |

---

## Testes

```bash
pnpm vitest run tests/unit/composables/useCatalogCityGate.spec.ts
pnpm vitest run tests/unit/composables/usePersonalTrainers.spec.ts
pnpm vitest run tests/unit/composables/useFTCitySelector.spec.ts
pnpm vitest run tests/unit/composables/createBrazilianGeoResolver.spec.ts
pnpm vitest run app/components/composite/catalog/FTCityFilterButton/
pnpm vitest run app/components/composite/catalog/FTCitySelectorModal/
```

---

## Como executar

```bash
cd fatal-trainer
pnpm install
pnpm dev
# http://localhost:3000/personal-trainers
```

Para API externa (sem mock Nitro):

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3333/api
NUXT_PUBLIC_USE_MOCK_API=false
```

---

## Commits desta branch

| Commit | Descrição |
|--------|-----------|
| `feat(geo)` | Resolver de cidade por coordenadas + script de geração |
| `feat(catalog)` | Gate de fetch + integração na listagem e toolbar |
| `feat(catalog)` | Modal de cidade + botão nos filtros + gradient bubbles contained |
| `fix(auth)` | Sessão no client com API cross-origin + header sem flash |
| `docs` | Resumo da branch e specs atualizadas |

---

## Pendências / fora de escopo

- Reverse geocoding via API externa (Nominatim etc.)
- Filtro combinado `city + state` na URL
- Múltiplas cidades simultâneas
- Integração plena com `fatal-trainer-backend` PostgreSQL
