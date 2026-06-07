# Integração Front-end com API REST

**Versão:** 1.0  
**Data:** 2026-06-07  
**Stack:** Nuxt 4 + Vue 3 + TypeScript  
**Backend:** Fastify REST em `backend/` (porta 3333)

> Espelho de `.cursor/specs/012_api_integration_frontend_2026-06-07.md`

---

## 1. Objetivo e escopo

Substituir chamadas diretas a `$fetch('/api/...')` nos composables por uma camada de **services HTTP** que aponta para a API REST externa. Os composables passam a orquestrar **services + `useState` global** (actions + getters), preservando a API pública sempre que possível.

O **Nitro mock** (`server/api/`) permanece como **fallback apenas em desenvolvimento**, controlado por variável de ambiente.

---

## 2. Variáveis de ambiente

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3333/api
# Dev only: true = usa Nitro mock (/api) em vez da API externa
NUXT_PUBLIC_USE_MOCK_API=false
```

---

## 3. Arquitetura

```
pages/components → composables (useState + actions) → services → apiFetch → API externa (default) | Nitro mock (dev)
```

---

## 4. Services

| Arquivo | Métodos |
|---------|---------|
| `auth/auth.service.ts` | getMe, login, register, logout |
| `catalog/personal-trainers.service.ts` | list, getById, listFeatured |
| `catalog/favorites.service.ts` | list, sync, add, remove |
| `dashboard/trainer-profile.service.ts` | getMe, update, uploadGallery, deleteGallery, setCover |
| `report/reports.service.ts` | create |

---

## 5. Composables refatorados

13 composables HTTP em `app/composables/` passam a usar services. Ver spec completa em `.cursor/specs/012_api_integration_frontend_2026-06-07.md`.

---

## 6. Smoke test

1. Backend: `cd backend && docker compose up -d && npm run dev`
2. Front: `NUXT_PUBLIC_API_BASE_URL=http://localhost:3333/api`, `NUXT_PUBLIC_USE_MOCK_API=false`
3. Testar listagem, perfil, login, favoritos, dashboard, denúncia
4. Fallback: `NUXT_PUBLIC_USE_MOCK_API=true` sem backend
