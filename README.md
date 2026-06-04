# Fatal Trainer

Catálogo de personal trainers autônomos — Vue 3, Nuxt 4, TypeScript.

## Como executar o projeto

**Requisitos:** Node.js 22.x LTS (Nuxt 4.4+), npm (ou pnpm)

> Nuxt 4.4 exige Node `^22.12.0 || ^24.11.0 || >=26.0.0`. Em Node 20, `npm run lint` pode falhar.

```bash
git clone <repo-url>
cd fatal-trainer
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificação TypeScript |
| `npm run test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Testes E2E (Cypress) |
| `npm run storybook` | Storybook (porta 6006) |

## Estrutura de pastas

O projeto segue **Nuxt 4 nativo** + **DDD-lite**. Documentação completa em [docs/arquitetura/estrutura-pastas.md](docs/arquitetura/estrutura-pastas.md).

```
app/                    # Presentation + Application (pages, components, composables)
shared/domain/          # Domain layer (entities, services, value objects)
shared/types/           # DTOs de API
shared/utils/           # Utilitários compartilhados
server/api/             # Infrastructure — API mock
server/services/        # Repositório de dados
server/mocks/           # Gerador de dados mock (dev)
tests/                  # Vitest
cypress/                # E2E
stories/                # Storybook
docs/                   # PRD, RFs, RNFs, arquitetura
```

### Decisão técnica: Nuxt 4 `app/` vs PRD §8.2

O PRD original propõe estrutura plana (Nuxt 3). Adotamos o layout nativo do **Nuxt 4** (`app/` como `srcDir`, `shared/` para código client+server), conforme [RNF-005](docs/requisitos-nao-funcionais.md).

## Decisões técnicas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Framework | Nuxt 4 | RNF-005, SSR, server routes |
| Arquitetura | DDD-lite | Separação domain/presentation sem over-engineering |
| UI | Nuxt UI + Tailwind | RNF-008, acessibilidade |
| Dados | `server/data/*.json` + mock em dev | RNF-001, sem bundle de 500 itens |
| Testes | Vitest + Cypress + Storybook | RNF-009 a RNF-011 |

### Dados mock em desenvolvimento

Enquanto não há backend, o [`server/services/trainer-repository.ts`](server/services/trainer-repository.ts) gera **36 personal trainers** in-memory quando [`server/data/personal-trainers.json`](server/data/personal-trainers.json) está vazio e o app roda em modo dev (`import.meta.dev`). Avatares e galerias usam fotos fitness do [Pexels](https://www.pexels.com/pt-br/) (`server/mocks/mock-photos.ts`) — gratuito, sem API key, URLs estáveis via CDN.

Para usar dados reais, basta popular o JSON — o mock deixa de ser usado automaticamente.

## Documentação

- [PRD](docs/PRD.md)
- [Requisitos funcionais](docs/requisitos-funcionais.md)
- [Requisitos não funcionais](docs/requisitos-nao-funcionais.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Estrutura de pastas (spec)](docs/arquitetura/estrutura-pastas.md)
