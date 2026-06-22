# ZeeCo Dashboard

A single-page application for operations users to browse, search, filter, and inspect products.

🔗 **Live Demo:** [ZeeCo Dashboard](https://zeeco.vercel.app/)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | UI + type safety |
| Vite | Build tool / dev server |
| React Router v6 | Client-side routing |
| TanStack React Query v5 | Data fetching, caching, background refetch |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui (Radix) | Accessible UI primitives |
| Lucide React | Icon set |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd product-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Features

- **Paginated product list** — 10 products per page, offset-based pagination
- **Text search** — debounced 400ms search by product title via DummyJSON's `/products/search` endpoint
- **Category filter** — populated dynamically from the API's `/products/categories` endpoint
- **Sort** — newest/oldest by `meta.createdAt`, applied client-side (see Trade-offs)
- **Product details** — full product page with image gallery, reviews, and metadata cards
- **Loading states** — content-aware skeleton screens on both list and details pages
- **Error states** — inline error messages with retry actions on all data-dependent views
- **Empty state** — friendly message when search/filter returns no results
- **404 page** — catch-all route for unknown paths
- **Keyboard navigation** — all interactive elements reachable and operable via keyboard
- **Responsive** — mobile-first layout, adapts cleanly from 320px to wide desktop

---

## Project Structure
src/

api/          # Fetch functions (network layer only — no state)

components/   # Reusable UI components (FilterBar, ProductsTable, Pagination, Layout)

components/ui # shadcn-generated primitives (owned, not a black-box library)

hooks/        # Custom React Query hooks (useProducts, useProduct, useCategories)

pages/        # Route-level components (ProductsListPage, ProductDetailsPage)

types/        # Shared TypeScript interfaces (Product, ProductsResponse, etc.)

lib/          # Utility helpers (cn() from shadcn)

---

## Design Decisions

### URL as state for filters
Search, category, sort, and page are stored as URL query params (`?page=1&search=phone&category=smartphones&sort=newest`) rather than component state (`useState`). This means:
- Filters survive a page refresh
- Filtered views are shareable via URL
- Browser back/forward navigation works naturally through filter history

### React Query over hand-rolled fetch
TanStack React Query was chosen over a manual `useEffect + fetch` approach because it provides caching, background refetch on window focus, request deduplication, and built-in loading/error states — all of which the brief specifically called out. Rolling these manually would be significant boilerplate with higher risk of subtle bugs (race conditions, stale closures, missing abort cleanup).

### API layer separated from hooks
`src/api/products.ts` contains only fetch logic. `src/hooks/` contains only React Query wiring. This means the network strategy (which endpoint to hit, how to build query strings) is completely decoupled from the caching strategy. Either layer can be changed independently.

### Client-side sorting
DummyJSON's sort API only supports top-level fields. Since `createdAt` lives under `meta.createdAt` (nested), server-side sorting on this field is not supported. Sorting is therefore applied client-side after fetching, on the current page's results. This is a known limitation documented here rather than hidden.

### Search and category filter are mutually exclusive
DummyJSON exposes search and category filtering as separate endpoints (`/products/search?q=` and `/products/category/:slug`) with no combined endpoint. When both are active, search takes priority. This limitation is noted explicitly in the UI's filter design and in this README.

### placeholderData for smooth pagination
React Query's `placeholderData: previousData` option keeps the previous page's data visible while the next page loads, rather than flashing a skeleton on every page change. The table dims to 60% opacity via `isPlaceholderData` to signal that an update is in progress.

### shadcn/ui component ownership
shadcn copies component source code directly into the project rather than shipping a compiled library. This means components in `src/components/ui/` are fully owned and customisable — not a black-box dependency. The trade-off is more files to maintain, but full control over markup, styling, and behaviour.

---

## Trade-offs & Known Limitations

- **Newest/Oldest sort produces no visible difference** — DummyJSON returns an identical `meta.createdAt` timestamp for every product (`2025-04-30T09:41:02.053Z`), meaning the sort logic runs correctly but has nothing to differentiate between products. This is a data limitation of the mock API, not a code bug. A real backend with genuine timestamps would make this work as expected.
- **"Search by applicant name" brief inconsistency** — the original brief referenced searching by "applicant name," which appears to be a template artefact from a different domain (likely an HR/recruitment tool). Since DummyJSON deals with products, not applicants, this was interpreted as search by product title — the closest meaningful equivalent in this context.
- **Sort is page-scoped** — "newest/oldest" sorts the current page's 10 results, not the entire dataset. A full dataset sort would require either API support or fetching all products at once (impractical at scale).
- **Search + category can't be combined** — DummyJSON API limitation. A real backend would support compound queries.
- **No optimistic updates** — the brief mentioned "optimistic approve reverts on error" which appears to be a template artefact from a different domain (HR/approval workflow). The closest applicable stretch feature would be an optimistic add-product form, which is noted below as a next step.
- **Brand filter is client-side only** — DummyJSON has no brand filter endpoint, so brand filtering was deprioritised in favour of the supported category filter.

---

## What I'd Do With More Time

- [ ] **Add product form** — client-side validated form with optimistic insert that rolls back on error (the stretch goal most aligned with the rubric's "optimistic updates" mention)
- [ ] **Brand filter** — fetch all products once and extract unique brands for a client-side brand filter dropdown
- [ ] **Dark mode toggle** — the CSS variables and `.dark` class are already wired by shadcn, just needs a toggle button
- [ ] **Price range filter** — a dual-handle range slider on top-level `price` field (fully supported by the API's `sortBy=price`)
- [ ] **Charts** — a tiny bar or pie chart showing product count grouped by brand, using Recharts or Chart.js. DummyJSON returns enough products to make this meaningful and it would give operations users a quick inventory breakdown at a glance
- [ ] **Auth mock** — a fake login page that validates hardcoded credentials, stores a token in `localStorage`, and wraps protected routes in a `<PrivateRoute>` component that redirects unauthenticated users to `/login`. Logout clears the token and redirects back
- [ ] **Virtualised list** — for very large datasets, `@tanstack/react-virtual` would replace the paginated table with a windowed list
- [ ] **Proper 404 for invalid product IDs** — currently shows a generic error; could detect 404 status specifically and show a more helpful message

---

## API

Data sourced from [DummyJSON](https://dummyjson.com/products) — a free, public mock product API. No authentication required.