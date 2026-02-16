# Architecture & Project Structure

## Folder Structure

```
linkshortenerproject/
├── app/                    # Next.js App Router directory
│   ├── globals.css        # Global styles and Tailwind directives
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── db/                   # Database layer
│   ├── index.ts         # Database client configuration
│   └── schema.ts        # Drizzle schema definitions
├── doc/                 # Agent instructions and documentation
├── lib/                 # Utility functions and shared code
│   └── utils.ts        # Common utilities (cn helper)
├── public/             # Static assets
├── components.json     # shadcn/ui configuration
├── drizzle.config.ts  # Drizzle ORM configuration
├── eslint.config.mjs  # ESLint configuration
├── next.config.ts     # Next.js configuration
├── package.json       # Dependencies and scripts
├── postcss.config.mjs # PostCSS configuration
├── proxy.ts           # Proxy configuration (if needed)
├── tsconfig.json      # TypeScript configuration
└── AGENTS.md          # Master agent instructions file
```

## Architecture Principles

### 1. Next.js App Router Structure
- Use the `app/` directory for all routes
- Follow Next.js 13+ conventions (page.tsx, layout.tsx, loading.tsx, error.tsx)
- Implement Server Components by default, use Client Components only when needed
- Keep Server Actions in separate files or co-located with components

### 2. Component Organization
```
components/
├── ui/              # shadcn/ui primitives (button, input, card, etc.)
├── forms/           # Form components
├── layout/          # Layout components (header, footer, sidebar)
└── features/        # Feature-specific components
```

### 3. Database Layer
- All database schemas in `db/schema.ts`
- Database client configuration in `db/index.ts`
- Use Drizzle ORM for all database operations
- Keep database logic separate from UI components

### 4. Utility Functions
- Place shared utilities in `lib/`
- Use TypeScript for all utility functions
- Export utilities with clear, descriptive names

### 5. Path Aliases
The project uses `@/*` alias for imports:
```typescript
import { Button } from "@/components/ui/button"
import { db } from "@/db"
import { cn } from "@/lib/utils"
```

## Data Flow

### Server-Side Rendering (SSR)
1. Request received by Next.js
2. Server Component fetches data server-side
3. HTML rendered and sent to client
4. Client hydrates the page

### Client-Side Interactions
1. User interaction triggers event
2. Client Component handles state updates
3. Server Actions called for data mutations
4. Optimistic updates for better UX
5. Revalidation of cached data

## Authentication Flow
1. Clerk middleware handles authentication
2. Protected routes check authentication status
3. User data available via Clerk hooks
4. Database records associated with Clerk user IDs

## Database Architecture
- Use Neon serverless Postgres
- Schema-first approach with Drizzle
- Type-safe queries generated from schema
- Migrations managed via drizzle-kit

## API Routes (when needed)
```
app/
└── api/
    └── [feature]/
        └── route.ts    # API endpoint
```

## Naming Conventions

### Files and Folders
- Component files: PascalCase (e.g., `UserProfile.tsx`)
- Route files: lowercase (e.g., `page.tsx`, `layout.tsx`)
- Utility files: camelCase (e.g., `utils.ts`, `database.ts`)
- Folders: kebab-case (e.g., `user-profile/`, `link-management/`)

### Components
- React components: PascalCase
- Component files match component name
- One component per file (except small, tightly coupled components)

### Functions
- Use camelCase for all functions
- Use descriptive, verb-based names (e.g., `createShortLink`, `getUserLinks`)
