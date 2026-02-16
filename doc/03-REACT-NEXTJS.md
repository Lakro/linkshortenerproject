# React & Next.js Best Practices

## React Version
- **React 19.2.3** with new features and patterns
- Use modern React patterns (hooks, Server Components, etc.)

## Next.js App Router

### File Conventions
Follow Next.js App Router conventions:

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error UI
├── not-found.tsx       # 404 UI
├── global-error.tsx    # Global error UI
└── [feature]/
    ├── page.tsx        # Feature page
    ├── layout.tsx      # Feature layout (optional)
    └── loading.tsx     # Feature loading (optional)
```

### Server Components (Default)
Use Server Components by default:

```typescript
// ✅ Good - Server Component (default)
// app/dashboard/page.tsx
import { db } from '@/db'

export default async function DashboardPage() {
  const links = await db.query.links.findMany()
  
  return (
    <div>
      {links.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  )
}
```

Benefits:
- Direct database access
- No client-side bundle size
- Better SEO and performance
- Server-side data fetching

### Client Components
Use Client Components only when needed:

```typescript
// ✅ Good - Client Component when needed
'use client'

import { useState } from 'react'

export function LinkForm() {
  const [url, setUrl] = useState('')
  
  return (
    <form>
      <input 
        type="url" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
      />
    </form>
  )
}
```

Use Client Components for:
- useState, useEffect, useContext
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Third-party libraries that require client-side rendering

### Server Actions
Prefer Server Actions for data mutations:

```typescript
// ✅ Good - Server Action
'use server'

import { db } from '@/db'
import { links } from '@/db/schema'
import { revalidatePath } from 'next/cache'

export async function createLink(formData: FormData) {
  const url = formData.get('url') as string
  
  // Validation
  if (!url || !isValidUrl(url)) {
    return { error: 'Invalid URL' }
  }
  
  // Create short code
  const shortCode = generateShortCode()
  
  // Insert into database
  await db.insert(links).values({
    originalUrl: url,
    shortCode,
    userId: getCurrentUserId(),
  })
  
  // Revalidate cache
  revalidatePath('/dashboard')
  
  return { success: true, shortCode }
}
```

### Data Fetching

#### Fetch in Server Components
```typescript
// ✅ Good - Server Component data fetching
export default async function LinksPage() {
  const links = await db.query.links.findMany({
    where: eq(links.userId, getCurrentUserId()),
    orderBy: desc(links.createdAt),
  })
  
  return <LinksList links={links} />
}
```

#### Streaming with Suspense
```typescript
// ✅ Good - Streaming UI
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<SkeletonLoader />}>
        <LinksList />
      </Suspense>
    </div>
  )
}
```

### Metadata
Define metadata for SEO:

```typescript
// ✅ Good - Static metadata
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Link Shortener',
  description: 'Manage your shortened links',
}

// ✅ Good - Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const link = await getLink(params.id)
  
  return {
    title: `${link.shortCode} | Link Shortener`,
    description: `Shortened link for ${link.originalUrl}`,
  }
}
```

## React Patterns

### Component Structure
Organize components consistently:

```typescript
'use client' // Only if needed

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createLink } from '@/app/actions'

// 1. Types
interface LinkFormProps {
  onSuccess?: (shortCode: string) => void
}

// 2. Component
export function LinkForm({ onSuccess }: LinkFormProps) {
  // 3. Hooks
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // 4. Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await createLink(new FormData(e.currentTarget))
    
    setIsLoading(false)
    
    if (result.success) {
      onSuccess?.(result.shortCode)
      setUrl('')
    }
  }
  
  // 5. Render
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to shorten"
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Shorten'}
      </Button>
    </form>
  )
}
```

### Custom Hooks
Extract reusable logic into custom hooks:

```typescript
// ✅ Good - Custom hook
'use client'

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
function SearchLinks() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  
  useEffect(() => {
    // Search with debounced value
  }, [debouncedSearch])
  
  return <input value={search} onChange={(e) => setSearch(e.target.value)} />
}
```

### Composition over Inheritance
Compose components rather than using inheritance:

```typescript
// ✅ Good - Composition
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border p-4">{children}</div>
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 font-semibold">{children}</div>
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

// Usage
<Card>
  <CardHeader>My Link</CardHeader>
  <CardContent>
    <p>https://example.com</p>
  </CardContent>
</Card>
```

### Prop Drilling - Use Context When Needed
For deeply nested props, use Context:

```typescript
'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## Performance Optimization

### Memoization
Use React.memo for expensive components:

```typescript
import { memo } from 'react'

interface LinkCardProps {
  link: Link
}

export const LinkCard = memo(function LinkCard({ link }: LinkCardProps) {
  return (
    <div>
      <h3>{link.shortCode}</h3>
      <p>{link.originalUrl}</p>
    </div>
  )
})
```

### useCallback and useMemo
```typescript
'use client'

import { useCallback, useMemo } from 'react'

function LinksList({ links }: { links: Link[] }) {
  // Memoize expensive calculations
  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => b.clicks - a.clicks)
  }, [links])
  
  // Memoize callbacks passed to children
  const handleDelete = useCallback((id: string) => {
    // Delete logic
  }, [])
  
  return (
    <>
      {sortedLinks.map(link => (
        <LinkCard key={link.id} link={link} onDelete={handleDelete} />
      ))}
    </>
  )
}
```

### Image Optimization
Always use Next.js Image component:

```typescript
import Image from 'next/image'

// ✅ Good
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority // For above-the-fold images
/>

// ❌ Bad
<img src="/logo.png" alt="Logo" />
```

## Error Handling

### Error Boundaries
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Loading States
```typescript
// app/loading.tsx
export default function Loading() {
  return <div className="animate-spin">Loading...</div>
}
```

## Routing

### Navigation
Use Next.js Link component:

```typescript
import Link from 'next/link'

// ✅ Good
<Link href="/dashboard">Dashboard</Link>

// For programmatic navigation
import { useRouter } from 'next/navigation'

function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/dashboard')
  }
  
  return <button onClick={handleClick}>Go to Dashboard</button>
}
```

### Dynamic Routes
```typescript
// app/links/[id]/page.tsx
interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function LinkPage({ params }: PageProps) {
  const link = await getLink(params.id)
  
  return <div>{link.shortCode}</div>
}
```
