# General Cleanup Notes

## Real Bugs

1. **`type="slug"` on email input** — `components/login-form.tsx:111` uses `type="slug"` which isn't a valid HTML input type. Browsers fall back to `type="text"`, breaking mobile keyboards and autofill. Should be `type="email"`.

2. **Runtime deps in devDependencies** — `clsx` and `tailwind-merge` are imported at runtime in `lib/utils.ts` but listed under `devDependencies` in `package.json`. Should be moved to `dependencies`.

## Consistency / Correctness

3. **Module-scope `QueryClient`** — `app/(private)/layout.tsx:6` creates `new QueryClient()` at module scope. If this ever runs on the server, the cache would be shared across requests. Should use a lazy-init pattern that checks `typeof window`.

4. **New post page doesn't use React Query** — `app/(private)/posts/new/page.tsx` uses raw `.then()/.catch()` with `useState` for error tracking, while the edit page uses `useMutation`. Should be consistent — switch to `useMutation` for retry, deduplication, and the ability to invalidate the drafts query on success.

5. **Missing TypeScript on component props** — Several pages destructure `params` and `children` without types (e.g. `Page({ params: { slug } })`, layouts with `{ children }`). Should have explicit types.

## Minor

6. **Fragile error fallback in post creation** — `app/(private)/posts/new/page.tsx:34` does `err?.message ?? String(err)` which produces `[object Object]` for non-Error objects. Use a safer fallback like `typeof err === 'string' ? err : 'Something went wrong'`.

7. **No explicit `dynamicParams`** — `app/(public)/posts/[slug]/page.tsx` uses `generateStaticParams` but doesn't declare `dynamicParams = true/false`. Currently defaults to `true`, which is probably correct, but worth being explicit.
