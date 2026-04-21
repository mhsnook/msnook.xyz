# msnook.xyz

My personal website. Now on [TanStack Start](https://tanstack.com/start)
(previously Next.js — the migration history still lives in this repo).

## Layout

    start-app/           # the site — Vite + tanstackStart() + Tailwind v4 + oxc
    supabase/            # migrations, seeds, local config (supabase CLI)
    .claude/             # hooks (format-on-save) + rules
    readme/              # plan files
    package.json         # thin workspace root; delegates to start-app

## Getting started

```sh
pnpm install
cp start-app/.env.example start-app/.env   # fill in Supabase + optional Todoist
pnpm dev                                   # runs start-app on :5173
```

Other useful root scripts (each delegates to start-app or the supabase CLI):

| script              | what                                                     |
| ------------------- | -------------------------------------------------------- |
| `pnpm build`        | `vite build` in start-app                                |
| `pnpm start`        | serve the built output                                   |
| `pnpm typecheck`    | `tsc --noEmit` in start-app                              |
| `pnpm lint`         | `oxlint` in start-app                                    |
| `pnpm format`       | `oxfmt` on start-app + `prettier` on `supabase/**/*.sql` |
| `pnpm format:check` | CI-friendly check of the above                           |
| `pnpm migrate`      | `supabase db diff -f new_migration`                      |
| `pnpm types`        | regenerate `start-app/src/types/supabase.ts` from local  |
| `pnpm seeds:apply`  | `supabase db reset` (reapplies migrations + seeds)       |

## Tooling

- **Formatter:** [oxfmt](https://oxc.rs) for everything except SQL. Prettier
  with `prettier-plugin-sql` handles SQL files only. Claude Code formats on
  save via `.claude/hooks/format-on-save.sh`.
- **Linter:** oxlint. No ESLint.
- **Types:** TypeScript strict mode; `tsc --noEmit` in start-app.

## Design patterns (visual)

Simple and not loud. Two button variants — `solid` and `outlines`. Theme
colors are cyan, red, and coolGray; red is only for error text, cyan only
for "critical path" buttons like Submit login or Save post.

Responsive breakpoints are `sm`, `md`, `lg` (768px is the primary split).
Left-alignment inside centered layout areas; `justify-between` when there
are two items in a row.

## Code patterns

- Route files live under `start-app/src/routes/`. TanStack Router's file
  conventions: `(group)/` folders are pathless, `$param` is dynamic.
- Auth-gated routes use `beforeLoad: ({ location }) => requireAuth(location.href)`
  from `@/lib/auth-guard`. Loaders call `createServerFn`s that use
  `createServerSupabase` so RLS sees the session cookie.
- Mutations use `useMutation` from `@tanstack/react-query`; on success call
  `router.invalidate()` to rerun loaders (replaces Next's `revalidatePath`).
- Forms use `react-hook-form` + zod for validation.
- `useSession()` from `@/components/session-provider` exposes the Supabase
  session on the client.

## Deploy

Target is Cloudflare Workers. The `@cloudflare/vite-plugin` hookup and
`wrangler.jsonc` are TODO (see the comment in `start-app/vite.config.ts`).
