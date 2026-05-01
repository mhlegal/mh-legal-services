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

Marketing website for **MHLOPHE HOLDINGS LEGAL SERVICES**, a South African corporate insurance brokerage.

- **Tagline**: "We Build Systems. We Develop People."
- **Brand name**: MHLOPHE HOLDINGS LEGAL SERVICES (full). Never abbreviate to "MH LEGAL" in copy.
- **Positioning**: Corporate insurance brokerage with 100+ licensed agents across KwaZulu-Natal. Six service lines: Product Distribution, Market Activation, Sales Representation, Agent Training, In-Service Training, Compliance Management. Partnership with Mthashana TVET College for in-service placements. Tone: professional, high-energy, growth-oriented.
- **Team**:
  - Philani Mbooi — MD & Founder
  - Thulane David Phiri — Head of Operations
  - Simangaliso Ngobese — Provincial Manager
  - Field Managers: Bongisipho Mfusi, Khulekani Gumede, Nqobile Miya, Sbongimpilo Miya, Ncamisile Lusenga
- **Contact emails**: company=mhlopheholdings@gmail.com, provincial=ngobesesimangaliso47@gmail.com, fieldManager=Bongisiphoandile2@gmail.com, headOfField=phirid871@gmail.com
- **WhatsApp**: +27 73 785 3867
- **Pages**: Home, About Us, Services, Team, Careers, Contact Us (routes: /, /about, /services, /team, /careers, /contact)
- **Careers page**: In-Service Training form (Full Names, ID, Address, Phone, Email, Training Letter upload, 150-word bio). On submit → opens mailto to ngobesesimangaliso47@gmail.com with form data prefilled. Also has Youth Employment section (ages 18–30, email CV).
- **Contact page**: Email selector — user picks from 4 recipients (company, provincial manager, field manager, head of operations) → opens mailto link.
- **Visual system**: Black / White / Gold (`#C9A961` accent). Playfair Display serif headings, Inter body. Framer-motion reveals. Do not introduce new colors.
- **Copy rules**: No Lorem Ipsum, no emojis, no placeholder content. All copy is real B2B prose.
- **Stack note**: Frontend-only React + Vite (wouter, framer-motion, lucide-react, react-hook-form + zod, shadcn/ui). No backend email — all contact/form actions use mailto links.
