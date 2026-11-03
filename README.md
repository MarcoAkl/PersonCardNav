# PersonCardNav

A directory app for browsing, searching, filtering, and sorting people from the free
[DummyJSON](https://dummyjson.com) API, built with Vite + React + TypeScript.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
npm run lint        # oxlint
npm test            # vitest (unit tests)
```

Requires Node 20+ (built and tested on Node 24 LTS). No environment variables or API key needed —
DummyJSON is public and unauthenticated.

## Stack, and why

- **Vite + React + TypeScript** — required by the brief.
- **react-router-dom**, detail view as a real route (`/person/:id`), not a modal. Reasoning: a
  route is deep-linkable and shareable, works with the browser's native back/forward, and doesn't
  require hand-rolling a modal's accessibility (focus trap, `aria-modal`, scroll lock, restoring
  focus to the trigger) under a time budget. `/favorites` is a route for the same reason.
- **@tanstack/react-query** — wraps every fetch (list, search, filter, single user, favorites) with
  loading/error/retry and caching essentially for free. `keepPreviousData` is used on the list
  query so paginating/sorting/filtering swaps rows in place instead of flashing a full-page loading
  state. This directly backs requirement 5 (loading/error-with-retry/empty states).
- **Hand-written CSS: a small design-token file + CSS Modules per component, no UI kit.** The brief
  weights visual design heavily and explicitly penalizes an "obviously untouched library theme" —
  full control over every surface felt safer than fighting a library's defaults down to the pixel
  in the time available. `src/styles/tokens.css` holds the color/spacing/type/shadow scale as CSS
  custom properties; every component's CSS Module reads from it, so the whole app reads as one
  system rather than one-off styles.
- **clsx** for conditional class composition — tiny, no real alternative considered.
- **Vitest + React Testing Library** for the (stretch) test suite — same Vite config/transform
  pipeline as the app, no separate bundler to maintain.
- **vite-plugin-pwa** — generates the service worker that precaches the built app shell (see
  "Offline support" below). Chosen over hand-rolling a service worker because Workbox (which it
  wraps) correctly handles precache versioning/invalidation across rebuilds, which is easy to get
  subtly wrong by hand.

## Offline support

The brief's "kill your network mid-load" requirement is satisfied by a proper error/retry state
(see below), but the app goes further: search, filter, sort, favoriting, and detail views all
keep working with no network at all, not just a visible error.

- **Data cache:** DummyJSON's entire dataset is tiny (208 users, ~290KB as full records via
  `GET /users?limit=0`). On startup — and again on every reconnect — the app fetches that full
  dataset in the background and stores it in IndexedDB (`src/offline/db.ts`). Every list/search/
  filter/sort/paginate query and every single-user lookup (`src/offline/usersRepository.ts`) tries
  the network first; if that fails for any reason, it re-runs the exact same query
  (`src/offline/localQuery.ts`, unit-tested) against the IndexedDB snapshot instead of erroring.
  Because the *whole* dataset is cached up front rather than only pages you've visited, a detail
  page you've never opened before still resolves offline, and the favorites view (which fetches
  each saved id independently) does too.
- **App shell cache:** IndexedDB alone doesn't help if the tab itself can't load — a hard refresh
  or a fresh tab opened while offline needs the HTML/JS/CSS to come from somewhere. `vite-plugin-pwa`
  generates a service worker that precaches the built assets, so the app shell loads offline too.
  This only takes effect on the production build (`npm run build && npm run preview`) — Vite's dev
  server serves hundreds of unbundled ES module files that don't precache the same way, so a
  hard-reload-while-offline test needs `npm run preview`, not `npm run dev`.
- **Honesty about it:** a slim banner (`OfflineBanner`) appears whenever `navigator.onLine` is
  false, so the app never silently pretends to be live — you know you're looking at a cached
  snapshot. Favoriting itself never touched the network to begin with (pure `localStorage`), so
  that half of "favorite ... when offline" was already true before any of this was built.
- **Known trade-off:** the local search match (substring across first/last/maiden name, email,
  company) is a reasonable approximation of DummyJSON's real search endpoint, not a byte-identical
  reimplementation — offline search results can differ slightly from online search results for
  unusual queries.

## Design direction

Went for a clean, modern "people-directory" look rather than a generic admin table: an
indigo/violet primary color against a soft neutral slate background, with a warm amber accent
reserved specifically for the favorite star so it reads as a distinct, meaningful action rather
than blending into the rest of the UI. Cards are rounded, softly shadowed, and lift on hover;
role is communicated twice at different weights (a small colored dot on the avatar for quick
scanning, a text badge for clarity) rather than relying on color alone. Skeleton loaders mirror
the exact shape of the content they replace (avatar circle + name/title/company lines) with a
shimmer sweep, instead of a generic spinner. Typography uses the system font stack (no external
font fetch, so builds and first paint don't depend on a font CDN) with a deliberate type scale
rather than ad hoc font sizes. Dark mode isn't an inverted afterthought — it has its own tuned
palette (lighter violet for sufficient contrast on dark surfaces, adjusted shadow opacity) defined
alongside the light one in the same token file.

## Key decisions and trade-offs

- **Search and the role filter are mutually exclusive.** I checked DummyJSON's actual behavior
  (not just its docs) with live requests before building against it, and confirmed `sortBy`/`order`
  and pagination work consistently across `/users`, `/users/search`, and `/users/filter` — but
  there is no endpoint that combines full-text search *and* a role filter server-side. Rather than
  fake that combination client-side (which would silently break pagination totals), the role
  dropdown disables itself with an inline hint while a search is active. `src/api/users.ts`'s
  `buildUsersUrl` is the single place that resolves which endpoint a given query state maps to,
  and it's unit-tested directly.
- **List cards fetch a slimmed field set** (`select=id,firstName,lastName,image,age,role,company`)
  to keep list payloads small; the detail route fetches the full record separately by id.
- **Favorites are fetched by id, not paginated.** The favorites view stores only numeric ids in
  `localStorage` and fetches each one via `GET /users/{id}` in parallel (`useQueries`) rather than
  trying to page through a saved-id list server-side — simpler, and favorites are expected to stay
  a small set.
- **URL state (stretch goal).** `q`, `role`, `sortBy`, `order`, and `page` all live in the URL via
  `useSearchParams`, so refresh and back/forward preserve exactly what you were looking at.
- **Theme toggle (stretch goal).** Defaults to `prefers-color-scheme`; a manual override is
  persisted to `localStorage` and applied via a `data-theme` attribute that wins over the system
  preference either direction.
- **What I'd do differently with more time:** add pagination/lazy-loading to the favorites view
  once it's not a small set; add an "undo" toast when unfavoriting instead of an instant removal;
  extract the repeated skeleton-shimmer CSS (currently duplicated between `SkeletonGrid` and the
  detail route's loading state) into one shared class; add error boundaries around each route
  instead of relying solely on react-query's per-query error state.

## What I'd build next

- Deploy it (Vercel/Netlify) — `netlify.toml` is already in the repo (build command, publish dir,
  and the SPA catch-all redirect client-side routing needs), so connecting the repo on Netlify is
  the only remaining step; actually creating/authenticating that hosting account wasn't done from
  this environment.
- Component tests beyond the two trickiest pieces of logic — e.g. `Pagination`'s page-window
  algorithm, and an integration test of `Directory` driving `useSearchParams` end-to-end.
- Debounce-cancel-in-flight requests more aggressively (react-query already dedupes/aborts via
  `signal`, but a slow keystroke burst could still show a brief stale flash before `keepPreviousData`
  settles).
- Virtualize the grid if `limit` were raised — at 12 items/page it's unnecessary today.
- An animated route transition between list and detail (e.g. shared-element avatar) — skipped to
  keep the scope focused on the required list of features.

## Tools used

Built with **Claude Code** (Anthropic's CLI agent) end-to-end — scaffolding, all application code,
CSS, tests, and this README were written by the agent from the brief, with me steering: setting the
overall approach (routing-as-detail-view, react-query, hand-written CSS over a UI kit), verifying
DummyJSON's actual endpoint behavior against the live API before committing to the query-building
logic, reviewing the rendered app in a real browser at both desktop and mobile widths (and in dark
mode) at each milestone, and reviewing/adjusting the diffs as they landed (e.g. catching a
duplicated native/custom clear-button on the search input, and tightening the offline error-state
copy so a raw browser fetch error didn't leak to the user). Commits were made incrementally as each
piece landed, matching the order in this README's trade-offs section.
