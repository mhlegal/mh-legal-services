# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### `artifacts/mh-legal` (web — React + Vite, slug `/`)

Full-stack Legal Tech Platform for **MH LEGAL SERVICES Pty Ltd** / **MHLOPHE HOLDINGS LEGAL SERVICES**.

- **Brand name**: MH LEGAL SERVICES Pty Ltd. Display in navbar/logos as "MH LEGAL" (white) + "SERVICES" (gold).
- **Tagline**: "We Build Systems. We Develop People."
- **Visual system**: Black / White / Gold (`#C9A961`). Playfair Display headings, Inter body. Framer-motion reveals. No new colors.

#### Pages & Routes
| Route | Page | Notes |
|---|---|---|
| `/` | Home | Marketing hero, services grid |
| `/about` | About Us | Company story, TVET partnership |
| `/services` | Services | Insurance brokerage services |
| `/legal-services` | Legal Services Catalog | 5 service cards with call buttons & lead enquiry modal |
| `/team` | Team | Leadership + field managers |
| `/careers` | Careers | In-service training (mailto form) + youth employment |
| `/student-portal` | Student HR Portal | Full-stack form → PostgreSQL + Object Storage + dual-email |
| `/contact` | Contact Us | 4-recipient email selector |
| `/login` | Manager Login | Session-based auth, 4 authorized emails |
| `/admin` | Admin Dashboard | Protected, filters by province + stipend, CSV export |

#### Auth System
- **4 authorized emails**: ngobesesimangaliso47@gmail.com (Master Admin/Super-User), mhlopheholdings@gmail.com, phirid871@gmail.com, bongisiphoandile2@gmail.com
- **Single shared password**: `ADMIN_PASSWORD` secret
- **Master Gatekeeper**: When any of the 3 non-master emails log in, a security alert email is sent to ngobesesimangaliso47@gmail.com
- Sessions stored in PostgreSQL via `connect-pg-simple`, 8-hour TTL

#### Dual-Notification System
- Every student application → email sent to BOTH ngobesesimangaliso47@gmail.com AND mhlopheholdings@gmail.com simultaneously
- Every client lead enquiry → same dual notification
- Sent via Gmail SMTP (nodemailer), credentials in `SMTP_USER` + `SMTP_PASS` secrets

#### Legal Services Catalog (`/legal-services`)
- 5 service cards: R200k Legal Cover, CCMA/Labour Law, Contract Drafting, Debt Collection (R15k+), Civil Rights
- Direct call buttons: +27 31 002 7797 (Durban HQ), 087 006 0205 (National)
- "Enquire" button opens lead modal → POSTs to `/api/leads` → triggers dual notification

#### Student HR Portal (`/student-portal`)
- Fields: Full Names, SA ID Number, Physical Address, Email, Province, Stipend Status (Yes/No)
- File upload: In-Service Training Letter → presigned PUT URL → Replit Object Storage (GCS)
- On submit: saves to PostgreSQL `student_applications` table + sends dual notification email

#### Admin Dashboard (`/admin`)
- Protected route (requires login)
- Stats: Total, With Stipend, No Stipend, Letter Uploaded
- Filters: Province (dropdown), Stipend Status (dropdown)
- Default view: grouped by Province
- Expandable rows with full detail + letter download link
- CSV export button
- Master Admin badge shown for ngobesesimangaliso47@gmail.com

#### Contact
- Phones: +27 31 002 7797 (Durban HQ), 087 006 0205 (National), +27 73 785 3867 (WhatsApp)
- Emails: company=mhlopheholdings@gmail.com, provincial=ngobesesimangaliso47@gmail.com, fieldManager=Bongisiphoandile2@gmail.com, headOfField=phirid871@gmail.com

### `artifacts/api-server` (API — Express 5, slug `/api`)

- **Auth routes**: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Application routes**: `POST /api/applications/upload-url`, `POST /api/applications`, `GET /api/applications`, `GET /api/applications/:id`, `GET /api/applications/:id/letter`
- **Lead route**: `POST /api/leads`
- **Session**: express-session + connect-pg-simple (table: `session`)
- **Email**: nodemailer with Gmail SMTP (`SMTP_USER`, `SMTP_PASS`)
- **Storage**: @google-cloud/storage presigned PUT URLs (`DEFAULT_OBJECT_STORAGE_BUCKET_ID`)
- **DB**: raw `pg` Pool (`DATABASE_URL`)

#### Database Tables
- `student_applications` — id, full_names, sa_id_number, physical_address, email, stipend_status, province, training_letter_path, created_at
- `audit_log` — id, admin_email, action, ip_address, created_at
- `session` — sid, sess, expire (managed by connect-pg-simple)
