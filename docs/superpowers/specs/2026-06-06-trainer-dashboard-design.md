# Trainer Dashboard Design Spec

**Date:** 2026-06-06  
**Status:** Approved and implemented

## Overview

Painel `/painel/perfil` para personal trainers autenticados gerenciarem perfil público no catálogo.

## Decisions

- **Profile link:** Lazy-create na primeira visita, vinculado por `userId` em `PersonalTrainer`
- **UI:** Página única com abas (Informações | Galeria | Promoções)
- **Auth:** Middleware `trainer-only` (role `personal-trainer`)
- **Upload:** Arquivos locais em `public/uploads/trainers/{id}/`
- **Promoções:** `discountPercent` como fonte; `promoPrice` derivado; período `startsAt`/`endsAt`; limite opcional `maxRedemptions`

## API

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/personal-trainers/me` | Obter ou criar perfil |
| PATCH | `/api/personal-trainers/me` | Atualizar info ou promoção |
| POST | `/api/personal-trainers/me/gallery` | Upload de imagem |
| DELETE | `/api/personal-trainers/me/gallery/:index` | Remover imagem |
| PATCH | `/api/personal-trainers/me/gallery/cover` | Definir foto de capa |

## Domain

- `PersonalTrainer.userId`, `contactPhone`
- `TrainerPromotion` expandido com percentual, período e resgates
- `validate-trainer-profile.ts` para info e promoção
- `trainer-pricing.ts` considera datas e limite de resgates em `isOnPromotion()`

## Components

- `FTTrainerDashboard` — shell com `UTabs`
- `FTTrainerInfoForm` — edição de dados profissionais
- `FTTrainerGalleryManager` — upload, remoção e capa
- `FTTrainerPromotionForm` — promoção com preview ao vivo
