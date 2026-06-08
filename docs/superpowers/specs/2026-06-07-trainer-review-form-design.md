# Formulário de Avaliação no Perfil do Trainer

**Data:** 2026-06-07  
**Status:** Implementado

## Objetivo

Permitir que usuários autenticados (exceto o próprio trainer) publiquem ou editem uma avaliação com nota (0,5–5,0) e comentário no perfil do personal trainer. Usuários deslogados veem CTA de login. A lista de avaliações é paginada (10 por página).

## Decisões

| Decisão | Escolha |
|---------|---------|
| Avaliações por usuário/trainer | Uma — upsert (criar ou editar) |
| Quem pode avaliar | Qualquer autenticado, exceto o próprio trainer |
| Paginação | 10 por página com `UPagination` |
| Persistência | Tabela `trainer_reviews` no backend |

## Backend

- `GET /api/personal-trainers/:trainerId/reviews?page&pageSize`
- `GET /api/personal-trainers/:trainerId/reviews/mine` (auth)
- `POST /api/personal-trainers/:trainerId/reviews` (auth, upsert)
- Recálculo de `rating` e `review_count` após upsert

## Frontend

- `FTRatingInput` — input interativo 0,5–5,0
- `FTProfileReviewForm` — formulário / CTA login / oculto para próprio perfil
- `FTProfileReviewSection` — form + lista paginada + empty state
- `useTrainerReviews`, `useFTProfileReviewForm`, `reviewsService`
- Login respeita `?redirect=` para retornar ao perfil

## Fora de escopo

Moderação, respostas do trainer, remoção pelo autor, notificações.
