
# thepregames — Monorepo Guide

This doc explains how the repo is structured, where code belongs, and the day‑to‑day workflow.

## TL;DR
- **Apps live in `apps/`** (web = Next.js, mobile = Expo RN).
- **Shared code lives in `packages/`** (`shared`, `game-engines`, `ui`, `api-clients`).
- **Background jobs in `services/etl`**, infra stubs in `infra/`.
- Use **PNPM workspaces** + **Turborepo**; run everything with `pnpm dev`.
- Keep shared packages **platform-agnostic** (no `window`/`fs` in `shared` / `game-engines`).

---

## Repository Layout

```
thepregames/
  apps/
    web/                # Next.js (App Router)
    mobile/             # Expo React Native
  packages/
    shared/             # Cross-platform types, zod schemas, helpers (no platform APIs)
    game-engines/       # Pure game logic & state machines (no React)
    ui/                 # Reusable **web** React components
    api-clients/        # Typed SDK for server endpoints
  services/
    etl/                # Nightly/cron data jobs (e.g., rosters → Postgres)
  infra/
    firestore.rules     # Firestore rules (placeholder)
    functions/          # Cloud Functions scaffolding (placeholder)
  turbo.json            # Turborepo task graph
  pnpm-workspace.yaml   # Workspace definition
  tsconfig.base.json    # Shared TS config
```

### What goes where

- **`apps/web`** (Next.js)
  - UI routes in `app/**` (e.g., `app/powerhour/page.tsx`)
  - Server routes in `app/api/**/route.ts` (e.g., `app/api/bk/daily/route.ts`)
  - Web-only helpers/components in `lib/`, `components/`, `hooks/`
  - Imports: `@thepregames/shared`, `@thepregames/ui`, `@thepregames/game-engines`, `@thepregames/api-clients`
  - `next.config.mjs` includes `transpilePackages` for local packages

- **`apps/mobile`** (Expo React Native)
  - Entry `App.tsx`; add `screens/**` as needed
  - Imports: `@thepregames/shared`, `@thepregames/api-clients`
  - `metro.config.js` watches the workspace root so package edits hot‑reload
  - Keep web‑only UI out of mobile; consider tamagui/RN Web later if you want cross‑platform UI

- **`packages/shared`**
  - Zod models, TypeScript types, constants, cross‑platform utils
  - **Avoid** React and platform APIs (`window`, `fs`, RN APIs)

- **`packages/game-engines`**
  - Deterministic game logic (deck/seeding, outcome calc, state machines)
  - No React. Pure functions for easy unit testing and reuse.

- **`packages/ui` (web)**
  - Presentational React **web** components (Typography, Buttons, Cards)
  - No RN components here.

- **`packages/api-clients`**
  - Thin, typed wrappers around server routes (e.g., `createLobby`, `validateBkGuess`)
  - Parse responses with zod from `shared`

- **`services/etl`**
  - Import/transform/persist data; schedule via cron/EAS/Cloud Scheduler
  - Suggested structure: `src/jobs`, `src/clients`, `src/lib`, `src/index.ts`

- **`infra`**
  - Security rules & function stubs; promote to a proper package when implemented

---

## Day‑to‑Day Development

### Common commands
```bash
pnpm dev              # run web + mobile (Turbo)
pnpm -F @thepregames/web dev
pnpm -F @thepregames/mobile dev
pnpm typecheck
pnpm lint
```

### Adding dependencies
```bash
# Web only
pnpm -F @thepregames/web add react-query

# Shared package
pnpm -F @thepregames/shared add zod
```

### Cross‑package imports
- Export from a package’s `src/index.ts` and import by name:
  ```ts
  import { Entitlement } from "@thepregames/shared/schemas";
  import { handValue } from "@thepregames/game-engines";
  ```

### Project references (TypeScript)
- Apps’ `tsconfig.json` include `"references"` to packages.
- Packages’ `tsconfig.json` use `"composite": true` (+ declarations) so TS can type‑check across packages quickly.

### API development flow (example)
1. **Shared types**: add zod schema in `packages/shared` (e.g., `BKGuessReq`).
2. **Server route**: create `apps/web/app/api/bk/validate-guess/route.ts`.
3. **Client wrapper**: add `packages/api-clients/src/bk.ts` with a typed `validateGuess()`.
4. **UI**: call the client from `apps/web` (and later from mobile).

---

## Web specifics (Next.js)
- `next.config.mjs` must list all local packages in `transpilePackages` so edits rebuild:
  ```js
  export default { transpilePackages: [
    "@thepregames/shared",
    "@thepregames/game-engines",
    "@thepregames/ui",
    "@thepregames/api-clients"
  ]};
  ```

## Mobile specifics (Expo)
- Use SDK aligned deps (`expo install --fix`).
- If ESLint complains about `metro.config.js` or `babel.config.js`, the root `eslint.config.mjs` allows Node globals for `*.{js,cjs,mjs}`.
- If PNPM resolution gets fussy, add root `.npmrc` hoist hints:
  ```ini
  strict-peer-dependencies=false
  public-hoist-pattern[]=*expo*
  public-hoist-pattern[]=react
  public-hoist-pattern[]=react-dom
  public-hoist-pattern[]=react-native
  public-hoist-pattern[]=@react-native/*
  ```

---

## Lint & Formatting
- ESLint v9 flat config at repo root (`eslint.config.mjs`) covers TS/JS/React + Node config files.
- Prettier is used for formatting (via `eslint-config-prettier`).

---

## Testing (starter suggestion)
- Add `vitest` in packages (`game-engines` first).
- Keep tests colocated: `src/**/__tests__/*.test.ts`.

---

## Env & Secrets
- Do not commit secrets. Use `.env` files per app:
  - `apps/web/.env.local`
  - `apps/mobile/.env` (or app config)
- Keep checked‑in example files: `.env.example` with placeholder keys.

---

## Tips
- Prefer pure logic in packages; UI shells in apps.
- Keep imports **downward**: apps → packages (not the other way around).
- Avoid mixing platform code in `shared` / `game-engines`.
- For publishable packages, add a build step (e.g., `tsup`) and set `exports` to `./dist/index.js`.

---
