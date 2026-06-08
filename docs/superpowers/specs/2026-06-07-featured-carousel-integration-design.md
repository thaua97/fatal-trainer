# Featured Carousel — Backend Integration + Empty State

**Date:** 2026-06-07
**Status:** Approved

## Overview

O carrossel de destaque na página `/personal-trainers` consome dados do backend real.
Personais marcados como destaque no admin (`PATCH /admin/users/:id/featured`) aparecem
via `GET /personal-trainers/featured`. Quando não há destaques suficientes, o carrossel
completa até 6 slides com os melhores avaliados. Sem destaques e sem avaliados, a seção
fica oculta.

## Decisions

| Cenário | Comportamento | Rótulo |
|---------|---------------|--------|
| ≥1 destacado (com ou sem preenchimento) | Destacados nos primeiros slides; completar até 6 com melhores avaliados | **Em destaque** |
| 0 destacados, mas há avaliados | Fallback: só melhores avaliados (até 6) | **Recomendados** |
| 0 destacados e 0 avaliados | Ocultar seção inteira | — |
| Erro de API | Ocultar seção | — |

- **Personal avaliado:** `(rating ?? 0) > 0` ou `(reviewCount ?? 0) > 0`
- **Preenchimento:** destacados primeiro, depois recomendados (deduplicados por `id`), máx. 6
- **Slides de preenchimento:** sem badge individual; título da seção permanece "Em destaque"
- **Backend:** nenhuma alteração; frontend orquestra 2 chamadas em paralelo

## Architecture

```
useFeaturedTrainers
  → Promise.all([listFeatured(), list({ sortBy: 'rating', sortOrder: 'desc' })])
  → buildFeaturedCarouselItems(featured, ratedCandidates)
  → useFTFeaturedTrainersCarousel → FTFeaturedTrainersCarousel
```

Domain: `shared/domain/catalog/services/build-featured-carousel.ts`

## Out of scope

- Badge por slide para não-destacados
- Novo endpoint backend combinado
- Sincronizar mock Nitro admin toggle com JSON
- Alterar landing page (`FTLandingTrainersSection`)
