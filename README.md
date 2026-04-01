# Yingzi Guardian Platform

This workspace contains the first runnable version of the Yingzi Guardian multi-business management platform.

Current apps:

- `apps/api`: backend API service
- `apps/admin-web`: admin dashboard frontend
- `docs/db/schema.sql`: database schema draft
- `docs/architecture.md`: architecture notes

## Quick Start

```bash
pnpm install
pnpm dev
pnpm dev:web
```

Default local addresses:

- Admin web: `http://127.0.0.1:3200`
- API root: `http://127.0.0.1:3002/`
- API health: `http://127.0.0.1:3002/health`

## BaoTa One-Click Deploy

After pushing the repository to GitHub, you can deploy on a BaoTa server with:

```bash
cd /www/wwwroot/yingzi
bash deploy/baota-onekey.sh \
  --api-domain api.example.com \
  --admin-domain admin.example.com \
  --mobile-domain m.example.com \
  --jwt-secret "replace-with-a-strong-secret"
```

Details:

- [baota-deploy.md](/D:/yingzi/docs/baota-deploy.md)

## Demo Accounts

- Platform admin: `13900000001 / Admin@123`
- Merchant owner: `13900000002 / Merchant@123`
- Store staff: `13900000003 / Staff@123`

## Current Scope

Implemented today:

1. Multi-tenant API skeleton
2. JWT login and role-based guards
3. Overview, merchants, products, orders, users, system config APIs
4. Admin web login screen and dashboard homepage

Planned next:

- MySQL and ORM integration
- Real CRUD flows
- Merchant backend pages
- Mobile user frontend
- AI service integration
