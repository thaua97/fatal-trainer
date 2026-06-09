# Fatal Trainer

Catálogo de personal trainers autônomos — Vue 3, Nuxt 4, TypeScript.

Solução desenvolvida para o [desafio técnico Front-end da Atlas Technologies](docs/challenge.md): listagem de profissionais com busca, filtros, ordenação, carregamento incremental e perfil detalhado.

> **Demo:** _link da solução publicada — a preencher_
>
> **Vídeo de apresentação:** _link do vídeo (máx. 5 min) — a preencher_

---

## Sobre o projeto

Plataforma web para descobrir e contratar personal trainers. A experiência prioriza mobile first, componentização e performance em listas grandes.

### Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com hero, features e preview de 6 trainers |
| `/personal-trainers` | **Catálogo completo** — busca, filtros, ordenação e paginação |
| `/personal-trainers/[id]` | Perfil detalhado do profissional |
| `/personal-trainers/favoritos` | Lista de favoritos (requer login) |

---

## Atendimento ao desafio

Mapeamento dos requisitos mínimos do [`docs/challenge.md`](docs/challenge.md) para a implementação:

| Requisito | Implementação |
|-----------|---------------|
| Listagem com foto, nome, profissão e preço | [`FTTrainerCard`](app/components/composite/catalog/FTTrainerCard/FTTrainerCard.vue) |
| Busca por nome ou profissão | [`filter-trainers.ts`](shared/domain/catalog/services/filter-trainers.ts) + [`FTSearchInput`](app/components/ui/FTSearchInput/FTSearchInput.vue) |
| Filtragem de resultados | [`FTFilterPanel`](app/components/composite/catalog/FTFilterPanel/FTFilterPanel.vue) — especialidade, modalidade, cidade, promoção, preço, rating |
| Ordenação | [`useFTSortSelect`](app/composables/components/useFTSortSelect.ts) — preço, avaliação, distância, nome, reviews, experiência, desconto |
| Carregamento sob demanda | [`usePersonalTrainers`](app/composables/catalog/usePersonalTrainers.ts) — paginação (`pageSize: 20`) + botão "carregar mais" |
| Perfil com detalhes mínimos | [`personal-trainers/[id].vue`](app/pages/personal-trainers/[id].vue) + [`FTProfileHeader`](app/components/composite/profile/FTProfileHeader/FTProfileHeader.vue) |
| Responsividade mobile-first | Filtros em drawer (mobile) e sidebar (desktop) em [`personal-trainers/index.vue`](app/pages/personal-trainers/index.vue) |
| 500 profissionais | **Com backend:** seed de 500 em [`fatal-trainer-backend/prisma/seed.ts`](../fatal-trainer-backend/prisma/seed.ts). **Mock Nitro:** 44 no JSON / 36 gerados em dev — ver [Observações para avaliação](#observações-para-avaliação) |

---

## Funcionalidades

### Núcleo do catálogo (escopo do desafio)

- Listagem paginada com cards responsivos
- Busca com debounce de 200 ms
- Filtros combináveis com chips ativos e contador de resultados
- Ordenação por múltiplos critérios
- Perfil com foto, nome, profissão, descrição, preço, avaliação, localização, galeria e reviews
- Carrossel de trainers em destaque na listagem

### Extras (além do mínimo)

Priorizados após o núcleo do catálogo, para demonstrar visão de produto e manutenibilidade:

- Autenticação (login/registro) e painel do trainer
- Favoritos sincronizados com a API
- Painel administrativo (usuários, denúncias, promoções)
- Formulário de denúncia
- Internacionalização (pt-BR, en-US, es-ES)
- Testes automatizados: Vitest (~138 specs), Cypress E2E, Storybook

---

## Como executar o projeto

**Requisitos:** Node.js `^22.12.0 || ^24.11.0 || >=26.0.0` (Nuxt 4.4+), pnpm ou npm

> Em Node 20, `npm run lint` pode falhar por incompatibilidade com Nuxt 4.4.

### Modo A — Mock Nitro (sem backend)

Setup mais simples. Usa a API mock embutida no Nitro (`server/api/`).

```bash
git clone <repo-url>
cd fatal-trainer
pnpm install
cp .env.example .env
```

No `.env`, defina:

```env
NUXT_PUBLIC_USE_MOCK_API=true
```

```bash
pnpm dev
```

Acesse o catálogo em [http://localhost:3000/personal-trainers](http://localhost:3000/personal-trainers).

### Modo B — API real com 500 trainers (recomendado)

Recomendado para validar o requisito de volume de 500 profissionais.

```bash
# Terminal 1 — backend
cd fatal-trainer-backend
docker compose up -d
npm install
npm run dev

# Terminal 2 — front
cd fatal-trainer
pnpm install
cp .env.example .env
```

No `.env` do front:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3333/api
NUXT_PUBLIC_USE_MOCK_API=false
```

```bash
pnpm dev
```

Detalhes da integração: [`docs/specs/api-integration-frontend.md`](docs/specs/api-integration-frontend.md).

### Testes E2E (Cypress)

Os testes E2E cobrem os cenários mínimos do [RNF-010](docs/requisitos-nao-funcionais.md) contra a **API real** (PostgreSQL + backend na porta 3333).

| Spec | Cenário | UC |
|------|---------|-----|
| `catalog-listing.cy.ts` | E2E-01 — listagem com cards | UC-01 |
| `catalog-search.cy.ts` | E2E-02 — busca por nome | UC-02 |
| `catalog-filters.cy.ts` | E2E-03 — filtro de especialidade | UC-03 |
| `profile-navigation.cy.ts` | E2E-04/05 — perfil e voltar | UC-06, UC-07 |

**Opção A — orquestrado (recomendado):**

```bash
cd fatal-trainer
pnpm test:e2e
```

O script [`scripts/e2e.sh`](scripts/e2e.sh) sobe PostgreSQL via Docker, executa `db:push` + `db:seed`, inicia API e Nuxt, e roda o Cypress.

**Opção B — servidores manuais:**

```bash
# Terminal 1 — backend
cd fatal-trainer-backend
docker compose up -d
pnpm db:push && pnpm db:seed && pnpm dev

# Terminal 2 — front
cd fatal-trainer
pnpm dev

# Terminal 3 — Cypress
pnpm test:e2e:run        # headless
pnpm test:e2e:open       # interativo
```

**Pré-requisitos:** Docker (PostgreSQL), Node.js. O script `test:e2e` define `NUXT_E2E=true` e proxy `/api` → backend (`127.0.0.1:3333`) para evitar CORS no browser.

Para rodar manualmente com backend real:

```env
NUXT_E2E=true
NUXT_PUBLIC_USE_MOCK_API=false
NUXT_PUBLIC_API_BASE_URL=/api
```

### Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm preview` | Preview do build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Verificação TypeScript |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm test:e2e` | Testes E2E (Cypress) — sobe PostgreSQL, API, Nuxt e executa specs |
| `pnpm test:e2e:run` | Cypress headless (requer API + Nuxt já rodando) |
| `pnpm test:e2e:open` | Cypress interativo (requer API + Nuxt já rodando) |
| `pnpm storybook` | Storybook (porta 6006) |

Os mesmos scripts funcionam com `npm run <script>`.

---

## Decisões técnicas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Framework | Nuxt 4 + Vue 3 + TypeScript | SSR, file-based routing, tipagem end-to-end |
| Arquitetura | DDD-lite (`app/` + `shared/domain/`) | Componentização e separação de responsabilidades sem over-engineering |
| UI | Nuxt UI + Tailwind CSS | Responsividade, acessibilidade base e velocidade de desenvolvimento |
| Dados | API REST (padrão) + Nitro mock (fallback dev) | 500 registros fora do bundle; paginação server-side |
| Estado | `useState` global nos composables | Filtros compartilhados entre toolbar, painel lateral e lista |
| Página inicial | Landing + catálogo em rota dedicada | Priorização de UX de produto; catálogo completo em `/personal-trainers` |
| Testes | Vitest + Cypress + Storybook | Cobertura unitária, fluxos críticos E2E e documentação visual de componentes |

### Fontes de dados

| Cenário | Quantidade | Origem |
|---------|------------|--------|
| Backend com seed | 500 trainers | [`fatal-trainer-backend/prisma/seed.ts`](../fatal-trainer-backend/prisma/seed.ts) |
| JSON persistido | 44 trainers | [`server/data/personal-trainers.json`](server/data/personal-trainers.json) |
| Mock in-memory (dev, JSON vazio) | 36 trainers | [`trainer-repository-storage.ts`](server/services/trainer-repository-storage.ts) via [`trainer-factory.ts`](server/mocks/trainer-factory.ts) |

Avatares e galerias usam fotos fitness do [Pexels](https://www.pexels.com/pt-br/) ([`mock-photos.ts`](server/mocks/mock-photos.ts)) — URLs estáveis via CDN, sem API key.

---

## Performance e Web Vitals

Decisões implementadas para manter a listagem fluida, especialmente em mobile:

| Estratégia | Implementação |
|------------|---------------|
| Paginação server-side | `pageSize: 20` em [`list-query.ts`](shared/domain/catalog/value-objects/list-query.ts) — o dataset completo nunca é carregado no client de uma vez |
| Carregamento incremental | Acúmulo de páginas em [`usePersonalTrainers`](app/composables/catalog/usePersonalTrainers.ts) com botão "carregar mais" |
| Lazy load de imagens | `loading="lazy"` em [`FTAvatar`](app/components/ui/FTAvatar/FTAvatar.vue) e cards do carrossel |
| Debounce na busca | 200 ms em [`FTSearchInput`](app/components/ui/FTSearchInput/FTSearchInput.vue) via `@vueuse/core` |
| SEO técnico | `useSeoMeta` nas páginas de catálogo e perfil |
| SSR | Renderização server-side via Nuxt para melhor TTFB |

Metas orientativas (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1) estão documentadas em [`docs/requisitos-nao-funcionais.md`](docs/requisitos-nao-funcionais.md). Scores Lighthouse mobile ainda não foram medidos e documentados com números — ver [Melhorias futuras](#melhorias-futuras).

---

## Uso de Inteligência Artificial

Ferramenta utilizada: **Cursor**

A IA foi usada como apoio em:

- estruturação de componentes e composables
- geração e revisão de testes unitários
- documentação técnica e specs
- debugging e refatoração

Todas as decisões de arquitetura, priorização de escopo e revisão final do código foram feitas pelo desenvolvedor.

---

## Organização do repositório

O projeto segue **Nuxt 4 nativo** + **DDD-lite**. Documentação completa em [`docs/arquitetura/estrutura-pastas.md`](docs/arquitetura/estrutura-pastas.md).

```
app/                    # Presentation + Application (pages, components, composables)
shared/domain/          # Domain layer (entities, services, value objects)
shared/types/           # DTOs de API
shared/utils/           # Utilitários compartilhados
server/api/             # Infrastructure — API mock (Nitro)
server/services/        # Repositório de dados
server/mocks/           # Gerador de dados mock (dev)
tests/                  # Vitest
cypress/                # E2E
stories/                # Storybook
docs/                   # PRD, RFs, RNFs, arquitetura, challenge
```

---

## Melhorias futuras

- Aumentar o mock Nitro para 500 trainers (ou script de geração do JSON)
- Avaliar tornar `/` a listagem completa ou redirecionar para `/personal-trainers`
- Documentar scores Lighthouse mobile no README após medição
- Corrigir testes falhando em `FTTrainerList` e `FTLandingTrainersSection`
- Adicionar parâmetro `city` no endpoint `GET /personal-trainers/featured` do backend

---

## Observações para avaliação

1. **Catálogo completo em `/personal-trainers`** — a home (`/`) é uma landing com preview de 6 trainers; a listagem com busca, filtros e paginação está na rota dedicada. Decisão de priorização de UX de produto, não de omissão do escopo.

2. **500 profissionais** — para validar o volume exigido pelo desafio, use o **Modo B** (backend com seed de 500). O mock Nitro standalone tem volume menor (44 no JSON ou 36 gerados em dev).

3. **Escopo expandido** — auth, admin, favoritos e denúncias foram desenvolvidos após o núcleo do catálogo, demonstrando evolução incremental da solução.

4. **Referência do desafio** — escopo original em [`docs/challenge.md`](docs/challenge.md).

---

## Documentação adicional

- [RFCs — decisões arquiteturais](docs/rfc.md)
- [Desafio técnico (challenge)](docs/challenge.md)
- [PRD](docs/PRD.md)
- [Requisitos funcionais](docs/requisitos-funcionais.md)
- [Requisitos não funcionais](docs/requisitos-nao-funcionais.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Integração com API REST](docs/specs/api-integration-frontend.md)
- [Estrutura de pastas (spec)](docs/arquitetura/estrutura-pastas.md)
