# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Next.js route groups (dashboard, auth, marketing); default to server components, add `use client` for interactive pieces.
- `components/` hosts reusable React UI; keep shared primitives in `components/ui` and feature-specific widgets in folders like `components/dashboard`.
- `lib/` centralizes data/config (`pricing-data.ts`, `settings.ts`) plus Jotai atoms; import internal code via the `@/*` path alias.
- `utils/supabase/` wraps Supabase client/server access and middleware; `public/` stores static assets referenced with absolute URLs.

## Build, Test, and Development Commands
- `npm run dev` launches Turbopack at `http://localhost:3000`; use for day-to-day development.
- `npm run build` and `npm run start` validate production readiness; run both before shipping major changes.
- `npm run lint` executes the flat ESLint setup (`next/core-web-vitals`, TypeScript rules); fix warnings before committing.

## Coding Style & Naming Conventions
- TypeScript is mandatory; keep explicit types on public functions/hooks and favor React function components in PascalCase files.
- Follow the prevailing 2-space indentation, Tailwind-first styling, and the shared `cn` helper for conditional classes.
- Organize imports with third-party modules first, then `@/*` aliases, then relative paths; co-locate helper modules with their feature when possible.

## Testing Guidelines
- Automated tests are not yet configured; when adding them, prefer React Testing Library with co-located `*.test.tsx` files.
- Document manual QA steps for flows you touch (auth, dashboard load, credit purchase) in the PR until an automated harness lands.
- Always run `npm run lint` and spot-check impacted routes in `npm run dev` before requesting review.

## Commit & Pull Request Guidelines
- Recent commits use concise present-tense subjects (`eslint fixes`, `ui fixes`); keep summaries ≤50 characters and expand context in the body if needed.
- PRs should link issues, note environment or Supabase changes, and include before/after screenshots for UI adjustments.
- Record schema tweaks in `utils/supabase/migrations.md` and mention the entry in your PR description.

## Environment & Services
- Store secrets in `.env.local` and share updates securely; never commit credentials.
- Supabase, Stripe, and Anthropic clients are centralized under `utils/supabase/` and `providers/`; reuse these helpers when integrating new features.
