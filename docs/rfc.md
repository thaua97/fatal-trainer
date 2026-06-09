# RFCs — Fatal Trainer (Front-end)

**Versão:** 1.1  
**Data:** 2026-06-08  
**Stack:** Nuxt 4 · Vue 3 · TypeScript · Nuxt UI · Tailwind CSS

Este documento registra as **decisões arquiteturais e de produto** (RFCs) adotadas no front-end. Cada entrada segue o formato: **Contexto → Decisão → Consequências → Trade-offs → Referências**.

Para specs detalhadas de features, ver também [`docs/superpowers/specs/`](./superpowers/specs/).

---

## Índice

| RFC | Título | Status |
|-----|--------|--------|
| [RFC-001](#rfc-001-layout-nuxt-4-nativo) | Layout Nuxt 4 nativo | Aceita |
| [RFC-002](#rfc-002-ddd-lite-no-front-end) | DDD-lite no front-end | Aceita |
| [RFC-003](#rfc-003-biblioteca-de-componentes-ft) | Biblioteca de componentes FT* | Aceita |
| [RFC-004](#rfc-004-estado-global-via-usestate) | Estado global via `useState` | Aceita |
| [RFC-005](#rfc-005-camada-de-services-http) | Camada de services HTTP | Aceita |
| [RFC-006](#rfc-006-api-rest--nitro-mock) | API REST + Nitro mock | Aceita |
| [RFC-007](#rfc-007-landing--catálogo-em-rota-dedicada) | Landing + catálogo em rota dedicada | Aceita |
| [RFC-008](#rfc-008-carregamento-incremental-da-listagem) | Carregamento incremental da listagem | Aceita |
| [RFC-009](#rfc-009-perfil-em-página-dedicada) | Perfil em página dedicada | Aceita |
| [RFC-010](#rfc-010-gate-de-cidade-e-fetch-deferido) | Gate de cidade e fetch deferido | Aceita |
| [RFC-011](#rfc-011-geolocalização-com-resolver-plugável) | Geolocalização com resolver plugável | Aceita |
| [RFC-012](#rfc-012-carrossel-de-destaques-no-client) | Carrossel de destaques no client | Aceita |
| [RFC-013](#rfc-013-tratamento-de-erros-de-api) | Tratamento de erros de API | Aceita |
| [RFC-014](#rfc-014-internacionalização) | Internacionalização | Aceita |
| [RFC-015](#rfc-015-estratégia-de-testes) | Estratégia de testes | Aceita |
| [RFC-016](#rfc-016-painel-admin-e-impersonation) | Painel admin e impersonation | Aceita |
| [RFC-017](#rfc-017-promoções-via-templates-admin) | Promoções via templates (admin) | Aceita |

---

## RFC-001: Layout Nuxt 4 nativo

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

O PRD original propunha estrutura plana estilo Nuxt 3 (`components/`, `composables/` na raiz). O Nuxt 4 introduz `app/` como `srcDir` e `shared/` para código compartilhado entre client e server.

### Decisão

Adotar o **layout nativo do Nuxt 4**:

```
app/          → presentation + application (pages, components, composables)
shared/       → domain + types + utils (client + server)
server/       → infrastructure (API mock Nitro, services)
```

### Consequências

- Alinhamento com convenções oficiais do Nuxt 4 (RNF-005).
- `shared/domain/` pode ser importado tanto no client quanto no Nitro mock.
- Divergência documentada em relação ao PRD §8.2 — ver [`docs/specs/estrutura-pastas.md`](./specs/estrutura-pastas.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Compatível com releases futuros do Nuxt 4 | Curva de aprendizado para quem vem de Nuxt 3 plano |
| `shared/` evita duplicar domain entre client e Nitro | Mais níveis de pasta que um projeto pequeno "precisaria" |
| Documentação oficial e ecossistema alinhados | PRD e materiais do desafio ficam parcialmente desatualizados |

---

## RFC-002: DDD-lite no front-end

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

O catálogo exige regras de filtro, ordenação, paginação e validação reutilizáveis. Um SPA monolítico dificultaria testes e evolução.

### Decisão

Aplicar **DDD-lite** com bounded contexts e camadas claras, sem over-engineering:

| Camada | Pasta | Responsabilidade |
|--------|-------|------------------|
| Presentation | `app/pages/`, `app/components/` | UI, SEO, composição |
| Application | `app/composables/` | Orquestração, sync com URL, chamadas a services |
| Domain | `shared/domain/` | Entidades, value objects, services puros |
| Infrastructure | `server/`, `app/services/` | API mock, HTTP, persistência |

Bounded contexts: **Catalog**, **Profile**, **Auth**, **Admin**, **Report**, **Review**, **Dashboard**.

### Consequências

- Regras de negócio testáveis sem mount de componentes (`filter-trainers.ts`, `list-query.ts`, etc.).
- Composables orquestram; componentes `.vue` não fazem `$fetch` direto.
- Composables aninhados habilitados via `imports.dirs: ['composables/**']` em `nuxt.config.ts`.

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Regras testáveis sem browser; fronteiras claras | Mais arquivos e indireção que um CRUD simples |
| Facilita onboarding por contexto (catalog, auth…) | Risco de "DDD de fachada" se lógica vazar para `.vue` |
| Domain compartilhado com mock Nitro | Nem todo bounded context tem a mesma maturidade (ex.: admin mais fino) |

---

## RFC-003: Biblioteca de componentes FT*

**Status:** Aceita  
**Data:** 2026-06-05

### Contexto

Precisávamos de uma biblioteca consistente, testável e documentada visualmente, alinhada ao design system (Pencil + Nuxt UI).

### Decisão

- Prefixo **`FT`** + PascalCase em inglês (`FTTrainerCard`).
- **Primitivos** em `app/components/ui/` — props only, sem importar outros `FT*`.
- **Compostos** em `app/components/composite/{context}/` — montam primitivos + composables `useFT*`.
- Cada componente exige **`.vue` + `.spec.ts` + `.stories.ts`** na mesma pasta.
- Texto visível em português; código em inglês.
- `pathPrefix: false` — auto-import pelo nome da pasta (`FTAvatar`, não `UiFTAvatar`).

### Consequências

- Regra de dependência unidirecional: `composite → ui → Nuxt UI`.
- HTML semântico obrigatório (landmarks, headings, botões vs links).
- Spec normativa: [`docs/specs/especificacao-componentes-ft.md`](./specs/especificacao-componentes-ft.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Consistência visual e de API entre telas | Overhead: 3 arquivos por componente (vue + spec + story) |
| Storybook como documentação viva | Tempo de manutenção ao evoluir design tokens |
| Separação ui/composite reduz acoplamento | Rigidez: primitivos não podem compor outros `FT*` |

---

## RFC-004: Estado global via `useState`

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

Filtros, ordenação e listagem precisam ser compartilhados entre toolbar, painel lateral, drawer mobile e lista — com SSR e hidratação corretas.

### Decisão

Usar **`useState` do Nuxt** nos composables de domínio (ex.: `useTrainerFilters`, `usePersonalTrainers`, `useCatalogCityGate`) em vez de Pinia ou stores customizados.

### Consequências

- Estado reativo compartilhado entre componentes irmãos sem prop drilling.
- Chaves de estado nomeadas e estáveis (`catalog-fetch-enabled`, etc.).
- Sincronização com query params da URL como fonte de verdade para filtros compartilháveis.

### Alternativas rejeitadas

| Alternativa | Motivo |
|-------------|--------|
| Pinia | Overhead desnecessário para escopo do desafio |
| `provide/inject` local | Não persiste entre rotas/layouts |
| Estado só na URL | Insuficiente para loading, acúmulo de páginas e modais |

### Trade-offs

| Ganho | Custo |
|-------|-------|
| SSR-safe nativo do Nuxt, sem lib extra | Sem DevTools/time-travel como Pinia |
| Hidratação automática entre server e client | Chaves `useState` globais exigem disciplina de nomenclatura |
| Menos boilerplate que store dedicada | Estado + URL podem divergir se sync não for explícita |
| Suficiente para escopo do desafio | Escala mal para apps com dezenas de stores independentes |

---

## RFC-005: Camada de services HTTP

**Status:** Aceita  
**Data:** 2026-06-07

### Contexto

Composables chamavam `$fetch('/api/...')` diretamente, acoplando UI à origem dos dados (Nitro mock vs API externa).

### Decisão

Introduzir **`app/services/`** por bounded context:

```
pages/components → composables (useState + actions) → services → apiFetch → API
```

Services: `auth/`, `catalog/`, `dashboard/`, `report/`, `admin/`.

### Consequências

- Composables preservam API pública; apenas a origem HTTP muda.
- `apiFetch` centraliza base URL, cookies e parsing de erros.
- Facilita alternar mock/produção via env.

Ver: [`docs/specs/api-integration-frontend.md`](./specs/api-integration-frontend.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Troca mock ↔ API real sem refatorar composables | Camada extra (service + apiFetch) para cada bounded context |
| Contrato HTTP centralizado | Duplicação parcial com rotas Nitro mock que espelham a API |
| Testes de composable podem mockar service | Services finos demais viram pass-through sem valor |

---

## RFC-006: API REST + Nitro mock

**Status:** Aceita  
**Data:** 2026-06-07

### Contexto

O desafio exige 500 profissionais fora do bundle. Desenvolvimento local precisa funcionar sem backend.

### Decisão

| Modo | Config | Origem |
|------|--------|--------|
| Produção / integração | `NUXT_PUBLIC_USE_MOCK_API=false` | API Fastify (`NUXT_PUBLIC_API_BASE_URL`) |
| Dev standalone | `NUXT_PUBLIC_USE_MOCK_API=true` | Nitro mock (`server/api/`) |

### Consequências

- Dataset de 500 trainers vive no backend (seed Prisma), não no bundle do front.
- Mock Nitro tem volume menor (44 JSON + 36 gerados em dev) — documentado no README.
- `server/services/` implementa repositório JSON/in-memory espelhando contrato da API real.

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Dev local sem Docker/backend | Dois backends para manter em sync (Fastify + Nitro mock) |
| Onboarding rápido para avaliadores | Mock não reproduz volume de 500 trainers nem edge cases de PG |
| Fallback útil em CI/storybook | Divergência silenciosa se mock atrasar contrato da API real |
| Bundle leve em produção | Comportamento diferente entre modos exige testar ambos |

---

## RFC-007: Landing + catálogo em rota dedicada

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

O desafio pede listagem com busca/filtros. Há tensão entre UX de produto (landing de conversão) e escopo técnico mínimo.

### Decisão

- **`/`** — landing com hero, features e preview de 6 trainers.
- **`/personal-trainers`** — catálogo completo (busca, filtros, ordenação, paginação).

### Consequências

- Escopo do desafio atendido na rota dedicada, não na home.
- Preview na landing usa subset estático/featured, não a listagem completa.
- Decisão de produto documentada em "Observações para avaliação" no README.

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Home focada em conversão e branding | Avaliador pode achar catálogo "escondido" em `/personal-trainers` |
| SEO diferenciado (landing vs listagem) | Dois fluxos de entrada para manter e testar |
| Preview controlado na landing | Usuário precisa de clique extra para ver listagem completa |

---

## RFC-008: Carregamento incremental da listagem

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

500 profissionais exigem paginação. Mobile marketplace favorece scroll contínuo.

### Decisão

- **`pageSize: 20`** server-side (domain + API).
- Botão **"Carregar mais"** acumula páginas no client (`usePersonalTrainers`).
- Resposta inclui `hasMore` para controle de fim de lista.

### Consequências

- Dataset completo nunca carregado de uma vez (RNF performance).
- Debounce de **200 ms** na busca (`FTSearchInput` + `@vueuse/core`).
- Lazy load de imagens em cards e avatares.

### Alternativas rejeitadas

| Alternativa | Motivo |
|-------------|--------|
| Paginação numérica | Menos fluida em mobile marketplace |
| Client-side filter de 500 itens | Viola requisito de dados fora do bundle |

### Trade-offs

| Ganho | Custo |
|-------|-------|
| UX fluida em mobile (marketplace) | Memória do client cresce ao acumular páginas |
| Menos carga inicial que carregar tudo | Usuário não vê total de páginas nem salta para página N |
| Alinhado com backend paginado | Scroll back longo se muitas páginas carregadas |
| `hasMore` evita requests vazias | Re-fetch ao mudar filtros descarta acúmulo anterior |

---

## RFC-009: Perfil em página dedicada

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

Detalhe do trainer pode ser modal, drawer ou rota própria.

### Decisão

Perfil em **`/personal-trainers/[id]`** — página T-02 dedicada com `FTProfileHeader`, galeria, reviews e SEO via `useSeoMeta`.

### Consequências

- URL compartilhável e indexável.
- Deep link com `FTBackLink` para retorno ao catálogo.
- Modal reservado para ações pontuais (contratar, denunciar, review).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| URL compartilhável, SEO e analytics por trainer | Navegação full-page (mais lenta que modal instantâneo) |
| Histórico do browser funciona naturalmente | Estado do catálogo (filtros) precisa ser restaurado no back |
| Conteúdo rico (galeria, reviews) cabe na página | Mais componentes e layout responsivo para manter |

---

## RFC-010: Gate de cidade e fetch deferido

**Status:** Aceita  
**Data:** 2026-06-06

### Contexto

Catálogo segregado por cidade brasileira. Carregar todos os 500 trainers antes da escolha de cidade desperdiça banda.

### Decisão

- **`useCatalogCityGate`** bloqueia fetch até decisão do usuário.
- Modal **`FTCitySelectorModal`** na entrada do catálogo (sem cidade na URL e sem `localStorage`).
- "Ver todos os personais" ou dismiss → fetch habilitado sem filtro de cidade.
- Cidade persiste em `localStorage` + sync com query param `city`.

### Consequências

- Carrossel de destaques carrega independentemente do gate.
- `FTCitySelector` (composite) orquestra; `FTCityPicker` (ui) permanece apresentacional.
- Seletor também disponível no `FTFilterPanel` para troca posterior.

Ver: [`docs/superpowers/specs/2026-06-06-city-selector-design.md`](./superpowers/specs/2026-06-06-city-selector-design.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Economia de banda e requests desnecessárias | Fricção extra: modal obrigatória no primeiro acesso |
| UX localizada (cidade como contexto) | Lógica de gate + localStorage + URL aumenta complexidade |
| "Ver todos" preserva escape hatch | Usuário impaciente pode achar modal intrusiva |
| Destaques carregam sem gate | Comportamento assimétrico (lista vs carrossel) pode confundir |

---

## RFC-011: Geolocalização com resolver plugável

**Status:** Aceita  
**Data:** 2026-06-07

### Contexto

Detecção automática de cidade via GPS exigia reverse geocoding. APIs externas adicionam latência, custo e dependência de rede.

### Decisão

- **`useGeoLocation`** aceita `resolver` injetável.
- Implementação padrão: **`createBrazilianGeoResolver()`** — centroides IBGE + Haversine, threshold 150 km.
- Dataset lazy: `shared/data/brazilian-cities-coords.json` (5571 municípios).
- Lógica pura em `shared/domain/geo/services/resolve-nearest-brazilian-city.ts`.

### Consequências

- Funciona offline após primeiro load de coords.
- Precisão municipal (centroide), não endereço — adequado para filtro de catálogo.
- Testes e Storybook injetam resolver mock.

Ver: [`docs/superpowers/specs/2026-06-07-geo-resolver-design.md`](./superpowers/specs/2026-06-07-geo-resolver-design.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Zero custo de API externa; funciona offline | Precisão de centroide municipal, não endereço exato |
| Sem rate limit ni chave de API | Em fronteiras entre cidades, pode selecionar município vizinho |
| Resolver injetável facilita testes | JSON de coords (~5571 entradas) adiciona payload lazy |
| Privacidade: coords não saem do client | Threshold 150 km pode falhar em áreas remotas |

---

## RFC-012: Carrossel de destaques no client

**Status:** Aceita  
**Data:** 2026-06-07

### Contexto

Trainers em destaque vêm do admin (`featured`). Nem sempre há 6 destacados; fallback com melhores avaliados é desejável.

### Decisão

Orquestração **100% no front**, sem novo endpoint backend:

1. `Promise.all([listFeatured(), list({ sortBy: 'rating' })])`
2. `buildFeaturedCarouselItems()` em `shared/domain/catalog/services/`
3. Preencher até 6 slides; ocultar seção se vazio ou erro.

| Cenário | Rótulo |
|---------|--------|
| ≥1 destacado | "Em destaque" (+ recomendados para completar) |
| 0 destacados, há avaliados | "Recomendados" |
| Vazio / erro API | Seção oculta |

### Consequências

- Lógica de merge e deduplicação testável em domain puro.
- Backend permanece simples (dois endpoints existentes).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Sem mudança de contrato backend | Duas requests HTTP em paralelo por page load |
| Regras de fallback flexíveis no front | Lógica de negócio duplicada em relação a um endpoint único |
| Deploy front independente do back | Inconsistência temporal se featured/rating mudarem entre calls |
| Ocultar seção em erro evita UI quebrada | Menos controle server-side sobre ordem final dos slides |

Ver: [`docs/superpowers/specs/2026-06-07-featured-carousel-integration-design.md`](./superpowers/specs/2026-06-07-featured-carousel-integration-design.md).

---

## RFC-013: Tratamento de erros de API

**Status:** Aceita  
**Data:** 2026-06-06

### Contexto

Formulários (login, registro, perfil, denúncia) precisam exibir erros de campo e toast de erro genérico de forma consistente.

### Decisão

Pipeline centralizado:

1. **`extract-api-errors`** — parse da resposta `{ message, errors }`.
2. **`applyApiError`** — preenche `Ref<fieldErrors>` ou dispara toast.
3. **`useFieldErrorTranslator`** — traduz códigos de erro (`invalidCredentials`, `alreadyExists`).
4. Códigos estáveis espelham backend (`ERROR_CODES`).

### Consequências

- Composables de formulário (`useFTLoginForm`, `useFTRegisterForm`, etc.) compartilham o mesmo padrão.
- Mensagens localizadas via i18n nos composables `core/locales/`.

### Trade-offs

| Ganho | Custo |
|-------|-------|
| UX consistente em todos os formulários | Acoplamento front ↔ backend via códigos de erro estáveis |
| Menos duplicação de parsing/toast | Novo código de erro exige update em ambos os lados |
| Field errors vs toast bem definidos | Erros não mapeados caem em mensagem genérica |
| Função pura `applyApiError` testável | Tradutor por formulário ainda repete boilerplate |

---

## RFC-014: Internacionalização

**Status:** Aceita  
**Data:** 2026-06-05

### Contexto

Produto alvo Brasil, com potencial de expansão.

### Decisão

- **`@nuxtjs/i18n`** com locales `pt-BR` (default), `en-US`, `es-ES`.
- **`strategy: 'no_prefix'`** — URLs sem prefixo de idioma.
- Locales colocalizados: cada componente/composable com pasta `locales/{pt-BR,en-US,es-ES}.json`.
- Cookie `ft_locale` + detecção de browser na raiz.
- **`colorMode: false`** — light mode only no MVP.

### Consequências

- `buildI18nLocales()` agrega arquivos de locale espalhados.
- Dark mode explicitamente fora do escopo (extensão futura via Nuxt UI).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| URLs limpas (`no_prefix`) | SEO multi-idioma menos explícito que `/en/...` |
| Locales colocalizados facilitam manutenção por componente | Muitos arquivos JSON espalhados; agregação via build |
| 3 idiomas demonstra maturidade | Custo de traduzir cada string nova em 3 locales |
| Cookie persiste preferência | Conteúdo dinâmico (API) permanece em PT na maioria dos casos |

---

## RFC-015: Estratégia de testes

**Status:** Aceita  
**Data:** 2026-06-04

### Contexto

RNF-009 a RNF-011 exigem testes unitários, E2E e documentação visual.

### Decisão

| Camada | Ferramenta | Escopo |
|--------|------------|--------|
| Domain + composables | Vitest | Lógica pura, composables com `@nuxt/test-utils` |
| Componentes FT* | Vitest + `mount-ft.ts` | Render, interação, props |
| Fluxos críticos | Cypress | Catálogo, auth, favoritos |
| Design system | Storybook | Variantes visuais, estados empty/error/loading |

### Consequências

- ESLint relaxado em `*.spec.ts`, `*.stories.ts`, `tests/**`.
- Regras Vue: `script-setup`, `block-order`, `max-lines: 250`, `complexity: 15`.

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Pirâmide completa (unit + E2E + visual) | Tempo de CI e manutenção de 3 ferramentas |
| Storybook acelera review de UI | Stories podem ficar desatualizadas vs componente real |
| Cypress cobre fluxos integrados | E2E frágeis a timing e dados de seed |
| Domain testável sem browser | Cobertura E2E ainda limitada vs superfície do app |

---

## RFC-016: Painel admin e impersonation

**Status:** Aceita  
**Data:** 2026-06-06

### Contexto

Gestão de usuários, denúncias e destaque de trainers exige área administrativa separada do catálogo público.

### Decisão

- Rotas `/admin/*` com layout `admin` e middleware `admin-only`.
- Login admin separado (`POST /admin/auth/login`).
- **Impersonation:** admin acessa como usuário; cookie `ft_admin_session` preserva sessão admin; banner global `FTImpersonationBanner`.
- Shell `FTAdminShell` com sidebar; CRUD de usuários, moderação de denúncias.

Ver: [`docs/superpowers/specs/2026-06-06-admin-dashboard-design.md`](./superpowers/specs/2026-06-06-admin-dashboard-design.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Separação clara público vs operação interna | Superfície de ataque maior (rotas + auth admin) |
| Impersonation acelera suporte/debug | Risco de segurança se cookie admin vazar ou fluxo mal testado |
| Reuso de componentes FT* no admin | UI admin menos polida que catálogo (prioridade menor) |
| Mock Nitro espelha admin em dev | Paridade mock/API admin exige manutenção dupla |

---

## RFC-017: Promoções via templates (admin)

**Status:** Aceita  
**Data:** 2026-06-08

### Contexto

Promoções livres por trainer geravam inconsistência e dificuldade de moderação.

### Decisão

- Admin gerencia **templates** em `/admin/promocoes`.
- Trainer ativa/desativa template no painel (`section: 'promotion'`).
- Hidratação de campos completos no read (mapper backend).
- Front: picker de cards de template, sem edição de parâmetros.

Ver: [`docs/superpowers/specs/2026-06-08-admin-promotions-design.md`](./superpowers/specs/2026-06-08-admin-promotions-design.md).

### Trade-offs

| Ganho | Custo |
|-------|-------|
| Consistência e moderação centralizada | Trainer perde autonomia para promoções customizadas |
| UX simples (ativar/desativar template) | Admin precisa criar templates antes de trainers usarem |
| Regras de desconto uniformes | Breaking change para promoções legacy embedded |
| Menos validação no form do trainer | Dependência de sync template ↔ hydration no backend |

---

## Decisões de UX (referência cruzada)

Consolidado do PRD Design (Apêndice D):

| Decisão | Escolha | Alternativa rejeitada |
|---------|---------|----------------------|
| Filtros mobile | `USlideover` bottom/right | Sidebar fixa |
| Filtros desktop | Auto-apply na sidebar | Botão "Aplicar" |
| Logo na listagem | Reset para estado padrão | Preservar filtros |
| Ordenação default | Relevância | Distância |
| Dark mode | Fora do MVP | — |

Ver: [`docs/prd-design.md`](./prd-design.md) § Apêndice D.

---

## Como propor uma nova RFC

1. Abrir issue ou spec em `docs/superpowers/specs/YYYY-MM-DD-<tema>-design.md`.
2. Descrever contexto, decisão, alternativas, consequências e trade-offs.
3. Após implementação, adicionar entrada numerada neste documento.
4. Atualizar README se a decisão impactar setup ou integração.

---

## Documentação relacionada

- [README](../README.md)
- [Estrutura de pastas](./specs/estrutura-pastas.md)
- [Especificação de componentes FT*](./specs/especificacao-componentes-ft.md)
- [Integração com API REST](./specs/api-integration-frontend.md)
- [Requisitos não funcionais](./requisitos-nao-funcionais.md)
