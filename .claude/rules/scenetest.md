# Scenetest e2e — READ-ONLY ONLY

The CI workflow at `.github/workflows/e2e.yml` runs scenetest scenes
against the **production Supabase project**. This is a deliberate
trade-off to keep CI light (no Docker, no local Supabase boot) — but it
means every scene runs against real production data.

## Hard rules

1. **NEVER write a scene that mutates data.** No logins, no form
   submissions that POST, no "create post", no clicking destructive
   buttons, no API calls that hit `INSERT`/`UPDATE`/`DELETE`/`UPSERT`
   endpoints. Read-only only — `openTo`, `see`, `scrollTo`, and reads.

2. **NEVER use the Supabase service-role key in CI.** Only the
   publishable (anon) key. The workflow exposes
   `VITE_SUPABASE_API_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` and
   nothing else. Do not add `SUPABASE_SERVICE_ROLE_KEY` to the
   workflow env.

3. **NEVER add a write path that depends on the publishable key.**
   Production RLS policies are the backstop here; don't loosen a
   policy "just for the e2e flow."

4. **If you need to test writes**, switch the workflow to boot a local
   Supabase (see sunlo's `test.yaml` for the pattern) on a separate
   job — do not co-opt the read-only job.

## When reviewing a scenetest PR

Reject any scene that:
- clicks a button labelled like "Save", "Submit", "Create", "Delete",
  "Update", "Login", "Sign up", "Reset"
- calls `typeInto` on a form field and then submits
- visits an authenticated route (`/login`, `/projects/new`, anything
  under `(private)`)

If a scene needs auth-gated behavior, that's signal to split the
workflow, not signal to relax these rules.
