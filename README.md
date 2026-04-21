# msnook.xyz

My personal website — a TanStack Start app backed by Supabase. Previously
Next.js; the full migration lives in this repo's history.

## Layout

    src/                 # the app — routes, components, lib, styles
    public/              # static assets served as-is
    supabase/            # migrations, seeds, local config (supabase CLI)
    .claude/             # hooks (format-on-save) + rules
    readme/              # plan files
    vite.config.ts
    tsconfig.json
    package.json

## Getting started

```sh
pnpm install
cp .env.example .env   # fill in Supabase + optional Todoist
pnpm dev               # vite dev on :5173
```

## Scripts

| script              | what                                                   |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | `vite dev` (Miniflare via `@cloudflare/vite-plugin`)   |
| `pnpm build`        | `vite build`                                           |
| `pnpm preview`      | `vite preview` — runs the built worker locally         |
| `pnpm deploy`       | `vite build && wrangler deploy -c dist/server/...`     |
| `pnpm typecheck`    | `tsc --noEmit`                                         |
| `pnpm lint`         | `oxlint`                                               |
| `pnpm format`       | `oxfmt` + `prettier --write 'supabase/**/*.sql'`       |
| `pnpm format:check` | CI-friendly check of the above                         |
| `pnpm migrate`      | `supabase db diff -f new_migration`                    |
| `pnpm types`        | regenerate `src/types/supabase.ts` from local Supabase |
| `pnpm seeds:apply`  | `supabase db reset` (reapplies migrations + seeds)     |

## Tooling

- **Formatter:** [oxfmt](https://oxc.rs) for everything except SQL. Prettier
  with `prettier-plugin-sql` handles SQL files only. Claude Code formats on
  save via `.claude/hooks/format-on-save.sh`.
- **Linter:** oxlint. No ESLint.
- **Types:** TypeScript strict mode; `tsc --noEmit`.

## Design patterns (visual)

Simple and not loud. Two button variants — `solid` and `outlines`. Theme
colors are cyan, red, and coolGray; red is only for error text, cyan only
for "critical path" buttons like Submit login or Save post.

Responsive breakpoints are `sm`, `md`, `lg` (768px is the primary split).
Left-alignment inside centered layout areas; `justify-between` when there
are two items in a row.

## Code patterns

- Route files live under `src/routes/`. TanStack Router's file conventions:
  `(group)/` folders are pathless, `$param` is dynamic.
- Auth-gated routes use `beforeLoad: ({ location }) => requireAuth(location.href)`
  from `@/lib/auth-guard`. Loaders call `createServerFn`s that use
  `createServerSupabase` so RLS sees the session cookie.
- Mutations use `useMutation` from `@tanstack/react-query`; on success call
  `router.invalidate()` to rerun loaders (replaces Next's `revalidatePath`).
- Forms use `react-hook-form` + zod for validation.
- `useSession()` from `@/components/session-provider` exposes the Supabase
  session on the client.

## Deploy

Cloudflare Workers. `wrangler.jsonc` sets `main` to
`@tanstack/react-start/server-entry` with `nodejs_compat`; the
`cloudflare()` plugin is wired into `vite.config.ts` so `pnpm dev` runs
the app under Miniflare (closer to prod than Node dev was).

`VITE_SUPABASE_API_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are inlined by
Vite at build time — they come from `.env` locally and from the deploy
environment in CI. `TODOIST_API_TOKEN` is a runtime server secret:

```sh
pnpm wrangler secret put TODOIST_API_TOKEN     # for the deployed worker
echo 'TODOIST_API_TOKEN=...' >> .dev.vars      # for local worker dev
```

Then `pnpm deploy` builds and pushes the worker.
