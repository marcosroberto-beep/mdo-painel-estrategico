# Architecture Refactor — MDO Painel Estrategico

**Date:** 2026-03-23
**Status:** Approved
**Approach:** Big Bang migration on a separate branch

## Overview

Complete refactoring of the MDO Painel Estrategico dashboard from JavaScript to TypeScript, replacing ad-hoc data fetching with TanStack Query, adding React Router for URL-based navigation, implementing proper error handling, and establishing a test suite.

## Current State (Problems)

1. **Exposed credentials** — Supabase URL and anon key hardcoded in `src/lib/supabase.js`. Key is in git history and should be rotated after migration.
2. **No error handling** — API failures are silent; users see empty state with no feedback
3. **Heavy prop drilling** — `pageProps` mega-object passed from App through layout to every page
4. **No URL routing** — `activeSection` state string; refresh loses page; no browser history
5. **Mixed concerns** — DashboardPage contains KPIs + OAuth + sync logic + admin controls (390 lines)
6. **No types** — No PropTypes or TypeScript; prop shapes undocumented
7. **Duplicate fetching** — Multiple hooks fetch overlapping data with no cache or deduplication. `useRDStationData` (loaded in App) queries Supabase `rdstation_*` tables, while `CRMPage` independently fetches via `supabase.rpc('rdstation_dashboard_periodo')` and falls back to the RD Station REST API directly (`https://crm.rdstation.com/api/v1/deals`).
8. **Dead code** — `showUserMgmt` state, unused props, Recharts installed but not used
9. **No tests** — Zero test files or test infrastructure
10. **No error boundaries** — Single error in any page crashes entire app
11. **Hardcoded fallback data** — 320 lines of static data used silently when APIs fail

## Target Architecture

### Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Type safety across the codebase |
| React 19 | UI framework (already in use) |
| React Router v7 | URL-based routing with nested layouts (already installed, needs wiring) |
| TanStack Query v5 | Data fetching, caching, loading/error states |
| Supabase JS v2 | Database and auth (already in use) |
| Recharts | Charts (already installed, replace custom CSS conic-gradient PieChart and inline SVG sparklines) |
| PapaParse | CSV parsing for file import (already installed, add `@types/papaparse`) |
| Tailwind CSS v4 | Styling (already in use) |
| Vitest | Unit and integration tests |
| React Testing Library | Component testing |

### Folder Structure

```
src/
├── app/
│   ├── App.tsx                    # Router setup + providers
│   ├── routes.tsx                 # Route definitions
│   └── providers.tsx              # All context providers wrapped
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # Layout route (Outlet + Sidebar + Header)
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── KPICard.tsx
│   │   ├── Badge.tsx
│   │   ├── SectionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── DetailModal.tsx
│   │   ├── Spinner.tsx
│   │   └── ErrorFallback.tsx
│   └── charts/
│       ├── SparklineChart.tsx
│       └── PieChart.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useTheme.ts
├── services/
│   ├── supabase.ts
│   ├── api/
│   │   ├── dashboard.ts
│   │   ├── shopify.ts
│   │   ├── rdstation.ts
│   │   ├── sync.ts
│   │   └── auth.ts
│   └── queries/
│       ├── useDashboardQueries.ts
│       ├── useShopifyQueries.ts
│       ├── useRDStationQueries.ts
│       └── usePeriodoQueries.ts
├── types/
│   ├── database.ts
│   ├── api.ts
│   ├── domain.ts
│   └── props.ts
├── lib/
│   ├── formatters.ts
│   └── constants.ts
├── data/
│   └── seed.ts
├── pages/
│   ├── DashboardPage.tsx
│   ├── FluxoCaixaPage.tsx
│   ├── ClientesPage.tsx
│   ├── AnaliseB2CPage.tsx
│   ├── MatrizRFMPage.tsx
│   ├── CanaisB2BPage.tsx
│   ├── ProdutosPage.tsx
│   ├── AnaliseTemporalPage.tsx
│   ├── ShopifyPage.tsx
│   ├── CRMPage.tsx
│   ├── FunilPage.tsx
│   ├── AnaliseIAPage.tsx
│   ├── MetasPage.tsx
│   ├── AlertasPage.tsx
│   └── LoginPage.tsx
├── test/
│   └── setup.ts
├── main.tsx
└── index.css
```

### Routing

React Router v7 with nested layout routes:

```
/login              → LoginPage
/app                → ProtectedRoute → AppLayout
  /app/dashboard    → DashboardPage (index redirect)
  /app/fluxo-caixa  → FluxoCaixaPage
  /app/clientes     → ClientesPage
  /app/analise-b2c  → AnaliseB2CPage
  /app/matriz-rfm   → MatrizRFMPage
  /app/canais-b2b   → CanaisB2BPage
  /app/produtos     → ProdutosPage
  /app/analise-temporal → AnaliseTemporalPage
  /app/shopify      → ShopifyPage
  /app/crm          → CRMPage
  /app/funil        → FunilPage
  /app/analise-ia   → AnaliseIAPage
  /app/metas        → MetasPage
  /app/alertas      → AlertasPage
/*                  → Redirect to /app
```

- `AppLayout` is the layout route: renders Sidebar + Header + `<Outlet />`
- `ProtectedRoute` checks auth, redirects to `/login` if unauthenticated
- Each page lazy-loaded with `React.lazy()` + `<Suspense>`
- `errorElement` on the layout route catches page errors

**Dies:**
- `activeSection` state in App
- Switch/case page rendering
- `setActiveSection` prop drilling
- Navigation via callbacks

### Data Fetching

**3-layer architecture:**

1. **`services/api/`** — Pure async functions that call Supabase. No React. Typed inputs and outputs.
2. **`services/queries/`** — TanStack Query hooks wrapping the API functions. Handle cache, loading, error, retry.
3. **Pages** — Call query hooks directly. No prop drilling for data.

**TanStack Query global config:**
- `retry: 2` for queries, `retry: 0` for mutations
- `staleTime: 5 * 60 * 1000` (5 min cache)
- `refetchOnWindowFocus: false`

**Sync operations** use `useMutation` with `onSuccess` invalidating relevant query keys.

**Dies:**
- `useSupabaseData` hook
- `usePeriodoGlobal` hook
- `useShopifyData` hook
- `useRDStationData` hook
- `pageProps` mega-object
- `db` helper object in `supabase.ts`

### State Management

| State | Where | Why |
|-------|-------|-----|
| Auth (user, profile, isAdmin) | AuthContext | Global, infrequent changes |
| Theme (darkMode) | ThemeContext + localStorage + Tailwind `dark:` class on `<html>` | Global, persisted |
| Data source (`fonteAtiva`) | URL query param (`?fonte=bling`) | Shareable, bookmarkable |
| Server data (dashboard, shopify, rdstation) | TanStack Query | Cache, dedup, loading/error |
| UI state (modals, filters) | Component-local useState | Scoped, no sharing needed |

### TypeScript Types

**4 type files:**

- `types/database.ts` — Matches Supabase tables/views: `ResumoMensal`, `ClienteMes`, `UFMensal`, etc.
- `types/api.ts` — API request/response: `SyncResponse`, `ShopifyPedido`, `RDStationDeal`, etc.
- `types/domain.ts` — UI domain models: `KPIData`, `FunilEtapa`, `SyncStatus`
- `types/props.ts` — Shared component props: `KPICardProps`, `SectionCardProps`

Field names follow existing database convention (snake_case).

### Error Handling

**3 layers:**

1. **Error Boundaries** — React Router `errorElement` per route. `ErrorFallback` component with retry button.
2. **TanStack Query** — Every query exposes `{ data, isLoading, error }`. Automatic retry (2x). No silent failures.
3. **Service layer** — Functions throw typed errors. `fetch` calls check `response.ok`.

**Environment variables** replace hardcoded credentials:

```env
# .env (gitignored)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

```env
# .env.example (committed, no real values)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- `.env` added to `.gitignore`
- `.env.example` committed as template
- `services/supabase.ts` throws at startup if env vars are missing
- **Post-migration:** Rotate the Supabase anon key (current key is in git history)

### Demo/Seed Data

- `data/seed.ts` contains demonstration data (migrated from current `constants.js`)
- All seed objects include `isDemoData: true` flag
- When a query fails AND cache is empty, UI shows "Carregar dados de demonstração" option
- Demo data renders with a fixed top banner: yellow background, text "Dados de demonstração — conecte suas integrações para ver dados reais", with dismiss button

### Charts

Replace custom CSS conic-gradient and inline SVG sparklines with Recharts (already installed):

- `components/charts/PieChart.tsx` — Recharts PieChart (replaces `components/ui/PieChart.jsx` which uses CSS conic-gradient; all imports must be updated)
- `components/charts/SparklineChart.tsx` — Recharts AreaChart (new component; replaces inline SVG polygon sparkline logic currently embedded in `KPICard.jsx`)

### Tests

**Setup:** Vitest + React Testing Library + jsdom

**Test files co-located** with source files (`*.test.ts` / `*.test.tsx`).

| Layer | What | How |
|-------|------|-----|
| `services/api/` | Supabase calls return typed data, errors propagate | Mock Supabase client |
| `services/queries/` | Query hooks manage loading/error/data states | `renderHook` + QueryClientProvider |
| `lib/formatters.ts` | Currency, number, date formatting | Pure unit tests |
| `components/ui/` | KPICard, Badge, SectionCard render correctly | React Testing Library |
| `pages/` | Full flow: loading → data → error | Mock query hooks |
| `contexts/` | Auth login/logout, Theme toggle | `renderHook` with provider |

**Not in scope:** E2E tests, visual/snapshot tests.

**Config:**

```ts
// vitest.config.ts
{ test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] } }
```

### Legacy Files

Files in the repo root (`mdo_painel.html`, `mdo_painel_completo.jsx`, `mdo_dados_consultoria.js`) are kept as reference. Not modified or imported.

### TypeScript Configuration

Use `"strict": true` from the start. Since this is a big bang migration (not incremental), all files are migrated at once and strict mode catches more bugs upfront.

### Dark Mode Integration

Replace conditional class strings (`darkMode ? 'bg-gray-900' : 'bg-gray-50'`) with Tailwind's `dark:` variant. `ThemeContext` toggles a `dark` class on `<html>`, and components use `dark:bg-gray-900` utilities. This simplifies every component that currently checks darkMode.

### CRMPage Migration Notes

`CRMPage.jsx` is self-contained: it does NOT use `useRDStationData` hook. Instead, it uses two data paths:
1. **Primary:** `supabase.rpc('rdstation_dashboard_periodo')` — a Supabase RPC call to a server-side function
2. **Fallback:** Direct RD Station REST API calls (`https://crm.rdstation.com/api/v1/deals`, `/deal_stages`) with token management

It also has ~80 lines of inline `CRM_FALLBACK` data. During migration:
- `services/api/rdstation.ts` must handle BOTH the Supabase RPC path AND the direct REST API fallback with token management
- Move `CRM_FALLBACK` into `data/seed.ts`
- Use `useRDStationQueries` hooks with the dual-path logic encapsulated in the service layer

### DashboardPage Migration Notes

`DashboardPage` largely bypasses the prop-drilling pattern: it imports `DADOS` directly from `constants.js` and calls `supabase` directly. It only uses 3 of the many `pageProps` passed to it: `isAdmin`, `fonteAtiva`, `onDataApplied`. During migration:
- `isAdmin` comes from `useAuth()` hook
- `fonteAtiva` comes from URL query param
- `onDataApplied` is dead code (never triggered) — remove
- Extract OAuth and sync logic into `services/api/sync.ts`

### Test Priority

Highest priority tests (write first, provide safety net for migration):
1. `services/api/` — validates data layer works correctly
2. `contexts/AuthContext` — auth flow is critical path
3. `lib/formatters.ts` — pure functions, easy wins, catch regressions

Lower priority (write after pages are migrated):
4. `components/ui/` — rendering tests
5. `pages/` — integration tests
6. `services/queries/` — hook behavior tests

## Migration Strategy

Big Bang approach on a separate branch:

1. Setup TypeScript (`tsconfig.json` with `strict: true`), TanStack Query, Vitest configs
2. Add `.env` + `.env.example` + update `.gitignore`; move credentials out of source
3. Create `types/` with all interfaces
4. Create `services/supabase.ts` (env vars) and `services/api/` layer (extract from hooks/pages, including CRMPage's RPC + REST API dual-path logic)
5. Create `services/queries/` layer (TanStack Query hooks)
6. Migrate contexts to TypeScript; update ThemeContext to use Tailwind `dark:` class strategy
7. Setup React Router with layout route and `ProtectedRoute` (depends on AuthContext)
8. Migrate UI components to TypeScript + Recharts (PieChart path changes from `ui/` to `charts/`)
9. **Proof of concept:** Migrate one simple page end-to-end (e.g., `AlertasPage`) to validate the full stack works
10. Migrate remaining pages one by one (remove prop drilling, use query hooks, extract `fonteAtiva` to URL param)
11. Add error boundaries and ErrorFallback
12. Write tests (priority order: services/api → auth context → formatters → UI → pages)
13. Remove dead code (old hooks, `showUserMgmt`, `onDataApplied`, unused props)
14. Install `@types/papaparse` for CSV import typing
15. Cleanup: lint, verify build, final review

## Scope Summary

- ~20 new files (services, queries, types, tests config)
- ~30 files migrated JS → TS
- ~15 test files
- Config updates: tsconfig.json, vitest.config.ts, .env, .env.example, .gitignore, eslint update
- Post-migration: rotate Supabase anon key
