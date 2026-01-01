# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CNN Brasil portal clone built as a technical challenge. The application replicates specific pages from the CNN Brasil website using Next.js with:
- **Homepage** with two switchable layouts (Layout A from /politica/, Layout B from /economia/)
- **Article page** with sidebar showing related articles by category
- **Search page** with pagination (infinite scroll or numbered pages)
- **Admin panel** (`/admin`) to toggle homepage layout selection

The project is structured as a **Bun monorepo** with workspaces:
- `apps/web`: Next.js 16 application (App Router)
- `packages/config`: Shared TypeScript configuration
- `packages/env`: Environment variable validation using T3 env

## Development Commands

**Development**:
```bash
# Run all workspace packages
bun dev

# Run only web app (on port 3001)
bun dev:web
# or
cd apps/web && bun dev

# Start production build
cd apps/web && bun start
```

**Build & Type Check**:
```bash
# Build all workspaces
bun build

# Type check all workspaces
bun check-types

# Format & lint with Biome (auto-fix)
bun check

# Check without auto-fix
bunx biome check .
```

**Package Management**:
- Uses **Bun** (v1.3.1+) as package manager and runtime
- Workspace catalog for shared dependencies: `dotenv`, `zod`, `typescript`
- Add dependencies: `bun add <package>` in respective workspace
- Add dev dependencies: `bun add -D <package>`
- Install all dependencies: `bun install`

## Architecture & Routing

### CNN Brasil URL Patterns
Articles follow a category-based URL structure that must be replicated:

```
CNN Brasil:                            This App:
cnnbrasil.com.br/                  →  /
cnnbrasil.com.br/?search=termo     →  /?search=termo
cnnbrasil.com.br/cat1/slug         →  /cat1/slug
cnnbrasil.com.br/cat1/cat2/slug    →  /cat1/cat2/slug
```

**Dynamic Route Pattern**: `[...slug]/page.tsx` handles multi-level category paths
- Extract category slugs from URL segments
- Last segment is article slug
- Categories form breadcrumb: `category.slug` from API response

### API Endpoints

**CNN Brasil WordPress JSON API**:

1. **List Posts** (Homepage, Search, Category filter):
   ```
   GET https://admin.cnnbrasil.com.br/wp-json/content/v1/posts
   Query params:
   - per_page: pagination (e.g., "2")
   - category: category slug (e.g., "economia")
   - tags: comma-separated tags (e.g., "carro,aviao")
   - search: search term (e.g., "passeio de carro")
   ```

2. **Single Post** (Article page):
   ```
   GET https://admin.cnnbrasil.com.br/wp-json/content/v1/posts/:slug
   Route param:
   - slug: article slug from URL
   ```

Both return same structure (single = object, list = array).

### Rendering Strategy Requirements

The challenge **emphasizes SSR/SSG/ISR over client-side rendering**:
- Minimize `"use client"` directives
- Prefer Server Components for data fetching
- Use React Server Components for static content
- Client components only for interactivity (theme toggle, search input, infinite scroll)

## Tech Stack

**Core**:
- **Next.js 16** with App Router, React 19
- **TypeScript** (strict mode, ESNext)
- **Bun** runtime and package manager
- **TailwindCSS 4** for styling

**UI & Components**:
- **shadcn/ui** components (configured via `components.json`)
- **Lucide React** for icons
- **next-themes** for dark mode
- **class-variance-authority** + **clsx** + **tailwind-merge** (via `cn` utility)
- Geist Sans and Geist Mono fonts

**State & Data**:
- **TanStack Query** (React Query) for data fetching and caching
- **TanStack Form** for form state management
- **nuqs** for type-safe URL search params
- **Zod** for schema validation
- **Sonner** for toast notifications

**Performance**:
- **React Compiler** enabled (`reactCompiler: true` in next.config.ts)
- **Typed Routes** enabled for type-safe navigation

**Code Quality**:
- **Biome** for linting and formatting (replaces ESLint + Prettier)
- Tab indentation, double quotes
- Strict TypeScript with `noUncheckedIndexedAccess`
- Auto-sorts Tailwind classes with `useSortedClasses` rule
- Auto-organizes imports on save

## Key Constraints & Requirements

1. **No Forbidden Libraries**: Cannot use Axios, Styled Components, or shadcn CLI
   - Use native `fetch` API for data fetching
   - TailwindCSS only for styling (no CSS-in-JS)
   - shadcn/ui components already configured in `components.json` (base-lyra style)
   - Manual component installation: copy from shadcn/ui docs into `src/components/ui/`

2. **Minimal External Dependencies**: Demonstrate core development skills without heavy reliance on third-party libraries

3. **Performance Focus**:
   - Image optimization (Next.js Image component)
   - Lazy loading
   - Request optimization (caching, deduplication)
   - Build time optimization

4. **Admin Authentication**: Simple token-based auth (localStorage/cookie), no complex auth system needed

## File Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with fonts, providers
│   │   └── page.tsx      # Homepage
│   ├── components/
│   │   ├── ui/           # shadcn components (Button, Card, Input, etc.)
│   │   ├── header.tsx
│   │   ├── mode-toggle.tsx
│   │   ├── providers.tsx       # Client-side providers wrapper
│   │   └── theme-provider.tsx  # next-themes wrapper
│   ├── lib/
│   │   └── utils.ts      # cn() utility
│   └── index.css         # Global styles, CSS variables
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js config with typed routes, React compiler
└── tsconfig.json         # Path aliases (@/* → ./src/*)

packages/
├── config/               # Shared TypeScript base config
└── env/                  # Environment variable schemas (T3 env)
```

## Client-Side Providers Pattern

The app uses a centralized providers pattern in `src/components/providers.tsx`:
- **ThemeProvider**: Dark mode support via next-themes
- **NuqsAdapter**: Type-safe URL search params
- **Toaster**: Global toast notifications via Sonner

All client-side context providers are wrapped in a single `"use client"` component to minimize client boundaries and keep Server Components as the default.

## TypeScript Configuration

- **Base config**: `packages/config/tsconfig.base.json` (ESNext, strict, verbatimModuleSyntax)
- **Web app**: Extends base + Next.js specific (`@/*` path alias)
- **Strict mode enabled**: All unsafe operations require explicit handling

## Styling Conventions

- **TailwindCSS 4** with PostCSS (no separate config file needed)
- `tw-animate-css` for animations
- `cn()` utility (in `src/lib/utils.ts`) merges classes with tailwind-merge
- Biome auto-sorts Tailwind classes in `clsx`, `cva`, and `cn` functions
- CSS variables defined in `src/index.css` for theming

## Environment Variables

Uses **T3 env** (`@t3-oss/env-nextjs`) for runtime validation:
- Defined in `packages/env/src/web.ts`
- Imported in `next.config.ts` for early validation
- Schema currently empty but extensible with Zod

## Important Implementation Notes

1. **Homepage Layout Toggle**: Store layout preference (A or B) in cookie/localStorage/database
   - Layout A replicates: https://www.cnnbrasil.com.br/politica/
   - Layout B replicates: https://www.cnnbrasil.com.br/economia/

2. **Article Sidebar**: Filter posts by `category.slug` matching current article's primary category

3. **Search Pagination**: Choose between infinite scroll (client-side) or numbered pagination (server-side)

4. **Admin Access**: Protected route at `/admin`, simple login validation sufficient

5. **URL Structure Mapping**:
   - Parse category path from URL segments
   - Use for breadcrumbs and navigation
   - Match against API's category slugs

## Performance Expectations

The README emphasizes optimization:
- Fast initial page load
- Optimized images (Next.js Image)
- Efficient API request patterns
- Minimal client-side JavaScript
- Fast build times

## Design Fidelity

Layout replication is functional, not pixel-perfect. Focus on:
- Correct information architecture
- Proper routing and data flow
- Layout structure matching reference pages
- Core functionality over visual polish
