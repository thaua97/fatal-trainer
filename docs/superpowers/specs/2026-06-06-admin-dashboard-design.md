# Admin Dashboard — Design Spec

**Date:** 2026-06-06  
**Status:** Approved for implementation

## Overview

Platform admin panel for Fatal Trainer: user CRUD, trainer featured toggle, deactivation, impersonation, and report moderation. Accessible at `/admin` (login) with protected routes under `/admin/*`.

## Routes

| Route | Layout | Middleware | Purpose |
|-------|--------|------------|---------|
| `/admin` | `admin-auth` | — | Admin login |
| `/admin/dashboard` | `admin` | `admin-only` | Redirect to `/admin/usuarios` |
| `/admin/usuarios` | `admin` | `admin-only` | User management table |
| `/admin/denuncias` | `admin` | `admin-only` | Report moderation |

## Backend Endpoints

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/admin/auth/login` | Public (admin role only) |
| GET | `/api/admin/users` | Admin |
| POST | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id` | Admin |
| PATCH | `/api/admin/users/:id/featured` | Admin |
| POST | `/api/admin/users/:id/impersonate` | Admin |
| POST | `/api/admin/impersonation/exit` | Impersonated session |
| GET | `/api/admin/reports` | Admin |
| PATCH | `/api/admin/reports/:id` | Admin |
| POST | `/api/admin/reports/:id/deactivate-trainer` | Admin |

## Schema Changes

- `UserRole.admin`
- `User.is_active` (default true)
- `Session.impersonator_user_id` (optional)
- `Report.status` (pending | in_review | resolved | archived)
- `Report.resolved_at`, `Report.resolved_by`

## Impersonation Flow

1. Admin clicks "Acessar como" on user row
2. Backend stores admin token in `ft_admin_session` cookie
3. New session created for target user with `impersonator_user_id`
4. `FTImpersonationBanner` shown globally
5. "Voltar ao admin" restores admin session from `ft_admin_session`

## Components

- `FTAdminLoginForm` — minimal login
- `FTAdminShell` — sidebar + panel layout
- `FTAdminUsersTable` — user CRUD table
- `FTAdminUserDetailPopover` — hover detail card
- `FTAdminUserFormModal` — create/edit modal
- `FTAdminReportsTable` — reports table
- `FTAdminReportActions` — status + deactivate actions
- `FTImpersonationBanner` — global impersonation bar

## Seed

- Email: `admin@fataltrainer.com`
- Password: `Admin@Fatal2026!`
- Role: `admin`
