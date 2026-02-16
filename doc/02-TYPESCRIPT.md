# TypeScript Coding Standards

## General Principles
- **Strict Mode**: The project uses `strict: true` in tsconfig.json - maintain this standard
- **Type Safety**: Always prefer explicit types over `any`
- **Type Inference**: Leverage TypeScript's type inference when types are obvious
- **No Implicit Any**: Avoid using `any` unless absolutely necessary

## TypeScript Configuration
The project uses the following TypeScript settings:
```json
{
  "target": "ES2017",
  "strict": true,
  "esModuleInterop": true,
  "moduleResolution": "bundler",
  "jsx": "react-jsx"
}
```

## Type Definitions

### Component Props
Always define prop types explicitly:
```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', disabled, onClick, children }: ButtonProps) {
  // Implementation
}

// ❌ Bad - no type definition
export function Button(props) {
  // Implementation
}
```

### API Responses
Define types for all API responses and database queries:
```typescript
// ✅ Good
interface Link {
  id: string
  shortCode: string
  originalUrl: string
  userId: string
  createdAt: Date
  clicks: number
}

async function getLink(id: string): Promise<Link | null> {
  // Implementation
}

// ❌ Bad - return type not specified
async function getLink(id: string) {
  // Implementation
}
```

### Server Actions
Type all Server Actions properly:
```typescript
// ✅ Good
'use server'

interface CreateLinkResult {
  success: boolean
  shortCode?: string
  error?: string
}

export async function createShortLink(url: string): Promise<CreateLinkResult> {
  // Implementation
}
```

## Type Organization

### Co-located Types
Keep types close to where they're used:
```typescript
// components/LinkCard.tsx
interface LinkCardProps {
  link: Link
  onDelete: (id: string) => void
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  // Implementation
}
```

### Shared Types
For shared types, create a types file:
```typescript
// lib/types.ts or types/index.ts
export interface Link {
  id: string
  shortCode: string
  originalUrl: string
  userId: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
}
```

## Type Guards
Use type guards for runtime type checking:
```typescript
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isLink(obj: unknown): obj is Link {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'shortCode' in obj &&
    'originalUrl' in obj
  )
}
```

## Utility Types
Leverage TypeScript utility types:
```typescript
// Partial for optional fields
type CreateLinkInput = Omit<Link, 'id' | 'createdAt'>

// Pick for selecting specific fields
type LinkPreview = Pick<Link, 'shortCode' | 'originalUrl'>

// Readonly for immutable data
type ReadonlyLink = Readonly<Link>
```

## Enums vs Union Types
Prefer union types over enums for better type safety:
```typescript
// ✅ Good - Union type
type LinkStatus = 'active' | 'expired' | 'disabled'

// ❌ Avoid - Enum (unless you need reverse mapping)
enum LinkStatus {
  Active = 'active',
  Expired = 'expired',
  Disabled = 'disabled'
}
```

## Generic Types
Use generics for reusable type-safe functions:
```typescript
// ✅ Good
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json() as T
}

const link = await fetchData<Link>('/api/links/123')
```

## Null and Undefined
Be explicit about nullable values:
```typescript
// ✅ Good
function findLink(id: string): Link | null {
  // Returns null if not found
}

function getUserName(user: User | undefined): string {
  return user?.name ?? 'Anonymous'
}

// ❌ Bad - unclear if it can be null/undefined
function findLink(id: string): Link {
  // What if not found?
}
```

## Type Assertions
Use type assertions sparingly and safely:
```typescript
// ✅ Good - when you have more information than TypeScript
const input = document.getElementById('url-input') as HTMLInputElement

// ✅ Good - with validation
function processData(data: unknown) {
  if (isLink(data)) {
    // data is now typed as Link
    console.log(data.shortCode)
  }
}

// ❌ Bad - dangerous assertion
const data = apiResponse as Link // No validation!
```

## Async/Await
Always type async functions:
```typescript
// ✅ Good
async function deleteLink(id: string): Promise<void> {
  await db.delete(links).where(eq(links.id, id))
}

async function getLinks(): Promise<Link[]> {
  return db.query.links.findMany()
}
```

## Error Handling
Type errors appropriately:
```typescript
class LinkNotFoundError extends Error {
  constructor(id: string) {
    super(`Link with id ${id} not found`)
    this.name = 'LinkNotFoundError'
  }
}

function handleError(error: unknown): string {
  if (error instanceof LinkNotFoundError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}
```

## Avoid Common Pitfalls

### Don't use `any`
```typescript
// ❌ Bad
function processData(data: any) {
  return data.someProperty
}

// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'someProperty' in data) {
    return (data as { someProperty: string }).someProperty
  }
  throw new Error('Invalid data')
}
```

### Don't ignore TypeScript errors
```typescript
// ❌ Bad
// @ts-ignore
const result = dangerousFunction()

// ✅ Good - fix the underlying issue or use proper type assertion
const result = dangerousFunction() as ExpectedType
```

## React-Specific Types

### Component Types
```typescript
import { ReactNode, FC, PropsWithChildren } from 'react'

// Function component with explicit return type
function MyComponent(): JSX.Element {
  return <div>Hello</div>
}

// With children
interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps): JSX.Element {
  return <div>{children}</div>
}
```

### Event Handlers
```typescript
import { ChangeEvent, FormEvent, MouseEvent } from 'react'

function handleChange(e: ChangeEvent<HTMLInputElement>): void {
  console.log(e.target.value)
}

function handleSubmit(e: FormEvent<HTMLFormElement>): void {
  e.preventDefault()
  // Handle form submission
}

function handleClick(e: MouseEvent<HTMLButtonElement>): void {
  // Handle click
}
```
