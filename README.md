# Website Readme

This is my website! The NextJS app, at least. The back end
is Supabase so the client uses their supabase-js client library.

I you have access to the project on vercel you should `vercel link` and
`vercel env pull`. Then you can `pnpm install` and `pnpm dev`. (NPM will
also work but this repo uses the pnpm lock file so YMMV.)

## Design patterns

The visual design of the site is meant to be very simple, not loud,
and without too many options. For instance, there are only two types of buttons
"solid" and "outlines".

The only theme colors so far are Tailwind's cyan, red, and coolGray. The
entire theme operates on these; red is used only for error text and
never as a background. Cyan is only used as a background for "critical path"
buttons like "Submit login" and "Save post".

The main separation between form factors is at the `md` breakpoint at 768px,
though other breakpoints are used for responsive typography and changes
to the grid size, when needed. `sm`, `md`, and `lg` are available.

The big visual banner is only used on index pages; post pages confine their
feature image to within the `<PostArticle>` component, whose width is capped at
`max-w-prose` (68ch), as are other elements like the login form.

This site mostly uses left-alignment within centered layout areas. When there
are two items to place next to one another, default to justify-between so items
are pushed to the edges of their respective containers.

## Code patterns

The site uses NextJS's built-ins wherever possible, and `react-query`
to manage data fetching. Forms are handled by `react-hook-forms`, with
`supabase-js` handling the fetchers and posts.

Components that need to know whether the user is logged in can use the hook
`useSession` to see if the session is present and the basic details of
the logged in user.

For pages requiring authentication, there is a single component
`<LoginChallenge>` which checks the `/logged_in` API and either presents the
login form as a modal, or dispatches the returned authenticated user object
for the rest of the app.

Similarly, there is an `<ErrorList>` component that goes at the bottom of each
form or each page that might require one. It accepts either a single message
or an array, and hides itself when empty. So for both LoginChallenge and
ErrorList, you can simply drop the component wherever you want it and not worry
about conditions; the components will figure out whether they're needed.

For the sake of easy navigation, Component and Lib files are allowed to contain
several functions or components, so e.g. we have `lib/auth.js` with all the
functions related to user authentication, rather than something like
`lib/login/checkLogin.js` and so on for individual functions. Still, the
longest file is ~100 lines, and should probably stay that way.

There is currently no global management of variables and metadata like the
site's title and description or other metadata. Nor is there any global state
or context management.
