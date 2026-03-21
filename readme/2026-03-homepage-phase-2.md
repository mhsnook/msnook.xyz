# Homepage Reorganization – Phase 2

Phase 1 (this PR) adds the projects section to the homepage and switches posts to a vertical list layout with no DB changes.

Phase 2 adds a category system for posts and a sidebar filter. Requires no database schema changes — category will be treated as a UI concept backed by an existing field or a new column added via migration later. For now, limit to 1 category per post in the UI only.

## Tasks

### 1. Category field for posts

- Add a `category` column to the `posts` table (migration)
- Update the Supabase TypeScript types: `pnpm types`
- Update `fetchPostList` and `fetchDraftPosts` in `lib/posts.ts` to select the `category` field
- Update `PostRow` in `components/post-list.tsx` to display the category in metadata: `X time ago · category`

### 2. Category sidebar

- Build a `PostSidebar` component with a list of known categories (Tech, Creative, Politics, Other)
- Sidebar behavior:
  - No selection → show only the category list, no "All" label
  - One selected → highlight it (background or outline), show "All ✕" at the bottom to clear
  - Minimalist style, no outline/box around the sidebar itself
- Wire up category filtering: clicking a category filters the post list to show only matching posts
- Filtering should be client-side (no new API calls), so fetch all posts once and filter in state

### 3. Apply sidebar to drafts page

- Drafts page (`app/(private)/posts/drafts/page.tsx`) should also show the category sidebar
- Drafts are already client components using React Query, so filtering can be pure state

### 4. Post edit form

- Add a category selector (single-select, dropdown or radio buttons) to the post edit form
- Limit to the same fixed list: Tech, Creative, Politics, Other
- Save to the `category` column on save

## Notes

- Category is intentionally 1-per-post in the UI even if the DB could support multiple later
- Do not add `tags[]` or any array column — use a simple `text` column for category
- Sidebar should render on both the homepage (server component) and drafts page (client component); consider making `PostSidebar` a client component that accepts posts as a prop
