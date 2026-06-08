# Admin Promotions CRUD — Design Spec

## Summary

Promotion management moved from per-trainer free-form configuration to an admin-managed template catalog. Personal trainers activate templates from their profile edit page without customizing parameters.

## Decisions

- **Model:** `promotion_templates` table + trainer JSON `{ templateId, redemptionCount }`
- **Hydration:** Mapper resolves full promotion fields from template at read time
- **Trainer UX:** Template picker cards with activate/deactivate only
- **Admin UX:** `/admin/promocoes` mirroring users table (search, filters, pagination, modal CRUD)

## API

### Admin

- `GET /admin/promotions`
- `POST /admin/promotions`
- `GET /admin/promotions/:id`
- `PATCH /admin/promotions/:id`
- `DELETE /admin/promotions/:id` (blocked when `activationCount > 0`)

### Trainer

- `GET /promotion-templates`
- `PATCH /personal-trainers/me` with `{ section: 'promotion', promotion: { templateId } }`

## Breaking change

Legacy embedded promotion JSON on trainers is no longer written by trainers. Existing legacy promotions may still hydrate for read until cleared by seed/migration.
