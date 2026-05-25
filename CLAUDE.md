# Claude Code Rules

See `.claude/rules/` for additional rules.

## ⚠️ Scenetest e2e is READ-ONLY against production Supabase

CI runs scenes against the **real production Supabase project** using
the publishable (anon) key. Scenes MUST NOT mutate data — no logins,
no form submissions that write, no destructive clicks. See
`.claude/rules/scenetest.md` for the full rules. If you need write
coverage, boot a local Supabase in a separate workflow job; do not
relax the read-only job.

<!-- intent-skills:start -->

# Skill mappings - when working in these areas, load the linked skill file into context.

skills:

- task: "Setting up or working with @tanstack/react-start (createStart, StartClient, StartServer, useServerFn)"
  load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"
- task: "Building React Server Components with TanStack Start (@tanstack/react-start/rsc, renderServerComponent, Composite Components)"
  load: "node_modules/@tanstack/react-start/skills/react-start/server-components/SKILL.md"
- task: "Creating or consuming server functions (createServerFn, useServerFn, server context, FormData handling)"
  # To load this skill, run: npx @tanstack/intent@latest list | grep server-functions
- task: "Route data loading, loaders, staleTime/gcTime caching, pending/error components, router.invalidate"
  # To load this skill, run: npx @tanstack/intent@latest list | grep data-loading
- task: "Router navigation: Link, useNavigate, preloading, navigation blocking, scroll restoration" # To load this skill, run: npx @tanstack/intent@latest list | grep navigation
<!-- intent-skills:end -->
