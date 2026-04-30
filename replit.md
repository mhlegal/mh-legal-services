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

Marketing website for **MH LEGAL**, a South African multi-disciplinary professional services firm.

- **Tagline**: "We Build Systems. We Develop People."
- **Positioning**: Multi-disciplinary professional services firm — operational systems, business solutions, in-service training, trained personnel placement, and strategic partnerships. Industry-agnostic; **never frame the firm as automotive/dealership-specific**.
- **Leadership**: Managing Director — Philani Mbooi (defined in `src/lib/site-config.ts` under `leadership.managingDirector`).
- **Contact**: WhatsApp +27 73 785 3867 (https://wa.me/27737853867), email `info@mhlegal.co.za`.
- **Pages**: Home, About, Services, Training, Partnerships, Contact (driven by `src/lib/site-config.ts` nav).
- **Visual system**: Black / White / Gold (`#C9A961` accent). Playfair Display serif headings, Inter body. Framer-motion reveals. Do not introduce new colors.
- **Copy rules**: No Lorem Ipsum, no emojis, no placeholder content. All copy is real B2B prose.
- **Stack note**: Frontend-only React + Vite (wouter, framer-motion, lucide-react, react-hook-form + zod, shadcn/ui). The Contact form currently shows a toast — no email backend wired.
